import { create } from 'zustand';
import axiosInstance from '../utils/axios';

const useAuthStore = create((set,get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  role: null,
  isLoading: false,
  error: null,
  step: 'login', // 'login' or 'otp'
  tempEmail: null, 
  isProfileComplete: true,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post('/api/auth/login', { 
        email, 
        password 
      });

      const { message, data } = response.data;
      const status = response.status;
      console.log(message)

      // CASE 1: Direct Success (User is already verified)
      if (status === 200 && data?.token) {
      localStorage.setItem('token', data.token);
        set({ 
          token: data.token, 
          role: data.role, 
          step: 'login',
          isLoading: false 
        });
        return { success: true, type: 'DONE' };
      }

      // CASE 2: Needs Verification (New user 201 OR Unverified 200 without token)
      if (status === 201 || (status === 200 && !data?.token)) {
        set({ 
          step: 'otp', 
          tempEmail: email, 
          isLoading: false 
        });
        return { success: true, type: 'OTP_SENT' };
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  verifyOtp: async (otp) => {
    const email = get().tempEmail;
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post('/api/auth/verify', { 
        email, 
        otp 
      });

      const { data } = response.data;

      set({ 
        token: data.token, 
        role: data.role, 
        step: 'login',
        tempEmail: null,
        isLoading: false 
      });

      localStorage.setItem('token', data.token);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid OTP";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/api/auth/checkUserDetails');
      console.log(response.data.message);
      set({ 
        user: response.data.data, 
        isProfileComplete: true, 
        isLoading: false 
      });
    } catch (err) {
      if (err.response?.status === 404) {
      set({ isProfileComplete: false, isLoading: false });
    } else {
      set({ isLoading: false });
    }
    }
  },
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put('/api/auth/updateUserDetails', profileData);
      
      set({ 
        isProfileComplete: true, 
        user: { ...profileData },
        isLoading: false 
      });
      
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  clearError: () => set({ error: null }),
  setStep: (step) => set({ step }),
  setProfileComplete: (userData) => set({ user: userData, isProfileComplete: true }),
  logout: () => set({ user: null, token: null, role: null, step: 'login' }),
  resetAuth: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      role: null, 
      step: 'login', 
      isProfileComplete: true 
    });
  }
}));

export default useAuthStore;