import React, { useState, useEffect } from "react";
import useBankStore from "@/stores/superadmin/bankAccountStore";
import toast from "react-hot-toast";

const AllBanksComp = () => {
  const { banks, fetchBanks, addBank, updateBank, deleteBank, isLoading } = useBankStore();

  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [form, setForm] = useState({
    bankname: "",
    ifsccode: "",
    branchcode: "",
  });

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  /* ------------------ Handlers ------------------ */
  const openAddModal = () => {
    setEditingBank(null);
    setForm({ bankname: "", ifsccode: "", branchcode: "" });
    setShowModal(true);
  };

  const openEditModal = (bank) => {
    setEditingBank(bank);
    setForm({
      bankname: bank.bankname,
      ifsccode: bank.ifsccode,
      branchcode: bank.branchcode,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.bankname || !form.ifsccode || !form.branchcode) {
      toast.error("Please fill all fields");
      return;
    }

    if (editingBank) {
      toast.promise(updateBank(editingBank._id, form), {
        loading: 'Updating bank...',
        success: 'Bank updated successfully!',
        error: (err) => err.error || 'Update failed',
      });
    } else {
      toast.promise(addBank(form), {
        loading: 'Adding bank...',
        success: 'Bank added successfully!',
        error: (err) => err.error || 'Failed to add bank',
      });
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      toast.promise(deleteBank(id), {
        loading: 'Deleting...',
        success: 'Bank deleted',
        error: 'Delete failed',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Banks</h1>
          <p className="text-gray-400">Superadmin: Control system-wide bank accounts</p>
        </div>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-medium">
          + Add Bank
        </button>
      </div>

      {isLoading && banks.length === 0 ? (
        <p className="text-center text-gray-500">Loading banks...</p>
      ) : banks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banks.map((bank) => (
            <div key={bank._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center hover:border-gray-700 transition">
              <div>
                <h3 className="text-lg font-semibold">{bank.bankname}</h3>
                <p className="text-sm text-gray-400">IFSC: {bank.ifsccode}</p>
                <p className="text-sm text-gray-400">Branch: {bank.branchcode}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(bank)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400">Edit</button>
                <button onClick={() => handleDelete(bank._id)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">No banks found.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingBank ? "Edit Bank" : "Add Bank"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Bank Name</label>
                <input type="text" value={form.bankname} onChange={(e) => setForm({ ...form, bankname: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">IFSC Code</label>
                <input type="text" value={form.ifsccode} onChange={(e) => setForm({ ...form, ifsccode: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Branch Code</label>
                <input type="text" value={form.branchcode} onChange={(e) => setForm({ ...form, branchcode: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-300">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold">
                {editingBank ? "Update Bank" : "Confirm Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBanksComp;