const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
  pipefy: {
    pipeId: process.env.NEXT_PUBLIC_PIPEFY_PIPE_ID || "",
    fieldNome: process.env.NEXT_PUBLIC_PIPEFY_FIELD_NOME || "cliente_nome",
    fieldEmail: process.env.NEXT_PUBLIC_PIPEFY_FIELD_EMAIL || "cliente_email",
    fieldPatrimonio: process.env.NEXT_PUBLIC_PIPEFY_FIELD_PATRIMONIO || "valor_patrimonio",
    fieldTipoSolicitacao: process.env.NEXT_PUBLIC_PIPEFY_FIELD_TIPO_SOLICITACAO || "tipo_solicitacao",
    fieldStatus: process.env.NEXT_PUBLIC_PIPEFY_FIELD_STATUS || "status",
    fieldPrioridade: process.env.NEXT_PUBLIC_PIPEFY_FIELD_PRIORIDADE || "prioridade",
  },
} as const;

export default env;
