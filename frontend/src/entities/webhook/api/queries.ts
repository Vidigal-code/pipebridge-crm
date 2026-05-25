import apiClient from "@/shared/api/client";
import ENDPOINTS from "@/shared/api/endpoints";
import type { WebhookPayload, WebhookResponse } from "@/shared/types";

export async function sendWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
  const response = await apiClient.post<WebhookResponse>(
    ENDPOINTS.webhooks.cardUpdated,
    payload
  );
  return response.data;
}
