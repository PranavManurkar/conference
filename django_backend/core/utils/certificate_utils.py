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
  Institute slot: y=1113..1170, center_x=1728
  Mode value:     y=1546,       x=169  (replaces baked "Presentation mode:" label+value)
  Title value:    y=1640,       x=169  (replaces baked "Title:" label+value)
  Signature safe floor: y=2090
"""


import io
import os
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
_HERE = Path(__file__).resolve().parent.parent   # core/
TEMPLATE_PATH = _HERE / "static" / "certificate_template.jpeg"

# ---------------------------------------------------------------------------
# Font paths — Windows. Linux: install fonts-urw-base35 or copy TTFs to
# core/static/fonts/ and update these paths.
# ---------------------------------------------------------------------------
_FONTS = {
    "regular": [r"C:/WINDOWS/fonts/GARA.TTF",   r"C:/WINDOWS/fonts/times.ttf"],
    "italic":  [r"C:/WINDOWS/fonts/GARAIT.TTF",  r"C:/WINDOWS/fonts/timesi.ttf"],
    "bold":    [r"C:/WINDOWS/fonts/GARABD.TTF",  r"C:/WINDOWS/fonts/timesbd.ttf"],
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
NAME_Y       = 922
INSTITUTE_Y  = 1113
MODE_Y       = 1546
TITLE_Y      = 1640
SIG_FLOOR    = 2090   # no text may extend below this y

# ── Font sizes (all derived from BASE_SIZE = 83) ─────────────────────────
BASE_SIZE    = 83
NAME_SIZE    = round(BASE_SIZE * 1.15)   # 95 pt — italic, slightly larger
FIELD_SIZE   = round(BASE_SIZE * 0.95)   # 79 pt — mode and title values
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
        font, _ = _fit(draw, name, "italic", NAME_SIZE, AVAIL_W)
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
    label_val = f"Presentation mode: {presentation_mode}"
    font_pm, _ = _fit(draw, label_val, "regular", FIELD_SIZE, AVAIL_W)
    draw.text((LEFT_MARGIN, MODE_Y), label_val, font=font_pm, fill=TEXT_COLOR)

    # ── 6. Draw Title (label + value, with wrap-to-centered overflow) ─────
    # title is always a non-empty string ("N/A" when not supplied)
    full_line = f"Title: {title}"
    font_t, t_size = _fit(draw, full_line, "regular", FIELD_SIZE, AVAIL_W)

    if _tw(draw, full_line, font_t) <= AVAIL_W:
        # Fits on one line
        draw.text((LEFT_MARGIN, TITLE_Y), full_line, font=font_t, fill=TEXT_COLOR)
    else:
        # Wrap: estimate char budget at floor size, then use textwrap
        sw_full = _tw(draw, full_line, font_t)
        char_budget = max(10, int(len(full_line) * AVAIL_W / sw_full))
        chunks = textwrap.wrap(title, width=char_budget)
        display_lines = [f"Title: {chunks[0]}"] + (chunks[1:] if len(chunks) > 1 else [])

        y_cur = TITLE_Y
        for i, line in enumerate(display_lines):
            lf, _ = _fit(draw, line, "regular", t_size, AVAIL_W)
            lh = _th(draw, line, lf)
            if i == 0:
                draw.text((LEFT_MARGIN, y_cur), line, font=lf, fill=TEXT_COLOR)
            else:
                lw = _tw(draw, line, lf)
                draw.text((CENTER_X - lw // 2, y_cur), line, font=lf, fill=TEXT_COLOR)
            y_cur += lh + 8

    # ── 7. Composite and export ───────────────────────────────────────────
    result = Image.alpha_composite(base, overlay)
    buf = io.BytesIO()
    result.convert("RGB").save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

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
