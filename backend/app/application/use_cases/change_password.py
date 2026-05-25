from __future__ import annotations

from fastapi import HTTPException, status

from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.auth.password_handler import PasswordHandler
from app.application.dtos.auth_dto import ChangePasswordRequest, MessageResponse, PASSWORD_PATTERN


class ChangePasswordUseCase:
    def __init__(self, user_repo: UserRepository):
        self._user_repo = user_repo

    async def execute(self, email: str, request: ChangePasswordRequest) -> MessageResponse:
        user = await self._user_repo.find_by_email(email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

        if not PasswordHandler.verify(request.old_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha atual incorreta")

        self._validate_strength(request.new_password)

        user.password_hash = PasswordHandler.hash(request.new_password)
        await self._user_repo.update_password(user)
        return MessageResponse(message="Senha alterada com sucesso")

    def _validate_strength(self, password: str) -> None:
        if not PASSWORD_PATTERN.match(password):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Senha deve ter 8+ caracteres, maiúscula, minúscula, número e especial (@$!%*?&)",
            )
