import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------------- MOCK DATA ---------------- */
const TRANSACTIONS = [
  {
    id: 1,
    user: "ansh",
    email: "ansh@mail.com",
    category: "ticket",
    ticketType: "flight",
    amount: 5200,
    date: "2024-11-01",
  },
  {
    id: 2,
    user: "rohit",
    email: "rohit@mail.com",
    category: "ticket",
    ticketType: "train",
    amount: 2400,
    date: "2024-11-03",
  },
  {
    id: 3,
    user: "ansh",
    email: "ansh@mail.com",
    category: "transfer",
    transferType: "paid",
    amount: 1500,
    date: "2024-11-05",
  },
  {
    id: 4,
    user: "kavya",
    email: "kavya@mail.com",
    category: "transfer",
    transferType: "received",
    amount: 3200,
    date: "2024-11-06",
  },
  {
    id: 5,
    user: "ansh",
    email: "ansh@mail.com",
    category: "ticket",
    ticketType: "flight",
    amount: 6800,
    date: "2024-11-10",
  },
];

/* ---------------- COMPONENT ---------------- */
const AnalyticsComp = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        filterCategory === "all"
          ? true
          : t.category === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [search, filterCategory]);

  /* ---------------- CHART DATA ---------------- */
  const chartData = useMemo(() => {
    const map = {};

    filteredData.forEach((item) => {
      const key =
        item.category === "ticket"
          ? item.ticketType
          : item.transferType;

      map[key] = (map[key] || 0) + item.amount;
    });

    return Object.keys(map).map((k) => ({
      name: k.toUpperCase(),
      amount: map[k],
    }));
  }, [filteredData]);

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400">
          Track ticket purchases & transfer activity
        </p>
      </div>

      {/* ================= Filters ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="ticket">Tickets</option>
          <option value="transfer">Transfers</option>
        </select>
      </div>

      {/* ================= Chart ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Transaction Amount Analytics
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Transaction Records
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">User</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-3">
                    <p className="font-medium">{item.user}</p>
                    <p className="text-xs text-gray-500">
                      {item.email}
                    </p>
                  </td>

                  <td className="py-3 capitalize">
                    {item.category === "ticket"
                      ? item.ticketType
                      : item.transferType}
                  </td>

                  <td className="py-3 capitalize">
                    {item.category}
                  </td>

                  <td
                    className={`py-3 font-semibold ${
                      item.category === "transfer" &&
                      item.transferType === "received"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ₹{item.amount}
                  </td>

                  <td className="py-3 text-gray-400">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No transactions found
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsComp;
