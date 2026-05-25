from __future__ import annotations

import os
import pytest
import boto3
from moto import mock_aws
from fastapi.testclient import TestClient

os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
os.environ["AWS_ACCESS_KEY_ID"] = "test"
os.environ["AWS_SECRET_ACCESS_KEY"] = "test"
os.environ["AWS_ENDPOINT_URL"] = ""
os.environ["ADMIN_EMAIL"] = "admin@mundoinvest.com"
os.environ["ADMIN_PASSWORD"] = "Admin@12345"
os.environ["JWT_SECRET"] = "test-jwt-secret"


def _create_tables(dynamodb):
    dynamodb.create_table(
        TableName="clients",
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "id", "AttributeType": "S"},
            {"AttributeName": "cliente_email", "AttributeType": "S"},
        ],
        GlobalSecondaryIndexes=[{
            "IndexName": "email-index",
            "KeySchema": [{"AttributeName": "cliente_email", "KeyType": "HASH"}],
            "Projection": {"ProjectionType": "ALL"},
        }],
        BillingMode="PAY_PER_REQUEST",
    )
    dynamodb.create_table(
        TableName="webhook_events",
        KeySchema=[{"AttributeName": "event_id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "event_id", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )
    dynamodb.create_table(
        TableName="users",
        KeySchema=[{"AttributeName": "email", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "email", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )


def _seed_admin(dynamodb):
    from app.infrastructure.auth.password_handler import PasswordHandler
    from app.domain.enums.role import Role

    table = dynamodb.Table("users")
    table.put_item(Item={
        "email": "admin@mundoinvest.com",
        "id": "admin-id",
        "name": "Administrador",
        "password_hash": PasswordHandler.hash("Admin@12345"),
        "role": Role.ADMIN,
        "created_at": "2026-01-01T00:00:00",
    })


def _create_queues(sqs):
    sqs.create_queue(QueueName="pipebridge-webhooks")


def _create_topics(sns):
    sns.create_topic(Name="pipebridge-notifications")


def _build_mock_pipefy():
    from unittest.mock import AsyncMock
    from app.infrastructure.external.pipefy_client import PipefyResult, PipefyStatus

    mock = AsyncMock()
    mock.create_card = AsyncMock(return_value=PipefyResult(
        status=PipefyStatus.SIMULATED,
        data={"data": {"createCard": {"card": {"id": "mock_card_id"}}}},
    ))
    mock.update_card_fields = AsyncMock(return_value=PipefyResult(
        status=PipefyStatus.SIMULATED,
        data={"data": {"updateFieldsValues": {"success": True}}},
    ))
    return mock


def _build_overrides(aws_resources):
    from app.infrastructure.aws.sqs import SQSService
    from app.infrastructure.aws.sns import SNSService
    from app.infrastructure.repositories.dynamodb_client_repository import DynamoDBClientRepository
    from app.infrastructure.repositories.dynamodb_webhook_event_repository import DynamoDBWebhookEventRepository
    from app.infrastructure.repositories.dynamodb_user_repository import DynamoDBUserRepository
    from app.interfaces.api.dependencies import (
        get_client_repository,
        get_event_repository,
        get_sqs_service,
        get_sns_service,
        get_user_repository,
        get_pipefy_client,
    )

    dynamodb = aws_resources["dynamodb"]
    sqs = aws_resources["sqs"]
    sns = aws_resources["sns"]

    mock_pipefy = _build_mock_pipefy()

    return {
        get_client_repository: lambda: DynamoDBClientRepository(dynamodb.Table("clients")),
        get_event_repository: lambda: DynamoDBWebhookEventRepository(dynamodb.Table("webhook_events")),
        get_user_repository: lambda: DynamoDBUserRepository(dynamodb.Table("users")),
        get_sqs_service: lambda: SQSService(sqs, "pipebridge-webhooks"),
        get_sns_service: lambda: SNSService(sns, "pipebridge-notifications"),
        get_pipefy_client: lambda: mock_pipefy,
    }


@pytest.fixture(scope="function")
def aws_resources():
    with mock_aws():
        dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
        sqs = boto3.client("sqs", region_name="us-east-1")
        sns = boto3.client("sns", region_name="us-east-1")

        _create_tables(dynamodb)
        _seed_admin(dynamodb)
        _create_queues(sqs)
        _create_topics(sns)

        yield {"dynamodb": dynamodb, "sqs": sqs, "sns": sns}


@pytest.fixture(scope="function")
def client(aws_resources):
    from app.main import app

    app.dependency_overrides = _build_overrides(aws_resources)

    with TestClient(app) as test_client:
        response = test_client.post(
            "/auth/login",
            json={"email": "admin@mundoinvest.com", "password": "Admin@12345"},
        )
        token = response.json()["access_token"]
        test_client.headers = {"Authorization": f"Bearer {token}"}
        yield test_client

    app.dependency_overrides.clear()
