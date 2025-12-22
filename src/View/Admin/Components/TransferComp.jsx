import React from "react";
import { useNavigate } from "react-router-dom";

const TransferComp = () => {
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transfer Money</h1>
        <p className="text-gray-400">
          Send or receive money securely
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pay Card */}
        <div onClick={()=>navigate("/transfer/pay")} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-red-500 transition cursor-pointer">
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl">💸</span>
            <span className="text-xs bg-red-900 text-red-400 px-3 py-1 rounded-full">
              PAY
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Pay Money
          </h2>
          <p className="text-gray-400">
            Send money to friends, merchants, or pay bills instantly.
          </p>
        </div>

        {/* Receive Card */}
        <div onClick={()=>navigate("/transfer/recieve")} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500 transition cursor-pointer">
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl">💰</span>
            <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full">
              RECEIVE
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Receive Money
          </h2>
          <p className="text-gray-400">
            Request money or receive payments directly into your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferComp;
