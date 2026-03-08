import { create } from 'zustand';
import axiosInstance from '@/utils/axios';
import toast from 'react-hot-toast';

const useBankAccountStore = create((set, get) => ({
  accounts: [],
  providers: [],
  isLoading: false,

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/admin/bank-accounts');
      set({ accounts: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ isLoading: false, accounts: [] });
    }
  },

  searchProviders: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(`/api/admin/bank-accounts/providers?searchTerm=${searchTerm}`);
      set({ providers: response.data.data || [] });
    } catch (err) {
      set({ providers: [] });
    }
  },

  addAccount: async (formData) => {
    try {
      const response = await axiosInstance.post('/api/admin/bank-accounts/add', formData);
      set((state) => ({ accounts: [response.data.data, ...state.accounts] }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to link bank";
      return { success: false, error: msg };
    }
  },

  updateAccount: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/api/admin/bank-accounts/update/${id}`, formData);
      set((state) => ({
        accounts: state.accounts.map((acc) => (acc._id === id ? response.data.data : acc)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Update failed" };
    }
  },

  deleteAccount: async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/bank-accounts/delete/${id}`);
      set((state) => ({
        accounts: state.accounts.filter((acc) => acc._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Delete failed" };
    }
  },
}));

export default useBankAccountStore;