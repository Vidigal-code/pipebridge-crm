from __future__ import annotations

import asyncio
import json
import logging

logger = logging.getLogger(__name__)


class SQSService:
    def __init__(self, sqs_client, queue_name: str):
        self._client = sqs_client
        self._queue_name = queue_name
        self._queue_url = None

    async def _get_queue_url(self) -> str:
        if not self._queue_url:
            response = await asyncio.to_thread(
                self._client.get_queue_url, QueueName=self._queue_name
            )
            self._queue_url = response["QueueUrl"]
        return self._queue_url

    async def send_message(self, body: dict) -> str:
        queue_url = await self._get_queue_url()
        response = await asyncio.to_thread(
            self._client.send_message,
            QueueUrl=queue_url,
            MessageBody=json.dumps(body, ensure_ascii=False, default=str),
        )
        message_id = response["MessageId"]
        logger.info("SQS message sent: %s", message_id)
        return message_id
