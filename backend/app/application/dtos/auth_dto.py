from __future__ import annotations

import re

from pydantic import BaseModel, Field

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")


class LoginRequest(BaseModel):
    email: str = Field(min_length=1, json_schema_extra={"examples": ["admin@mundoinvest.com"]})
    password: str = Field(min_length=1, json_schema_extra={"examples": ["Admin@12345"]})

    model_config = {"json_schema_extra": {"examples": [{"email": "admin@mundoinvest.com", "password": "Admin@12345"}]}}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str
    name: str


class UserResponse(BaseModel):
    email: str
    name: str
    role: str


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)

    model_config = {"json_schema_extra": {"examples": [{"old_password": "Admin@12345", "new_password": "NewPass@2026"}]}}


class MessageResponse(BaseModel):
    message: str
