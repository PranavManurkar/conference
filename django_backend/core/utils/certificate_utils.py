"""
Certificate generation utility — 2D MatTech Global 2026.

TEMPLATE STRUCTURE (certificate_template.jpeg, 3456×2304 px):
  ALL static text is baked into the image. We overlay ONLY four dynamic
  values on top. The template contains visible placeholder text ({Name},
  {Institute}) and baked labels ("Presentation mode:", "Title:") that must
  be handled carefully.

INPAINTING STRATEGY:
  The template has baked "{Name}" and "{Institute}" placeholder text that
  must be erased before drawing real values. We use background-row tiling
  (copy a clean row from just above the placeholder zone and tile it over
  the dirty rows). This preserves the globe watermark gradient — no solid
  white box appears. Same technique erases the "Presentation mode:" and
  "Title:" labels when their values are blank.

TRANSPARENCY:
  All dynamic text is drawn onto a fully-transparent RGBA overlay, then
  alpha-composited onto the template. This guarantees zero background
  rectangles or highlight bands behind any glyph.

FONT FAMILY: Garamond (Windows system fonts)
  Regular  → C:/WINDOWS/fonts/GARA.TTF
  Italic   → C:/WINDOWS/fonts/GARAIT.TTF   (Name field: mildly cursive serif)
  Bold     → C:/WINDOWS/fonts/GARABD.TTF   (not used for overlay; conf line is baked)
  Selection rationale: Garamond Regular 83pt renders "This is to certify that"
  at 670px, matching the 671px measured directly from the template — perfect
  calibration with zero guesswork.

BASE_SIZE = 83 pt
  All font sizes are multipliers of this constant only:
    Name          → 95pt  (BASE_SIZE * 1.15, italic)
    Institute     → 83pt  (BASE_SIZE * 1.00, regular)
    Mode value    → 79pt  (BASE_SIZE * 0.95, regular)
    Title value   → 79pt  (BASE_SIZE * 0.95, regular)
  Floor for shrink-to-fit: 62pt (BASE_SIZE * 0.75)

SLOT POSITIONS (measured from template):
  Name slot:      y=922..978,   center_x=1728
  Institute slot: y=1111..1160, center_x=1728
  Mode value:     y=1546,       x=169  (replaces baked "Presentation mode:" label+value)
  Title value:    y=1640,       x=169  (replaces baked "Title:" label+value)
  Signature safe floor: y=2090
"""


import hashlib
import io
import os
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_HERE = Path(__file__).resolve().parent.parent   # core/
TEMPLATE_PATH = _HERE / "static" / "certificate_template.jpg"

# -------------------------------------------------------------------------
# Font paths — Poppins (bundled in core/static/fonts/) with Linux fallbacks
# -------------------------------------------------------------------------
_FONTS_DIR = _HERE / "static" / "fonts"

_FONTS = {
    "regular": [
        str(_FONTS_DIR / "Poppins-Regular.ttf"),
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
    ],
    "italic": [
        str(_FONTS_DIR / "Poppins-Italic.ttf"),
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerifItalic.ttf",
    ],
    "semibold": [
        str(_FONTS_DIR / "Poppins-SemiBold.ttf"),
        str(_FONTS_DIR / "Poppins-Bold.ttf"),
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    ],
    "semibold-italic": [
        str(_FONTS_DIR / "Poppins-SemiBoldItalic.ttf"),
        str(_FONTS_DIR / "Poppins-Italic.ttf"),
        "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf",
    ],
    "bold": [
        str(_FONTS_DIR / "Poppins-Bold.ttf"),
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf",
    ],
}

# ---------------------------------------------------------------------------
# Template constants (3456×2304 px)
# ---------------------------------------------------------------------------
TEMPLATE_W   = 3456
TEMPLATE_H   = 2304
CENTER_X     = TEMPLATE_W // 2   # 1728
LEFT_MARGIN  = 169               # left edge of Presentation mode label (measured)
RIGHT_MARGIN = 169
AVAIL_W      = TEMPLATE_W - LEFT_MARGIN - RIGHT_MARGIN   # 3118 px

# ── Inpaint zones: (x0, y0, x1, y1, sample_y) ────────────────────────────
# sample_y: a row with ZERO dark pixels in x0..x1 — used as background tile.
_INPAINT = {
    # {Name} placeholder — baked text y=922..978, padded ±8px
    "name":       (1200, 914, 2300, 986,  910),
    # {Institute} placeholder — baked text y=1113..1170, padded ±8px
    "institute":  (1200, 1105, 2300, 1178, 1100),
    # Baked "Presentation mode:" label — erased when value is blank
    # Full label span y=1544..1601, x=100..870; sample from y=1460
    "mode_label": (100,  1540, 870,  1608, 1460),
    # Baked "Title:" label — erased when value is blank
    # Full label span y=1640..1697, x=100..380; sample from y=1610
    "title_label":(100,  1636, 380,  1704, 1610),
}

