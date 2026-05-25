from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config.settings import get_settings, Settings
from app.infrastructure.aws.client_factory import AWSClientFactory
from app.infrastructure.aws.sqs import SQSService
from app.infrastructure.aws.sns import SNSService
from app.infrastructure.auth.jwt_handler import JWTHandler
from app.infrastructure.repositories.dynamodb_client_repository import DynamoDBClientRepository
from app.infrastructure.repositories.dynamodb_webhook_event_repository import DynamoDBWebhookEventRepository
from app.infrastructure.repositories.dynamodb_user_repository import DynamoDBUserRepository
from app.infrastructure.external.pipefy_client import PipefyClient
from app.application.use_cases.create_client import CreateClientUseCase
from app.application.use_cases.process_webhook import ProcessWebhookUseCase
from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.change_password import ChangePasswordUseCase

_bearer_scheme = HTTPBearer()


def get_aws_factory(settings: Settings = Depends(get_settings)) -> AWSClientFactory:
    return AWSClientFactory(settings)


def get_jwt_handler(settings: Settings = Depends(get_settings)) -> JWTHandler:
    return JWTHandler(settings.jwt_secret, settings.jwt_expiration_minutes)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> dict:
    handler = JWTHandler(settings.jwt_secret, settings.jwt_expiration_minutes)
    try:
        return handler.decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )


def get_client_repository(
    settings: Settings = Depends(get_settings),
    factory: AWSClientFactory = Depends(get_aws_factory),
) -> DynamoDBClientRepository:
    dynamodb = factory.dynamodb_resource()
    return DynamoDBClientRepository(dynamodb.Table(settings.dynamodb_clients_table))


def get_event_repository(
    settings: Settings = Depends(get_settings),
    factory: AWSClientFactory = Depends(get_aws_factory),
) -> DynamoDBWebhookEventRepository:
    dynamodb = factory.dynamodb_resource()
    return DynamoDBWebhookEventRepository(dynamodb.Table(settings.dynamodb_events_table))


def get_user_repository(
    settings: Settings = Depends(get_settings),
    factory: AWSClientFactory = Depends(get_aws_factory),
) -> DynamoDBUserRepository:
    dynamodb = factory.dynamodb_resource()
    return DynamoDBUserRepository(dynamodb.Table(settings.dynamodb_users_table))


def get_sqs_service(
    settings: Settings = Depends(get_settings),
    factory: AWSClientFactory = Depends(get_aws_factory),
) -> SQSService:
    return SQSService(factory.sqs_client(), settings.sqs_queue_name)


def get_sns_service(
    settings: Settings = Depends(get_settings),
    factory: AWSClientFactory = Depends(get_aws_factory),
) -> SNSService:
    return SNSService(factory.sns_client(), settings.sns_topic_name)


async def get_pipefy_client() -> PipefyClient:
    return PipefyClient()


def get_create_client_use_case(
    client_repo: DynamoDBClientRepository = Depends(get_client_repository),
    pipefy: PipefyClient = Depends(get_pipefy_client),
    sns: SNSService = Depends(get_sns_service),
) -> CreateClientUseCase:
    return CreateClientUseCase(client_repo, pipefy, sns)


def get_process_webhook_use_case(
    client_repo: DynamoDBClientRepository = Depends(get_client_repository),
    event_repo: DynamoDBWebhookEventRepository = Depends(get_event_repository),
    pipefy: PipefyClient = Depends(get_pipefy_client),
    sqs: SQSService = Depends(get_sqs_service),
    sns: SNSService = Depends(get_sns_service),
) -> ProcessWebhookUseCase:
    return ProcessWebhookUseCase(client_repo, event_repo, pipefy, sqs, sns)


def get_authenticate_use_case(
    user_repo: DynamoDBUserRepository = Depends(get_user_repository),
    jwt_handler: JWTHandler = Depends(get_jwt_handler),
) -> AuthenticateUserUseCase:
    return AuthenticateUserUseCase(user_repo, jwt_handler)


def get_change_password_use_case(
    user_repo: DynamoDBUserRepository = Depends(get_user_repository),
) -> ChangePasswordUseCase:
    return ChangePasswordUseCase(user_repo)
