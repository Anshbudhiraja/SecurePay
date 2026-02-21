import { create } from 'zustand';
import axiosInstance from '@/utils/axios';
import toast from 'react-hot-toast';

const useSuperAdminStore = create((set) => ({
  requests: [],
  isLoading: false,

  fetchAllRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/superadmin/kyc');
      set({ requests: response.data.data || [], isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  acceptKyc: async (kycId) => {
    try {
      await axiosInstance.put(`/api/superadmin/kyc/accept?kycId=${kycId}`);
      set((state) => ({
        requests: state.requests.map((r) =>{ if(r._id === kycId){
            r.status === true
        }}),
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to accept KYC";
      return { success: false, error: msg };
    }
  },

  declineKyc: async (kycId) => {
    try {
      await axiosInstance.put(`/api/superadmin/kyc/decline?kycId=${kycId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== kycId),
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to decline KYC";
      return { success: false, error: msg };
    }
  },
}));

export default useSuperAdminStore;