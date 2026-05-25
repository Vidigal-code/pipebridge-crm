import apiClient from "@/shared/api/client";
import ENDPOINTS from "@/shared/api/endpoints";
import type { Client, CreateClientPayload } from "@/shared/types";

export async function fetchClients(): Promise<Client[]> {
  const response = await apiClient.get<Client[]>(ENDPOINTS.clients.list);
  return response.data;
}

export async function createClient(payload: CreateClientPayload): Promise<Client> {
  const response = await apiClient.post<Client>(ENDPOINTS.clients.create, payload);
  return response.data;
}
