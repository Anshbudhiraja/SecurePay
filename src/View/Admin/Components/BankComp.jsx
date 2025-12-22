import React, { useState } from "react";
import {
  BuildingLibraryIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  LockClosedIcon,
  StarIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "IndusInd Bank",
  "IDFC First Bank",
  "Bank of Baroda",
];

const BankComp = () => {
  const kycVerified = true;

  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [hideAllBalances, setHideAllBalances] = useState(false);

  const [form, setForm] = useState({
    accountNumber: "",
    ifsc: "",
    holderName: "",
  });

  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  const filteredBanks = BANKS.filter((bank) =>
    bank.toLowerCase().includes(search.toLowerCase())
  );

  const addBank = () => {
    if (!selectedBank || !form.accountNumber || !form.ifsc) return;

    setAccounts([
      ...accounts.map((a) => ({ ...a, primary: false })),
      {
        id: Date.now(),
        bankName: selectedBank,
        ...form,
        verified: true,
        primary: accounts.length === 0,
        balance: Math.floor(Math.random() * 500000) + 10000,
        showBalance: false,
        lastUpdated: new Date(),
      },
    ]);

    setSelectedBank("");
    setForm({ accountNumber: "", ifsc: "", holderName: "" });
  };

  const removeBank = (id) =>
    setAccounts(accounts.filter((acc) => acc.id !== id));

  const makePrimary = (id) =>
    setAccounts(
      accounts.map((acc) => ({ ...acc, primary: acc.id === id }))
    );

  const refreshBalance = (id) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              balance: acc.balance + Math.floor(Math.random() * 5000),
              lastUpdated: new Date(),
            }
          : acc
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-gray-400">
            Add, manage & set your primary bank account
          </p>
        </div>

        {/* Privacy Toggle */}
        <button
          onClick={() => setHideAllBalances(!hideAllBalances)}
          className="flex items-center gap-2 text-sm bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          {hideAllBalances ? (
            <>
              <EyeSlashIcon className="w-4 h-4" />
              Balances Hidden
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4" />
              Show Balances
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ================= Add Bank ================= */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative">
          {!kycVerified && (
            <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-yellow-400">
                <LockClosedIcon className="w-5 h-5" />
                Complete KYC to add bank
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Bank Account
          </h2>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your bank"
                className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
            </div>
          </div>

          {search && (
            <div className="max-h-40 overflow-y-auto mb-4 bg-gray-800 rounded-lg border border-gray-700">
              {filteredBanks.map((bank) => (
                <div
                  key={bank}
                  onClick={() => {
                    setSelectedBank(bank);
                    setSearch("");
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-sm"
                >
                  {bank}
                </div>
              ))}
            </div>
          )}

          {selectedBank && (
            <div className="mb-4 text-green-400 text-sm flex items-center gap-2">
              <BuildingLibraryIcon className="w-4 h-4" />
              {selectedBank}
            </div>
          )}

          <div className="space-y-4">
            {["holderName", "accountNumber", "ifsc"].map((field) => (
              <input
                key={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            ))}
          </div>

          <button
            onClick={addBank}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg font-medium"
          >
            Add Bank
          </button>
        </div>

        {/* ================= Linked Banks ================= */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Linked Bank Accounts
          </h2>

          {accounts.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No bank accounts added yet
            </p>
          ) : (
            <div className="space-y-4">
              {accounts.map((acc) => (
                <div
  key={acc.id}
  className={`rounded-lg p-4 border ${
    acc.primary
      ? "bg-green-900/20 border-green-600"
      : "bg-gray-800 border-gray-700"
  }`}
>
  <div className="flex justify-between items-start">
    {/* LEFT SIDE */}
    <div>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{acc.bankName}</p>
        {acc.primary && (
          <span className="text-xs bg-green-600 px-2 py-0.5 rounded-full">
            Primary
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400">
        A/C •••• {acc.accountNumber.slice(-4)}
      </p>

      {/* Balance */}
      <div className="mt-3">
        <p className="text-xs text-gray-400">Available Balance</p>
        <p className="text-lg font-semibold">
          {hideAllBalances || !acc.showBalance
            ? "₹ ••••••"
            : formatAmount(acc.balance)}
        </p>
      </div>

      <div className="flex items-center gap-2 text-green-400 text-xs mt-2">
        <CheckCircleIcon className="w-4 h-4" />
        Verified
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex flex-col items-end gap-3">
      {!acc.primary && (
        <button
          onClick={() => makePrimary(acc.id)}
          className="text-xs text-yellow-400 flex items-center gap-1"
        >
          <StarIcon className="w-4 h-4" />
          Make Primary
        </button>
      )}

      <button
        onClick={() => removeBank(acc.id)}
        className="text-red-400"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      {/* Balance actions */}
      <div className="flex flex-col items-end gap-1 pt-2">
        <button
          onClick={() =>
            setAccounts(
              accounts.map((a) =>
                a.id === acc.id
                  ? { ...a, showBalance: !a.showBalance }
                  : a
              )
            )
          }
          className="text-xs text-blue-400"
        >
          {acc.showBalance ? "Hide" : "View"}
        </button>

        <button
          onClick={() => refreshBalance(acc.id)}
          className="flex items-center gap-1 text-xs text-green-400"
        >
          <ArrowPathIcon className="w-3 h-3" />
          Refresh
        </button>

        <p className="text-[11px] text-gray-500">
          Updated {acc.lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
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
