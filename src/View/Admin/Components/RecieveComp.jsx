import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useTransferStore from "@/stores/admin/transferStore";
import useAuthStore from "@/stores/authStore";
import toast from "react-hot-toast";

const RecieveComp = () => {
  const navigate = useNavigate();
  const { user,fetchUser } = useAuthStore();
  const { generateRequestQr, requestedQr, isLoading, clearRequestedQr } = useTransferStore();
  const [amount, setAmount] = useState("");

  useEffect(()=>{
    fetchUser()
  },[fetchUser])
  const handleGenerate = async () => {
    if (!amount || amount <= 0) return toast.error("Enter valid amount");
    
    const res = await generateRequestQr(amount);
    if (!res.success) toast.error(res.error);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
        <ArrowLeftIcon onClick={()=>navigate("/transfer")} className="w-5 h-5 cursor-pointer" />
        Recieve Money
        </h1>
        <p className="text-gray-400">
          Share your UPI QR or generate payment request
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Static Profile QR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 text-white">Your Personal QR</h2>
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            {user?.upiQr ? (
              <img src={user.upiQr} alt="My QR" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-zinc-400 italic text-xs">Generating...</div>
            )}
          </div>
          <p className="mt-6 text-xs text-zinc-500 uppercase tracking-widest">UPI ID</p>
          <p className="font-mono text-green-400">{user?.upiId || "Loading..."}</p>
        </div>

        {/* Dynamic Amount QR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4 text-white">Request Specific Amount</h2>
          <div className="mb-6">
            <label className="text-xs text-zinc-500 uppercase mb-2 block">Amount to Receive</label>
            <input type="number" placeholder="₹ 0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl outline-none focus:border-green-500" />
          </div>
          <button disabled={!amount || isLoading} onClick={handleGenerate}
            className="w-full py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 transition-all">
            {isLoading ? "Generating..." : "Generate Amount QR"}
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {requestedQr && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-1">Receive ₹{requestedQr.amount}</h2>
            <p className="text-zinc-500 text-sm mb-6">Scan to pay {requestedQr.payeeName}</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-6">
              <img src={requestedQr.qrCode} alt="Request QR" className="w-56 h-56" />
            </div>

            <div className="space-y-4">
              <button onClick={() => {
                const link = document.createElement('a');
                link.href = requestedQr.qrCode;
                link.download = `request_${requestedQr.amount}.png`;
                link.click();
              }} className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm transition">
                <ArrowDownTrayIcon className="w-4 h-4" /> Download QR
              </button>
              <button onClick={clearRequestedQr} className="w-full py-2 text-zinc-500 hover:text-white transition text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecieveComp;