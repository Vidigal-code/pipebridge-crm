const ENDPOINTS = {
  clients: {
    list: "/clientes",
    create: "/clientes",
  },
  webhooks: {
    cardUpdated: "/webhooks/pipefy/card-updated",
  },
} as const;

export default ENDPOINTS;
