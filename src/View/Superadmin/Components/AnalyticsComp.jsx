import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, Legend
} from "recharts";
import useAnalyticsStore from "@/stores/superadmin/analyticsStore";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const AnalyticsComp = () => {
  const { 
    records, chartData, pagination, 
    fetchAllStatements, fetchChartAnalytics, isLoading 
  } = useAnalyticsStore();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchAllStatements(pagination.currentPage);
    fetchChartAnalytics();
  }, []);

  /* ---------------- Frontend Filter Logic ---------------- */
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch = 
        r.user.toLowerCase().includes(search.toLowerCase()) || 
        r.email.toLowerCase().includes(search.toLowerCase());
      
      const matchCategory = filterCategory === "all" 
        ? true 
        : r.type.toLowerCase() === filterCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [search, filterCategory, records]);

  const handleRefresh = () => {
    fetchAllStatements(1);
    fetchChartAnalytics();
    setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Analytics</h1>
          <p className="text-zinc-400 mt-1">Cross-platform transaction monitoring and volume analysis</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-zinc-400"
          title="Refresh Data"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>

      {/* ================= Chart Section ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Transaction Volume by Category</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                cursor={{ fill: '#27272a' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Search & Filters ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full md:w-48 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none cursor-pointer focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Types</option>
          <option value="ticket">Tickets Only</option>
          <option value="transfer">Transfers Only</option>
        </select>
      </div>

      {/* ================= Table Section ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-[11px] uppercase tracking-widest border-b border-zinc-800 bg-zinc-800/20">
                <th className="px-6 py-4 font-bold">User Information</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredRecords.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-semibold">{item.user}</p>
                    <p className="text-xs text-zinc-500">{item.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-300 font-medium px-2 py-1 bg-zinc-800 rounded-md">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-sm">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      item.status === 'completed' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-zinc-500 italic">No transaction records found.</p>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 bg-zinc-800/10 border-t border-zinc-800 flex justify-between items-center">
          <p className="text-xs text-zinc-500">Page {pagination.currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
             <button 
                disabled={pagination.currentPage === 1 || isLoading}
                onClick={() => fetchAllStatements(pagination.currentPage - 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 disabled:opacity-20 text-xs font-bold"
              >
                Previous
              </button>
             <button 
                disabled={pagination.currentPage === pagination.totalPages || isLoading}
                onClick={() => fetchAllStatements(pagination.currentPage + 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 disabled:opacity-20 text-xs font-bold"
              >
                Next
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComp;