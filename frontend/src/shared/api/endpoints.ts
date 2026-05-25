const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    password: "/auth/password",
  },
  clients: {
    list: "/clientes",
    create: "/clientes",
    byId: (id: string) => `/clientes/${id}`,
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
