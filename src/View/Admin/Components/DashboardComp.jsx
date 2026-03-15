import React, { useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import useDashboardStore from "@/stores/admin/dashboardStore";
import { 
  ShieldCheckIcon, 
  TicketIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";

const DashboardComp = () => {
  const { summary, cashFlow, spending, bookingTrends, fetchDashboardData, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading && !summary) {
    return <div className="text-zinc-500 animate-pulse text-center py-20">Loading Analytics...</div>;
  }

  return (
    <div className="text-white px-3 sm:px-4 md:px-6 py-4">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Insights</h1>
        <p className="text-zinc-400 text-sm md:text-base">Real-time overview of financial flow and booking metrics</p>
      </div>

      {/* Stats Cards mapped from getDashboardSummary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {summary && (
          <>
            <StatCard title="Travel Portfolio" value={summary.travelPortfolio.activeTickets} label={summary.travelPortfolio.label} icon={<TicketIcon className="w-5 h-5 text-blue-500" />} />
            <StatCard title="Performance" value={summary.performance.successRate} label={summary.performance.label} icon={<ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />} />
            <StatCard title="Security" value={summary.security.flaggedCount} label={summary.security.label} icon={<ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />} />
            <StatCard title="Integrity" value={`${summary.integrity.score}/100`} label={summary.integrity.status} icon={<ShieldCheckIcon className="w-5 h-5 text-purple-500" />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        
        {/* Cash Flow Line Chart (Inflow vs Outflow) */}
        <div className="bg-zinc-900 rounded-2xl p-4 md:p-6 border border-zinc-800 shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold mb-6">30-Day Cash Flow</h3>
          <div className="h-[240px] md:h-[300px]">
            <ResponsiveContainer width="100%" height={"100%"} debounce={50}>
            <LineChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickFormatter={(str) => str.split('-')[2]} />
              <YAxis stroke="#71717a" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
              <Legend />
              <Line type="monotone" dataKey="inflow" name="Total Inflow" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="outflow" name="Total Outflow" stroke="#ef4444" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Trends Bar Chart (Train vs Flight Volume) */}
        <div className="bg-zinc-900 rounded-2xl p-4 md:p-6 border border-zinc-800 shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold mb-6">Ticket Booking Trends (Last 7 Days)</h3>
          <div className="h-[240px] md:h-[300px]">
          <ResponsiveContainer width="100%" height={"100%"} debounce={50}>
            <BarChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickFormatter={(str) => str.split('-')[2]} />
              <YAxis stroke="#71717a" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
              <Legend />
              <Bar dataKey="train" name="Train Sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flight" name="Flight Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Composition Pie Chart */}
        <div className="bg-zinc-900 rounded-2xl p-4 md:p-6 border border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2 sm:gap-4">
            <h3 className="text-lg font-semibold">Spending Composition</h3>
            <div className="sm:text-right">
                <p className="text-xs text-zinc-500">Total Transaction Volume</p>
                <p className="text-xl font-bold text-green-400">₹{spending.totalVolume?.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-[240px] md:h-[300px]">
          <ResponsiveContainer width="100%" height={"100%"} debounce={50}>
            <PieChart>
              <Pie
                data={spending.chartData}
                cx="50%" cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={8}
                dataKey="value"
              >
                {spending.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Small Components
const StatCard = ({ title, value, label, icon }) => (
  <div className="bg-zinc-900 rounded-2xl p-4 md:p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
    <div className="flex justify-between items-start mb-3 md:mb-4">
      <p className="text-zinc-500 text-xs md:text-sm font-medium">{title}</p>
      <div className="p-2 bg-zinc-800 rounded-lg">{icon}</div>
    </div>

    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</h2>

    <p className="text-xs text-zinc-400">{label}</p>
  </div>
);

export default React.memo(DashboardComp);;