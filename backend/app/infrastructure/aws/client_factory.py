from __future__ import annotations

import boto3
from app.config.settings import Settings


class AWSClientFactory:
    def __init__(self, settings: Settings):
        self._kwargs = self._build_kwargs(settings)

    def _build_kwargs(self, settings: Settings) -> dict:
        kwargs = {
            "region_name": settings.aws_default_region,
            "aws_access_key_id": settings.aws_access_key_id,
            "aws_secret_access_key": settings.aws_secret_access_key,
        }
        if settings.aws_endpoint_url:
            kwargs["endpoint_url"] = settings.aws_endpoint_url
        return kwargs

    def dynamodb_resource(self):
        return boto3.resource("dynamodb", **self._kwargs)

    def sqs_client(self):
        return boto3.client("sqs", **self._kwargs)

    def sns_client(self):
        return boto3.client("sns", **self._kwargs)
