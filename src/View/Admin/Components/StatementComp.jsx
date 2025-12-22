import React, { useEffect, useState } from "react";

// Mock statements data
const MOCK_STATEMENTS = [
  {
    id: 1,
    type: "received",
    title: "Salary Credit",
    amount: 50000,
    date: "2024-11-02",
    description: "Monthly salary credited",
  },
  {
    id: 2,
    type: "payment",
    title: "Flight Ticket",
    amount: -5200,
    date: "2024-11-05",
    description: "Air India ticket booking",
  },
  {
    id: 3,
    type: "paid",
    title: "Electricity Bill",
    amount: -1800,
    date: "2024-11-08",
    description: "November electricity bill",
  },
];

const ITEMS_PER_PAGE = 4;

const StatementComp = () => {
  const [statements, setStatements] = useState(MOCK_STATEMENTS);
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: "payment",
    title: "",
    amount: "",
    date: "",
    description: "",
  });

  /* ---------------- FILTERING ---------------- */
  const filteredStatements = statements.filter((item) => {
    const matchType = filterType === "all" ? true : item.type === filterType;
    const itemDate = new Date(item.date);
    const matchStart = startDate ? itemDate >= new Date(startDate) : true;
    const matchEnd = endDate ? itemDate <= new Date(endDate) : true;
    return matchType && matchStart && matchEnd;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredStatements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredStatements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, startDate, endDate]);

  /* ---------------- EXPORT CSV ---------------- */
  const exportCSV = () => {
    const headers = ["Date,Title,Type,Amount,Description"];
    const rows = filteredStatements.map(
      (s) =>
        `${s.date},${s.title},${s.type},${s.amount},"${s.description}"`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "statements.csv";
    a.click();
  };

  /* ---------------- EXPORT PDF ---------------- */
  const exportPDF = () => {
    window.print();
  };

  /* ---------------- ADD PAYMENT ---------------- */
  const handleAddPayment = () => {
    if (!newPayment.title || !newPayment.amount || !newPayment.date) return;

    setStatements((prev) => [
      {
        id: Date.now(),
        ...newPayment,
        amount:
          newPayment.type === "received"
            ? Math.abs(Number(newPayment.amount))
            : -Math.abs(Number(newPayment.amount)),
      },
      ...prev,
    ]);

    setShowModal(false);
    setNewPayment({
      type: "payment",
      title: "",
      amount: "",
      date: "",
      description: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Account Statements</h1>
          <p className="text-gray-400">
            View all your transactions and payments
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium"
          >
            + Add Payment
          </button>
          <button
            onClick={exportCSV}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex gap-4 print:hidden">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="received">Received</option>
          <option value="paid">Paid</option>
          <option value="payment">Payments</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        />
      </div>

      {/* Statement List */}
      <div className="space-y-4">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>

            <div className="text-right">
              <p
                className={`font-bold ${
                  item.amount > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.amount > 0 ? "+" : "-"}₹{Math.abs(item.amount)}
              </p>
              <span className="text-xs text-gray-400 uppercase">
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Payment</h2>

            <select
              value={newPayment.type}
              onChange={(e) =>
                setNewPayment({ ...newPayment, type: e.target.value })
              }
              className="w-full mb-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="payment">Payment</option>
              <option value="paid">Paid</option>
              <option value="received">Received</option>
            </select>

            <input
              placeholder="Title"
              className="w-full mb-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              onChange={(e) =>
                setNewPayment({ ...newPayment, title: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Amount"
              className="w-full mb-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              onChange={(e) =>
                setNewPayment({ ...newPayment, amount: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full mb-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              onChange={(e) =>
                setNewPayment({ ...newPayment, date: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full mb-4 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-green-600 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatementComp;
