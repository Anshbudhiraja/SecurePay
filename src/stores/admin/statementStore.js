import { create } from 'zustand';
import axiosInstance from '@/utils/axios';

const useStatementStore = create((set, get) => ({
  statements: [],
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  },
  isLoading: false,

  fetchStatements: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { status, startDate, endDate, page = 1, limit = 10 } = params;
      const response = await axiosInstance.get('/api/admin/statements', {
        params: { status, startDate, endDate, page, limit }
      });
      
      set({ 
        statements: response.data.data.statements, 
        pagination: response.data.data.pagination,
        isLoading: false 
      });
    } catch (err) {
      set({ statements: [], isLoading: false });
    }
  },

  exportCSV: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/statements/export-csv-statements', {
        params,
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AccountStatement.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Excel Export failed", err);
    }
  },

  exportPDF: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/statements/export-pdf-statements', {
        params,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url);
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  }
}));

export default useStatementStore;