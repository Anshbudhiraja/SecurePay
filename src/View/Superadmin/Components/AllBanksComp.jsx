import React, { useState } from "react";

const AllBanksComp = () => {
  const [banks, setBanks] = useState([
    {
      id: 1,
      name: "State Bank of India",
      ifsc: "SBIN0000123",
      branchCode: "00123",
    },
    {
      id: 2,
      name: "HDFC Bank",
      ifsc: "HDFC0000456",
      branchCode: "00456",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [form, setForm] = useState({
    name: "",
    ifsc: "",
    branchCode: "",
  });

  /* ------------------ Handlers ------------------ */
  const openAddModal = () => {
    setEditingBank(null);
    setForm({ name: "", ifsc: "", branchCode: "" });
    setShowModal(true);
  };

  const openEditModal = (bank) => {
    setEditingBank(bank);
    setForm({
      name: bank.name,
      ifsc: bank.ifsc,
      branchCode: bank.branchCode,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.ifsc || !form.branchCode) return;

    if (editingBank) {
      setBanks((prev) =>
        prev.map((b) =>
          b.id === editingBank.id ? { ...b, ...form } : b
        )
      );
    } else {
      setBanks((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this bank?")) {
      setBanks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Banks</h1>
          <p className="text-gray-400">
            Manage your linked bank accounts
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-medium"
        >
          + Add Bank
        </button>
      </div>

      {/* Bank List */}
      {banks.length > 0 ? (
        <div className="space-y-4">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center hover:border-gray-700 transition"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {bank.name}
                </h3>
                <p className="text-sm text-gray-400">
                  IFSC: {bank.ifsc}
                </p>
                <p className="text-sm text-gray-400">
                  Branch Code: {bank.branchCode}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(bank)}
                  className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bank.id)}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No banks added yet
        </p>
      )}

      {/* ================= Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBank ? "Edit Bank" : "Add Bank"}
            </h2>

            {/* Bank Name */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">
                Bank Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* IFSC */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">
                IFSC Code
              </label>
              <input
                type="text"
                value={form.ifsc}
                onChange={(e) =>
                  setForm({ ...form, ifsc: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Branch Code */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-1 block">
                Branch Code
              </label>
              <input
                type="text"
                value={form.branchCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    branchCode: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500"
              >
                {editingBank ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBanksComp;
