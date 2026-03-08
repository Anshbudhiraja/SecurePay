import { create } from 'zustand';
import axiosInstance from '@/utils/axios';
import toast from 'react-hot-toast';

const useProfileStore = create((set, get) => ({
  isLoading: false,

  updateImage: async (file) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.put('/api/superadmin/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ isLoading: false });
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || "Image upload failed";
      return { success: false, error: msg };
    }
  },

  updateDetails: async (details) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put('/api/superadmin/profile/profileDetails', details);
      set({ isLoading: false });
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || "Update failed";
      return { success: false, error: msg, validationErrors: err.response?.data?.data };
    }
  },

  processUpi: async (upiId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put('/api/superadmin/profile/upiDetails', { upiId });
      set({ isLoading: false });
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || "UPI processing failed";
      return { success: false, error: msg };
    }
  },
}));

export default useProfileStore;