# ── Dynamic text slot positions ───────────────────────────────────────────
# Name/Institute: y = top of slot, centered at CENTER_X
# Mode/Title: y = top of baked label row, left-aligned at LEFT_MARGIN
NAME_Y       = 890
INSTITUTE_Y  = 1065
MODE_Y       = 1546
TITLE_Y      = 1640
SIG_FLOOR    = 2090   # no text may extend below this y

# ── Font sizes (all derived from BASE_SIZE = 83) ─────────────────────────
BASE_SIZE    = 83
NAME_SIZE    = BASE_SIZE                  # 83 pt — same size as all other text
FIELD_SIZE   = BASE_SIZE                  # 83 pt — unified size across certificate
FLOOR_SIZE   = round(BASE_SIZE * 0.75)   # 62 pt — minimum readable

# Gap between Mode row and Title row (px)
MODE_TITLE_GAP = round(BASE_SIZE * 0.55)  # 45 px

# Text colour — near-black matching template ink
TEXT_COLOR   = (15, 15, 15, 255)          # RGBA

# ---------------------------------------------------------------------------
# Font loader
# ---------------------------------------------------------------------------

def _load_font(style: str, size: int) -> ImageFont.FreeTypeFont:
    for path in _FONTS.get(style, _FONTS["regular"]):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    import warnings
    warnings.warn(f"No TTF found for style={style!r}; using PIL built-in fallback.")
    return ImageFont.load_default()


# ---------------------------------------------------------------------------
# Text measurement helpers
# ---------------------------------------------------------------------------

def _tw(draw: ImageDraw.ImageDraw, text: str, font) -> int:
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0]

def _th(draw: ImageDraw.ImageDraw, text: str, font) -> int:
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[3] - bb[1]

def _fit(draw: ImageDraw.ImageDraw, text: str, style: str,
         start: int, max_w: int) -> tuple:
    """Shrink font 1pt/step from start down to FLOOR_SIZE until text <= max_w.
    Returns (font, size).
    """
    size = start
    font = _load_font(style, size)
    while size > FLOOR_SIZE and _tw(draw, text, font) > max_w:
        size -= 1
        font = _load_font(style, size)
    return font, size


# ---------------------------------------------------------------------------
# Inpainting helper
# ---------------------------------------------------------------------------

def _inpaint(arr, key: str):
    """Tile a clean background row over the placeholder/label zone in-place."""
    x0, y0, x1, y1, sy = _INPAINT[key]
    bg = arr[sy, x0:x1, :].copy()
    for y in range(y0, y1):
        arr[y, x0:x1, :] = bg


# ---------------------------------------------------------------------------
# PNG generation
# ---------------------------------------------------------------------------

