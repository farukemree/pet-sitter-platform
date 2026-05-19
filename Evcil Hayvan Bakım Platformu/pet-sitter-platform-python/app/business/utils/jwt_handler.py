"""
JWT Handler - JWT Token Yonetimi

JWT token uretimi ve dogrulama islemlerini yapar.
"""

import os
from datetime import datetime, timedelta

import jwt

from app.shared.exceptions import AuthenticationError


class JWTHandler:
    """
    JWT token yonetim sinifi

    Token uretme ve dogrulama islemlerini saglar.
    """

    SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        os.getenv("JWT_SECRET", "dev-secret-key-change-in-production"),
    )
    EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    ALGORITHM = "HS256"

    def generate_token(self, user_id, email, role):
        payload = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=self.EXPIRATION_HOURS),
        }
        token = jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
        if isinstance(token, bytes):
            return token.decode("utf-8")
        return token

    def verify_token(self, token):
        try:
            return jwt.decode(
                token, self.SECRET_KEY, algorithms=[self.ALGORITHM]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationError(
                "Token suresi dolmus. Lutfen tekrar giris yapin"
            ) from None
        except jwt.InvalidTokenError:
            raise AuthenticationError("Gecersiz token") from None

    def decode_token(self, token):
        try:
            return jwt.decode(token, options={"verify_signature": False})
        except Exception:
            return None
