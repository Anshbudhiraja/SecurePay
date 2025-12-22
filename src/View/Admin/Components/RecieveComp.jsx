import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {ArrowLeftIcon} from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom";
const UPI_ID = "ansh@upi"; // your static UPI ID

const RecieveComp = () => {
  const [amount, setAmount] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate()
  // UPI QR payload
  const qrValue = amount
    ? `upi://pay?pa=${UPI_ID}&am=${amount}&cu=INR`
    : `upi://pay?pa=${UPI_ID}&cu=INR`;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
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
        {/* ================= Static QR Card ================= */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center hover:border-green-500 transition">
          <h2 className="text-lg font-semibold mb-4">
            Your UPI QR
          </h2>

          <div className="bg-white p-3 rounded-xl">
            <QRCodeCanvas value={qrValue} size={180} />
          </div>

          <p className="mt-4 text-sm text-gray-400">
            UPI ID
          </p>
          <p className="font-semibold text-green-400">
            {UPI_ID}
          </p>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Anyone can scan and pay you
          </p>
        </div>

        {/* ================= Generate QR with Amount ================= */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-500 transition">
          <h2 className="text-lg font-semibold mb-4">
            Request Specific Amount
          </h2>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Enter Amount
            </label>
            <input
              type="number"
              placeholder="₹ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Generate Button */}
          <button
            disabled={!amount}
            onClick={() => setShowQRModal(true)}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              amount
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 cursor-not-allowed text-gray-400"
            }`}
          >
            Generate QR
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            QR will include the entered amount
          </p>
        </div>
      </div>

      {/* ================= QR Modal ================= */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2">
              Receive ₹{amount}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Ask payer to scan this QR
            </p>

            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCodeCanvas value={qrValue} size={220} />
            </div>

            <p className="mt-4 text-sm text-gray-400">
              UPI ID: <span className="text-green-400">{UPI_ID}</span>
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-6 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecieveComp;
