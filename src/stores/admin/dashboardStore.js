import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useDashboardStore = create((set) => ({
  summary: null,
  cashFlow: [],
  spending: { totalVolume: 0, chartData: [] },
  bookingTrends: [],
  isLoading: false,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const [summaryRes, cashFlowRes, spendingRes, trendsRes] = await Promise.all([
        axiosInstance.get('/api/admin/dashboard/dashboard-summary'),
        axiosInstance.get('/api/admin/dashboard/cash-flow-analysis'),
        axiosInstance.get('/api/admin/dashboard/spending-composition'),
        axiosInstance.get('/api/admin/dashboard/ticket-booking-trends'),
      ]);

      set({
        summary: summaryRes.data.data,
        cashFlow: cashFlowRes.data.data,
        spending: spendingRes.data.data,
        bookingTrends: trendsRes.data.data,
        isLoading: false
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      set({ isLoading: false });
    }
  }
}));

export default useDashboardStore;