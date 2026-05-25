from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.dtos.auth_dto import LoginRequest, LoginResponse, UserResponse, ChangePasswordRequest, MessageResponse
from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.change_password import ChangePasswordUseCase
from app.interfaces.api.dependencies import get_authenticate_use_case, get_change_password_use_case, get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Login",
    description="Autentica o usuário e retorna um JWT Bearer token.",
)
async def login(
    request: LoginRequest,
    use_case: AuthenticateUserUseCase = Depends(get_authenticate_use_case),
) -> LoginResponse:
    return await use_case.execute(request)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Usuário Autenticado",
    description="Retorna os dados do usuário autenticado via JWT.",
)
async def me(current_user: dict = Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        email=current_user["sub"],
        name=current_user["name"],
        role=current_user["role"],
    )


@router.put(
    "/password",
    response_model=MessageResponse,
    summary="Alterar Senha",
    description="Altera a senha do usuário autenticado. Requer senha atual e nova senha forte (8+ chars, maiúscula, minúscula, número, especial).",
)
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    use_case: ChangePasswordUseCase = Depends(get_change_password_use_case),
) -> MessageResponse:
    return await use_case.execute(current_user["sub"], request)
