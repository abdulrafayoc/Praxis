import os
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from twilio.request_validator import RequestValidator

class TwilioSignatureMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, twilio_auth_token: str = None):
        super().__init__(app)
        self.auth_token = twilio_auth_token or os.getenv("TWILIO_AUTH_TOKEN", "")
        self.validator = RequestValidator(self.auth_token)

    async def dispatch(self, request: Request, call_next):
        # Only validate Twilio webhook endpoints
        if request.url.path.startswith("/api/twilio/webhook"):
            signature = request.headers.get("X-Twilio-Signature", "")
            
            # Need to get form data for validation
            body = await request.body()
            form_data = {}
            if body:
                # Assuming application/x-www-form-urlencoded
                from urllib.parse import parse_qsl
                form_data = dict(parse_qsl(body.decode('utf-8')))

            url = str(request.url)
            # Twilio URL may use https in production even if request is http behind a proxy
            if "x-forwarded-proto" in request.headers and request.headers["x-forwarded-proto"] == "https":
                url = url.replace("http://", "https://")

            if not self.validator.validate(url, form_data, signature):
                raise HTTPException(status_code=403, detail="Invalid Twilio signature")
            
            # Restore the request body since we read it
            async def receive():
                return {"type": "http.request", "body": body}
            request._receive = receive

        response = await call_next(request)
        return response
