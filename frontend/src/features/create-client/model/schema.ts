import { z } from "zod";

export const createClientSchema = z.object({
  cliente_nome: z.string().min(1, "Nome é obrigatório"),
  cliente_email: z.string().email("Email inválido"),
  tipo_solicitacao: z.string().min(1, "Tipo de solicitação é obrigatório"),
  valor_patrimonio: z.number().positive("Patrimônio deve ser positivo"),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
