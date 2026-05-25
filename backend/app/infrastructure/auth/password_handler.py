from __future__ import annotations

import hashlib
import hmac
import secrets


class PasswordHandler:
    _ALGORITHM = "sha256"
    _ITERATIONS = 100_000

    @staticmethod
    def hash(password: str) -> str:
        salt = secrets.token_hex(16)
        key = hashlib.pbkdf2_hmac(
            PasswordHandler._ALGORITHM,
            password.encode(),
            salt.encode(),
            PasswordHandler._ITERATIONS,
        )
        return f"{salt}:{key.hex()}"

    @staticmethod
    def verify(password: str, hashed: str) -> bool:
        salt, stored_key = hashed.split(":")
        new_key = hashlib.pbkdf2_hmac(
            PasswordHandler._ALGORITHM,
            password.encode(),
            salt.encode(),
            PasswordHandler._ITERATIONS,
        )
        return hmac.compare_digest(new_key.hex(), stored_key)
