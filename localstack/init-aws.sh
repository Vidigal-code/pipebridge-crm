#!/bin/bash

awslocal dynamodb create-table \
  --table-name clients \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=cliente_email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"email-index\",\"KeySchema\":[{\"AttributeName\":\"cliente_email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

awslocal dynamodb create-table \
  --table-name webhook_events \
  --attribute-definitions AttributeName=event_id,AttributeType=S \
  --key-schema AttributeName=event_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

awslocal dynamodb update-time-to-live \
  --table-name webhook_events \
  --time-to-live-specification "Enabled=true,AttributeName=ttl"

awslocal dynamodb create-table \
  --table-name users \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

awslocal sqs create-queue --queue-name pipebridge-webhooks

awslocal sns create-topic --name pipebridge-notifications

echo "LocalStack initialized: DynamoDB (clients, webhook_events, users), SQS, SNS"
