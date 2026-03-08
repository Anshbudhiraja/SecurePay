import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useTransferStore = create((set) => ({
  isLoading: false,
  requestedQr: null, 

  payMoney: async (receiverUpiId, amount) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/api/admin/statements/pay', {
        receiverUpiId,
        amount: Number(amount)
      });
      set({ isLoading: false });
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || "Transaction failed";
      return { success: false, error: msg };
    }
  },

  generateRequestQr: async (amount) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/api/admin/statements/receive', {
        amount: Number(amount)
      });
      set({ requestedQr: response.data.data, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || "QR Generation failed";
      return { success: false, error: msg };
    }
  },

  clearRequestedQr: () => set({ requestedQr: null })
}));

export default useTransferStore;