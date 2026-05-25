from __future__ import annotations

from datetime import datetime, timedelta

import jwt


class JWTHandler:
    _ALGORITHM = "HS256"

    def __init__(self, secret: str, expiration_minutes: int):
        self._secret = secret
        self._expiration = expiration_minutes

    def create_token(self, payload: dict) -> str:
        data = {
            **payload,
            "exp": datetime.utcnow() + timedelta(minutes=self._expiration),
            "iat": datetime.utcnow(),
        }
        return jwt.encode(data, self._secret, algorithm=self._ALGORITHM)

    def decode_token(self, token: str) -> dict:
        return jwt.decode(token, self._secret, algorithms=[self._ALGORITHM])
