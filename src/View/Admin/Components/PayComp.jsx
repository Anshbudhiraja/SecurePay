import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useTransferStore from "@/stores/admin/transferStore";
import toast from "react-hot-toast";

const PayComp = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate();
  const { payMoney, isLoading } = useTransferStore();

  const handleConfirmPayment = async () => {
    toast.promise(payMoney(upiId, amount), {
      loading: 'Processing transaction...',
      success: (res) => {
        if (res.success) {
          setShowConfirm(false);
          setUpiId("");
          setAmount("");
          return `Paid ₹${amount} to ${res.data.receiverName}`;
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-1 sm:px-2">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
        <ArrowLeftIcon onClick={()=>navigate("/transfer")} className="w-5 h-5 cursor-pointer" />
        Pay Money
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Scan QR or enter UPI ID to make payment
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Scanner Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center hover:border-green-500/50 transition">
          {!showScanner ? (
            <>
              <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center mb-4 bg-zinc-800/20">
                <span className="text-zinc-500 text-sm text-center px-4">Scan UPI QR Code</span>
              </div>
              <button onClick={() => setShowScanner(true)} className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white">
                Open Camera
              </button>
            </>
          ) : (
            <div className="w-full relative">
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result) => {
                  if (result) {
                    // Handle UPI URI parsing (e.g., upi://pay?pa=id@upi&...)
                    const text = result?.text;
                    const urlParams = new URLSearchParams(text.split('?')[1]);
                    const pa = urlParams.get('pa') || text;
                    const am = urlParams.get('am');
                    
                    setUpiId(pa);
                    if (am) setAmount(am);
                    setShowScanner(false);
                    toast.success("QR Scanned!");
                  }
                }}
                className="w-full rounded-xl overflow-hidden"
              />
              <button onClick={() => setShowScanner(false)} className="mt-3 w-full text-center text-sm text-red-400">Cancel</button>
            </div>
          )}
        </div>

        {/* Input Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Manual Transfer</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase">Receiver UPI ID</label>
              <input type="text" placeholder="username@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase">Amount (INR)</label>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 text-xl sm:text-2xl font-bold text-white outline-none focus:border-green-500" />
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)} disabled={!upiId || !amount || isLoading}
            className="w-full mt-5 sm:mt-6 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
            Pay ₹{amount || "0"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-white">Authorize Payment</h2>
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 mb-6">
              <p className="text-sm text-zinc-400">Sending to:</p>
              <p className="text-lg font-mono text-green-400 break-all">{upiId}</p>
              <div className="mt-4 border-t border-zinc-700 pt-4">
                <p className="text-sm text-zinc-400">Total Amount:</p>
                <p className="text-3xl font-bold text-white">₹{amount}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300">Cancel</button>
              <button onClick={handleConfirmPayment} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-bold">
                {isLoading ? "Processing..." : "Confirm Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayComp;