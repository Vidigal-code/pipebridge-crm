import apiClient from "@/shared/api/client";
import ENDPOINTS from "@/shared/api/endpoints";
import type { PipefyCard } from "@/shared/types";

export async function fetchPipefyCards(): Promise<PipefyCard[]> {
  const { data } = await apiClient.get<PipefyCard[]>(ENDPOINTS.pipefy.cards);
  return data;
}

export async function updatePipefyCard(
  cardId: string,
  fields: { fieldId: string; value: string }[]
): Promise<void> {
  await apiClient.put(ENDPOINTS.pipefy.card(cardId), { fields });
}

export async function deletePipefyCard(cardId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.pipefy.card(cardId));
}
