export { fetchClients, createClient, updateClient, deleteClient } from "./api/queries";
export { default as clientReducer, selectClient, openCreateModal, closeCreateModal } from "./model/slice";
export { default as ClientTable } from "./ui/client-table";
