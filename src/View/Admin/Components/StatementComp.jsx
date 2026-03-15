import React, { useEffect, useState } from "react";
import useStatementStore from "@/stores/admin/statementStore";
import { 
  ArrowPathIcon, 
  DocumentArrowDownIcon, 
  TableCellsIcon,
  FunnelIcon 
} from "@heroicons/react/24/outline";

const StatementComp = () => {
  const { statements, pagination, fetchStatements, exportCSV, exportPDF, isLoading } = useStatementStore();
  
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Initial Fetch on load and when page changes
  useEffect(() => {
    fetchStatements({ status, startDate, endDate, page: currentPage });
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchStatements({ status, startDate, endDate, page: 1 });
  };

  const handleReset = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchStatements({ page: 1 });
  };

  const handleDownloadCSV = () => exportCSV({ status, startDate, endDate });
  const handleDownloadPDF = () => exportPDF({ status, startDate, endDate });

  return (
    <div className="max-w-6xl mx-auto p-4 print:p-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Statements</h1>
          <p className="text-zinc-400 mt-1">Transaction history and financial reporting</p>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <button onClick={handleDownloadCSV} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm transition border border-zinc-700 w-full sm:w-auto">
            <TableCellsIcon className="w-4 h-4 text-green-500" /> 
            <span>Export Excel</span>
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm transition border border-zinc-700 w-full sm:w-auto">
            <DocumentArrowDownIcon className="w-4 h-4 text-red-500" /> 
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:hidden items-end">
        <div className="md:col-span-1">
          <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-green-500" />
        </div>

        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 block">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-green-500" />
        </div>

        <button onClick={handleSearch} className="bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2">
          <FunnelIcon className="w-4 h-4" /> Apply
        </button>

        <button onClick={handleReset} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 py-2 rounded-lg flex items-center justify-center gap-2 transition border border-zinc-700">
          <ArrowPathIcon className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 bg-zinc-800 rounded-full mb-4"></div>
            <p className="text-zinc-500 text-sm">Fetching your financial history...</p>
          </div>
        ) : statements.length > 0 ? (
          statements.map((item) => (
            <div key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-zinc-600 transition shadow-sm group">
              <div className="flex gap-4 items-center">
                <div className={`w-1.5 h-12 rounded-full transition-colors ${item.amount > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}></div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">
                    {item.bookingId?.name || "UPI Transaction"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">ID: {item.transactionId || item._id}</p>
                  <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter">
                    {new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className={`text-xl font-bold ${item.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {item.amount > 0 ? "+" : "-"} ₹{Math.abs(item.amount).toLocaleString('en-IN')}
                </p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest ${
                  item.status === 'completed' ? 'bg-green-900/30 text-green-500' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 italic text-sm">No transaction records match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 print:hidden">
          <button 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            disabled={currentPage === 1}
            className="text-sm font-semibold text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
          >
            ← Previous
          </button>
          
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                  currentPage === i + 1 
                  ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/20' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPages))} 
            disabled={currentPage === pagination.totalPages}
            className="text-sm font-semibold text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default StatementComp;