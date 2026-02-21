import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useTicketStore = create((set) => ({
  tickets: [],
  isLoading: false,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/superadmin/tickets');
      set({ tickets: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addTicket: async (ticketData) => {
    try {
      const response = await axiosInstance.post('/api/superadmin/tickets/create', ticketData);
      set((state) => ({ tickets: [response.data.data, ...state.tickets] }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Failed to add ticket" };
    }
  },

  updateTicket: async (id, ticketData) => {
    try {
      const response = await axiosInstance.put(`/api/superadmin/tickets/update/${id}`, ticketData);
      set((state) => ({
        tickets: state.tickets.map((t) => (t._id === id ? response.data.data : t)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Update failed" };
    }
  },

  deleteTicket: async (id) => {
    try {
      await axiosInstance.delete(`/api/superadmin/tickets/delete/${id}`);
      set((state) => ({
        tickets: state.tickets.filter((t) => t._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Delete failed" };
    }
  },
}));

export default useTicketStore;