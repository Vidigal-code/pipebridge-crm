from __future__ import annotations

import asyncio
import json
import logging

logger = logging.getLogger(__name__)


class SNSService:
    def __init__(self, sns_client, topic_name: str):
        self._client = sns_client
        self._topic_name = topic_name
        self._topic_arn = None

    async def _get_topic_arn(self) -> str:
        if not self._topic_arn:
            response = await asyncio.to_thread(self._client.list_topics)
            for topic in response.get("Topics", []):
                if self._topic_name in topic["TopicArn"]:
                    self._topic_arn = topic["TopicArn"]
                    break
        return self._topic_arn

    async def publish(self, subject: str, message: dict) -> str:
        topic_arn = await self._get_topic_arn()
        if not topic_arn:
            logger.warning("SNS topic %s not found", self._topic_name)
            return ""
        response = await asyncio.to_thread(
            self._client.publish,
            TopicArn=topic_arn,
            Subject=subject,
            Message=json.dumps(message, ensure_ascii=False, default=str),
        )
        message_id = response["MessageId"]
        logger.info("SNS notification published: %s", message_id)
        return message_id
