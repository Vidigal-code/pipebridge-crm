export interface Client {
  id: string;
  cliente_nome: string;
  cliente_email: string;
  tipo_solicitacao: string;
  valor_patrimonio: number;
  status: string;
  prioridade: string | null;
  card_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientPayload {
  cliente_nome: string;
  cliente_email: string;
  tipo_solicitacao: string;
  valor_patrimonio: number;
}

export interface WebhookPayload {
  event_id: string;
  card_id: string;
  cliente_email: string;
  timestamp: string;
}

export interface WebhookResponse {
  event_id: string;
  status: string;
  prioridade: string | null;
  message: string;
}

export interface PipefyCardField {
  field_id: string;
  name: string;
  value: string;
}

export interface PipefyCard {
  id: string;
  title: string;
  phase: string;
  created_at: string;
  fields: PipefyCardField[];
}