def _generate_png(name: str, institute: str,
                  presentation_mode: str, title: str) -> bytes:
    import numpy as np

    # ── 1. Load and inpaint ───────────────────────────────────────────────
    img = Image.open(TEMPLATE_PATH).convert("RGB")
    if img.size != (TEMPLATE_W, TEMPLATE_H):
        import warnings
        warnings.warn(
            f"Template size {img.size} != ({TEMPLATE_W}×{TEMPLATE_H}). "
            "Coordinates may be off — re-calibrate if template was replaced."
        )

    arr = np.array(img)

    # Always erase baked {Name} and {Institute} placeholder text
    _inpaint(arr, "name")
    _inpaint(arr, "institute")

    # Always erase baked "Presentation mode:" and "Title:" labels — we redraw
    # them ourselves as "Presentation mode: [value]" / "Title: [value]".
    # When the value is blank we simply don't redraw, leaving the area clean.
    _inpaint(arr, "mode_label")
    _inpaint(arr, "title_label")

    # ── 2. Build transparent overlay ─────────────────────────────────────
    # Convert back to PIL with the inpainted array, then make RGBA
    base = Image.fromarray(arr).convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # ── 3. Draw Name ──────────────────────────────────────────────────────
    if name:
        font, _ = _fit(draw, name, "semibold-italic", NAME_SIZE, AVAIL_W)
        w = _tw(draw, name, font)
        x = CENTER_X - w // 2
        draw.text((x, NAME_Y), name, font=font, fill=TEXT_COLOR)

    # ── 4. Draw Institute ─────────────────────────────────────────────────
    if institute:
        font, size = _fit(draw, institute, "regular", BASE_SIZE, AVAIL_W)
        w = _tw(draw, institute, font)
        if w <= AVAIL_W:
            x = CENTER_X - w // 2
            draw.text((x, INSTITUTE_Y), institute, font=font, fill=TEXT_COLOR)
        else:
            # Still over width at floor — split into 2 centered lines
            words = institute.split()
            mid = len(words) // 2
            for i, chunk in enumerate([" ".join(words[:mid]), " ".join(words[mid:])]):
                f2, _ = _fit(draw, chunk, "regular", size, AVAIL_W)
                cw = _tw(draw, chunk, f2)
                cx = CENTER_X - cw // 2
                ch = _th(draw, chunk, f2)
                draw.text((cx, INSTITUTE_Y + i * (ch + 8)), chunk,
                          font=f2, fill=TEXT_COLOR)

    # ── 5. Draw Presentation mode (label + value, left-aligned) ──────────
    # presentation_mode is always a non-empty string ("N/A" when not supplied)
    _PM_LABEL = "Presentation mode: "
    font_pm_label, pm_sz = _fit(draw, _PM_LABEL + presentation_mode, "regular", FIELD_SIZE, AVAIL_W)
    font_pm_value = _load_font("bold", pm_sz)
    pm_label_w = _tw(draw, _PM_LABEL, font_pm_label)
    draw.text((LEFT_MARGIN, MODE_Y), _PM_LABEL, font=font_pm_label, fill=TEXT_COLOR)
    draw.text((LEFT_MARGIN + pm_label_w, MODE_Y), presentation_mode, font=font_pm_value, fill=TEXT_COLOR)

    # ── 6. Draw Title (label + value, with wrap-to-centered overflow) ─────
    # title is always a non-empty string ("N/A" when not supplied)
    _T_LABEL = "Title: "
    font_t_label, t_size = _fit(draw, _T_LABEL + title, "semibold", FIELD_SIZE, AVAIL_W)
    font_t_value = _load_font("regular", t_size)
    t_label_w = _tw(draw, _T_LABEL, font_t_label)
    t_value_w = _tw(draw, title, font_t_value)

    if t_label_w + t_value_w <= AVAIL_W:
        draw.text((LEFT_MARGIN, TITLE_Y), _T_LABEL, font=font_t_label, fill=TEXT_COLOR)
        draw.text((LEFT_MARGIN + t_label_w, TITLE_Y), title, font=font_t_value, fill=TEXT_COLOR)
    else:
        value_avail = AVAIL_W - t_label_w
        char_budget = max(10, int(len(title) * value_avail / max(t_value_w, 1)))
        chunks = textwrap.wrap(title, width=char_budget)
        first_chunk = chunks[0] if chunks else title

        draw.text((LEFT_MARGIN, TITLE_Y), _T_LABEL, font=font_t_label, fill=TEXT_COLOR)
        draw.text((LEFT_MARGIN + t_label_w, TITLE_Y), first_chunk, font=font_t_value, fill=TEXT_COLOR)

        y_cur = TITLE_Y + _th(draw, first_chunk, font_t_value) + 8
        for chunk in chunks[1:]:
            lf, _ = _fit(draw, chunk, "regular", t_size, AVAIL_W)
            lw = _tw(draw, chunk, lf)
            lh = _th(draw, chunk, lf)
            draw.text((CENTER_X - lw // 2, y_cur), chunk, font=lf, fill=TEXT_COLOR)
            y_cur += lh + 8

    # ── 7. Composite and export ───────────────────────────────────────────
    result = Image.alpha_composite(base, overlay)
    buf = io.BytesIO()
    result.convert("RGB").save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

_template_hash_cache: dict = {}


def get_template_hash() -> str:
    """
    Return MD5 hex digest of the current certificate template file.
    Cached in memory — clears on pm2 restart, which is exactly when
    a new template deployment takes effect.
    """
    global _template_hash_cache
    if "hash" not in _template_hash_cache:
        if not TEMPLATE_PATH.exists():
            raise FileNotFoundError(
                f"Certificate template not found at {TEMPLATE_PATH}."
            )
        md5 = hashlib.md5()
        with open(TEMPLATE_PATH, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                md5.update(chunk)
        _template_hash_cache["hash"] = md5.hexdigest()
    return _template_hash_cache["hash"]


def generate_certificate(
    name: str,
    institute: str,
    presentation_mode: str = None,
    title: str = None,
) -> bytes:
    """
    Generate a Certificate of Participation.
    Returns png_bytes.
    Raises FileNotFoundError if the template image is missing.

    presentation_mode and title default to None; passing None or empty string
    substitutes "N/A" so every certificate always shows both fields.
    """
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(
            f"Certificate template not found at {TEMPLATE_PATH}. "
            "Place certificate_template.jpeg in core/static/ first."
        )

    name              = (name or "").strip()
    institute         = (institute or "").strip()
    presentation_mode = (presentation_mode or "").strip() or "N/A"
    title             = (title or "").strip() or "N/A"

    return _generate_png(name, institute, presentation_mode, title)
