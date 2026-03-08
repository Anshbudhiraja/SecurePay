import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useTicketStore = create((set) => ({
  tickets: [],
  myBookings: [],
  isLoading: false,

  searchTickets: async (filters) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`/api/admin/ticket-bookings/searchTickets?${queryParams}`);
      set({ tickets: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ tickets: [], isLoading: false });
    }
  },

  bookTicket: async (bookingData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/api/admin/ticket-bookings/bookTicket', bookingData);
      set({ isLoading: false });
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err.response?.data?.message || "Booking failed" };
    }
  },

  clearTickets: () => set({ tickets: [] }),

  fetchMyBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/admin/ticket-bookings/getMyBookings');
      set({ myBookings: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ myBookings: [], isLoading: false });
    }
  },
}));

export default useTicketStore;