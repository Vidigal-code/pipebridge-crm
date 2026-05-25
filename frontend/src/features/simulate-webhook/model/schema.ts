import { z } from "zod";

export const webhookSchema = z.object({
  event_id: z.string().min(1, "Event ID é obrigatório"),
  card_id: z.string().min(1, "Card ID é obrigatório"),
  cliente_email: z.string().email("Email inválido"),
  timestamp: z.string().min(1, "Timestamp é obrigatório"),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
