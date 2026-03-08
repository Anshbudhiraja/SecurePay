import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useAnalyticsStore = create((set) => ({
  users: [],
  trends: [],
  pagination: {
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
  },

  records: [],
  chartData: [],
  stmtPagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },

  isLoading: false,

  fetchUsers: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/api/superadmin/analytics/all-users?page=${page}`);
      set({ 
        users: response.data.data.users, 
        pagination: response.data.data.pagination,
        isLoading: false 
      });
    } catch (err) {
      set({ users: [], isLoading: false });
    }
  },

  fetchTrends: async () => {
    try {
      const response = await axiosInstance.get('/api/superadmin/analytics/users-joining-trends');
      set({ trends: response.data.data });
    } catch (err) {
      console.error("Trend fetch failed", err);
    }
  },

  
  fetchChartAnalytics: async () => {
    try {
      const response = await axiosInstance.get('/api/superadmin/analytics/transaction-amount-barchart');
      set({ chartData: response.data.data });
    } catch (err) {
      console.error("Chart analytics fetch failed", err);
    }
  },

  fetchAllStatements: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/api/superadmin/analytics/all-statements-records?page=${page}`);
      set({ 
        records: response.data.data.records, 
        stmtPagination: response.data.data.pagination,
        isLoading: false 
      });
    } catch (err) {
      set({ records: [], isLoading: false });
    }
  }
}));

export default useAnalyticsStore;