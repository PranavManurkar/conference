from rest_framework.throttling import SimpleRateThrottle


class WorkshopLookupThrottle(SimpleRateThrottle):
    scope = "workshop_lookup"

    def get_cache_key(self, request, view):
        email = (request.query_params.get("email") or "").lower().strip()
        reference = (
            request.query_params.get("registration_reference")
            or request.query_params.get("registration_id")
            or ""
        ).strip().upper()

        if email and reference:
            return f"throttle:workshop_lookup:{email}:{reference}"
        return self.get_ident(request)


class WorkshopSubmitThrottle(SimpleRateThrottle):
    scope = "workshop_submit"

    def get_cache_key(self, request, view):
        email = (request.data.get("email") or "").lower().strip()
        registration_id = str(request.data.get("registration_id") or "").strip()

        if email and registration_id:
            return f"throttle:workshop_submit:{email}:{registration_id}"
        return self.get_ident(request)
