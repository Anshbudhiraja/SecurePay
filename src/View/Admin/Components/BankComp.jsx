import React, { useState, useEffect } from "react";
import {
  BuildingLibraryIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
  CheckCircleIcon, LockClosedIcon, StarIcon, ArrowPathIcon,
  EyeIcon, EyeSlashIcon,
} from "@heroicons/react/24/outline";
import useBankAccountStore from "@/stores/admin/bankAccountStore";
import useAuthStore from "@/stores/authStore";
import toast from "react-hot-toast";

const BankComp = () => {
  const { user,fetchUser } = useAuthStore();
  const { 
    accounts, providers, fetchAccounts, searchProviders, 
    addAccount, deleteAccount, isLoading 
  } = useBankAccountStore();

  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [hideAllBalances, setHideAllBalances] = useState(false);

  const [form, setForm] = useState({
    accountNo: "",
    ifscCode: "",
    holderName: "",
  });

  useEffect(() => {
    fetchUser()
    fetchAccounts();
  }, [fetchAccounts,fetchUser]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) searchProviders(search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleAddBank = async () => {
    if (!selectedProvider || !form.accountNo || !form.ifscCode) {
      toast.error("Please select a bank and fill all fields");
      return;
    }

    const payload = {
      bankId: selectedProvider._id,
      ...form
    };

    toast.promise(addAccount(payload), {
      loading: 'Linking account...',
      success: (res) => {
        if (res.success) {
          setSearch("");
          setSelectedProvider(null);
          setForm({ accountNo: "", ifscCode: "", holderName: "" });
          return "Bank linked successfully!";
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };
  if (isLoading) return <div className="bg-black h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto w-full px-1 sm:px-2 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Bank Accounts</h1>
          <p className="text-zinc-400 text-sm sm:text-base">Manage your linked accounts for settlements</p>
        </div>

        <button
          onClick={() => setHideAllBalances(!hideAllBalances)}
          className="flex items-center justify-center gap-2 text-xs sm:text-sm bg-zinc-800 px-3 sm:px-4 py-2 rounded-lg text-white w-full sm:w-auto"
        >
          {hideAllBalances ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          {hideAllBalances ? "Balances Hidden" : "Show Balances"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        {/* ================= Add Bank ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 relative">
          {!user?.kyc_verified && (
            <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="text-center p-6">
                <LockClosedIcon className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-500 font-medium">KYC Verification Required</p>
                <p className="text-zinc-500 text-xs mt-1">Complete your KYC to unlock banking features</p>
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            <PlusIcon className="w-5 h-5 text-green-500" /> Link New Account
          </h2>

          <div className="relative mb-4">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bank name or branch..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white"
            />
            {search && providers.length > 0 && !selectedProvider && (
              <div className="absolute left-0 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg z-20 shadow-2xl max-h-48 overflow-y-auto">
                {providers.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedProvider(p);
                      setForm({ ...form, ifscCode: p.ifsccode });
                      setSearch(p.bankname);
                    }}
                    className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-sm border-b border-zinc-700/50 last:border-0"
                  >
                    <p className="text-white font-medium">{p.bankname}</p>
                    <p className="text-[10px] text-zinc-500">IFSC: {p.ifsccode} • Branch: {p.branchcode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <input
              placeholder="Account Holder Name"
              value={form.holderName}
              onChange={(e) => setForm({ ...form, holderName: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white"
            />
            <input
              placeholder="Full Account Number"
              value={form.accountNo}
              onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white"
            />
            <input
              placeholder="IFSC Code"
              value={form.ifscCode}
              readOnly
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white"
            />
          </div>

          <button
            onClick={handleAddBank}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold text-white transition-colors"
          >
            Link Bank Account
          </button>
        </div>

        {/* ================= Linked Banks ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Linked Accounts</h2>

          {accounts.length === 0 ? (
            <div className="text-center py-10">
              <BuildingLibraryIcon className="w-12 h-12 text-zinc-800 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">No accounts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((acc) => (
                <div key={acc._id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-white">{acc.bankId?.bankname || "Unknown Bank"}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        A/C: ••••••{acc.accountNo.slice(-4)}
                      </p>
                      <div className="flex items-center gap-2 text-green-500 text-[10px] mt-2 uppercase tracking-widest font-bold">
                        <CheckCircleIcon className="w-4 h-4" /> Verified
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if(window.confirm("Unlink this account?")) deleteAccount(acc._id);
                      }}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankComp;