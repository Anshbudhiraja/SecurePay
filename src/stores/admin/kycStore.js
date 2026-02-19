import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useKycStore = create((set) => ({
  kycData: null,
  isLoading: false,
  error: null,

  fetchKycStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/admin/kyc');
      set({ kycData: response.data.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  submitKyc: async (videoFile, pdfFile) => {
    set({ isLoading: true, error: null });
    
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('pdf', pdfFile);

    try {
      const response = await axiosInstance.post('/api/admin/kyc/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      set({ kycData: response.data.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },
}));

export default useKycStore;