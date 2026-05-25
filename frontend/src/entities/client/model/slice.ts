import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Client } from "@/shared/types";

interface ClientState {
  selectedClient: Client | null;
  isCreateModalOpen: boolean;
}

const initialState: ClientState = {
  selectedClient: null,
  isCreateModalOpen: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    selectClient(state, action: PayloadAction<Client | null>) {
      state.selectedClient = action.payload;
    },
    openCreateModal(state) {
      state.isCreateModalOpen = true;
    },
    closeCreateModal(state) {
      state.isCreateModalOpen = false;
    },
  },
});

export const { selectClient, openCreateModal, closeCreateModal } = clientSlice.actions;
export default clientSlice.reducer;
