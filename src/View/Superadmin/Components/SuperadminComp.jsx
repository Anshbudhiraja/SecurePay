import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const USERS_PER_PAGE = 6;

const SuperadminComp = () => {
  /* ---------------- Mock Users ---------------- */
  const [users] = useState(
    Array.from({ length: 28 }).map((_, i) => ({
      id: i + 1,
      username: `user_${i + 1}`,
      email: `user${i + 1}@mail.com`,
      joinedAt: new Date(
        Date.now() - i * 86400000
      ).toISOString(),
    }))
  );

  const [page, setPage] = useState(1);

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * USERS_PER_PAGE;
    return users.slice(start, start + USERS_PER_PAGE);
  }, [page, users]);

  /* ---------------- Chart Data (Latest 10) ---------------- */
  const latestUsers = users
    .slice(0, 10)
    .reverse()
    .map((u, i) => ({
      name: `Day ${i + 1}`,
      users: i + 1,
    }));

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Superadmin Dashboard</h1>
        <p className="text-gray-400">
          Platform overview & user analytics
        </p>
      </div>

      {/* ================= Chart ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Latest 10 Users Joined
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latestUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Users Table ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          All Users
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">Username</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="py-3">{user.username}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3 text-gray-400">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
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
