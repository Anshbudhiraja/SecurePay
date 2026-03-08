import React, { useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/outline";
import useAnalyticsStore from "@/stores/superadmin/analyticsStore";

const SuperadminComp = () => {
  const { users, trends, pagination, fetchUsers, fetchTrends, isLoading } = useAnalyticsStore();

  useEffect(() => {
    fetchUsers(pagination.currentPage);
    fetchTrends();
  }, []);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Superadmin Control</h1>
          <p className="text-zinc-400 mt-1">Global platform oversight and user growth metrics</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Total Platform Users</p>
            <p className="text-xl font-mono text-green-500 font-bold">{pagination.totalUsers}</p>
        </div>
      </div>

      {/* ================= Registration Trends Chart ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-sm">
        <div className="mb-8">
            <h2 className="text-xl font-bold text-white">User Acquisition Trend</h2>
            <p className="text-sm text-zinc-500">Daily registration volume for the last 10 days</p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#71717a" 
                fontSize={12} 
                tickFormatter={(str) => str.split('-')[2]} // Show only day
              />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#22c55e' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                name="New Users"
                stroke="#22c55e" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Users Management Table ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">User Registry</h2>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-[11px] uppercase tracking-widest border-b border-zinc-800 bg-zinc-800/20">
               <th className="px-6 py-4 font-bold">Profile</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6"><div className="h-10 bg-zinc-800 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-800/20 transition-all group">
                    {/* 1. Name & Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border border-zinc-700 overflow-hidden bg-zinc-800 flex-shrink-0">
                          {user.image ? (
                            <img src={user.image} alt="User" className="h-full w-full object-cover" />
                          ) : (
                            <UserCircleIcon className="h-full w-full text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                            {user.firstName || "N/A"} {user.lastName || ""}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">ID: {user._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Contact (Email & Phone) */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-300 text-xs">
                          <EnvelopeIcon className="w-3.5 h-3.5 text-zinc-500" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <PhoneIcon className="w-3.5 h-3.5 text-zinc-500" />
                          {user.phone || "No phone linked"}
                        </div>
                      </div>
                    </td>

                    {/* 3. Location (City, State, Address) */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <MapPinIcon className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-300 text-xs truncate">
                            {user.city ? `${user.city}, ${user.state}` : "Location not set"}
                          </p>
                          <p className="text-[10px] text-zinc-500 line-clamp-1 italic">
                            {user.address || "No address provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 4. Verification Statuses */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-center">
                        {/* Account Verification */}
                        <span className={`w-24 text-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                          user.verified 
                            ? 'bg-blue-900/20 text-blue-400 border-blue-800' 
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}>
                          {user.verified ? 'EMAIL VERIFIED' : 'PENDING EMAIL'}
                        </span>
                        
                        {/* KYC Verification */}
                        <span className={`w-24 text-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                          user.kyc_verified 
                            ? 'bg-green-900/20 text-green-400 border-green-800' 
                            : 'bg-yellow-900/20 text-yellow-500 border-yellow-800'
                        }`}>
                          {user.kyc_verified ? 'KYC APPROVED' : 'KYC PENDING'}
                        </span>

                        {/* Service Status */}
                        {!user.service && (
                          <span className="w-24 text-center px-2 py-0.5 rounded text-[9px] font-bold bg-red-900/20 text-red-500 border border-red-800">
                            SUSPENDED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Join Date */}
                    <td className="px-6 py-4 text-right">
                      <p className="text-zinc-300 text-xs font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-zinc-500 text-[10px]">
                        {new Date(user.createdAt).getFullYear()}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Controls */}
        <div className="p-6 bg-zinc-800/10 flex justify-between items-center">
          <p className="text-xs text-zinc-500">Showing {users.length} of {pagination.totalUsers} users</p>
          
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrevPage || isLoading}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-bold hover:bg-zinc-700 disabled:opacity-20 transition-all border border-zinc-700"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNextPage || isLoading}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-bold hover:bg-zinc-700 disabled:opacity-20 transition-all border border-zinc-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminComp;