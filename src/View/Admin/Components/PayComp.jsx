import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import {ArrowLeftIcon} from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom";
const PayComp = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate()
  const handleConfirmPayment = () => {
    alert(`Payment Successful!\nUPI: ${upiId}\nAmount: ₹${amount}`);
    setShowConfirm(false);
    setUpiId("");
    setAmount("");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
        <ArrowLeftIcon onClick={()=>navigate("/transfer")} className="w-5 h-5 cursor-pointer" />
        Pay Money
        </h1>
        <p className="text-gray-400">
          Scan QR or enter UPI ID to make payment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan QR Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-green-500 transition">
          {!showScanner ? (
            <>
              <div className="w-48 h-48 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center mb-4">
                <span className="text-gray-500 text-sm text-center px-4">
                  Scan UPI QR Code
                </span>
              </div>

              <button
                onClick={() => setShowScanner(true)}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
              >
                Open Camera
              </button>
            </>
          ) : (
            <>
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (result) {
                    setUpiId(result?.text || "");
                    setShowScanner(false);
                  }
                }}
                className="w-full rounded-xl overflow-hidden"
              />
              <button
                onClick={() => setShowScanner(false)}
                className="mt-3 text-sm text-red-400 hover:underline"
              >
                Close Scanner
              </button>
            </>
          )}
        </div>

        {/* Pay via UPI ID */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Pay via UPI ID
          </h2>

          {/* UPI Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Amount
            </label>
            <input
              type="number"
              placeholder="₹ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Pay Button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!upiId || !amount}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              upiId && amount
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 cursor-not-allowed text-gray-400"
            }`}
          >
            Pay ₹{amount || "0"}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Payments are secure and encrypted
          </p>
        </div>
      </div>

      {/* ================= Confirm Payment Modal ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">UPI ID:</span> {upiId}
              </p>
              <p>
                <span className="text-gray-400">Amount:</span> ₹{amount}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-semibold"
              >
                Confirm Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayComp;
