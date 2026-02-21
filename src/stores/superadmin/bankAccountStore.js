import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useBankStore = create((set) => ({
  banks: [],
  isLoading: false,

  fetchBanks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/superadmin/bank-accounts');
      set({ banks: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addBank: async (bankData) => {
    try {
      const response = await axiosInstance.post('/api/superadmin/bank-accounts/create', bankData);
      set((state) => ({ banks: [response.data.data, ...state.banks] }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Failed to add bank" };
    }
  },

  updateBank: async (id, bankData) => {
    try {
      const response = await axiosInstance.put(`/api/superadmin/bank-accounts/update/${id}`, bankData);
      set((state) => ({
        banks: state.banks.map((b) => (b._id === id ? response.data.data : b)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Update failed" };
    }
  },

  deleteBank: async (id) => {
    try {
      await axiosInstance.delete(`/api/superadmin/bank-accounts/delete/${id}`);
      set((state) => ({
        banks: state.banks.filter((b) => b._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Delete failed" };
    }
  },
}));

export default useBankStore;