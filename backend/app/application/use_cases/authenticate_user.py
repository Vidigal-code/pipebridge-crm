from __future__ import annotations

from fastapi import HTTPException, status

from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.auth.password_handler import PasswordHandler
from app.infrastructure.auth.jwt_handler import JWTHandler
from app.application.dtos.auth_dto import LoginRequest, LoginResponse


class AuthenticateUserUseCase:
    def __init__(self, user_repo: UserRepository, jwt_handler: JWTHandler):
        self._user_repo = user_repo
        self._jwt_handler = jwt_handler

    async def execute(self, request: LoginRequest) -> LoginResponse:
        user = await self._user_repo.find_by_email(request.email)
        if not user or not PasswordHandler.verify(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas",
            )
        token = self._jwt_handler.create_token({
            "sub": user.email,
            "role": user.role,
            "name": user.name,
        })
        return LoginResponse(
            access_token=token,
            role=user.role,
            email=user.email,
            name=user.name,
        )
