const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    password: "/auth/password",
  },
  clients: {
    list: "/clientes",
    create: "/clientes",
  },
  webhooks: {
    cardUpdated: "/webhooks/pipefy/card-updated",
  },
  pipefy: {
    cards: "/pipefy/cards",
    card: (id: string) => `/pipefy/cards/${id}`,
  },
} as const;

export default ENDPOINTS;
