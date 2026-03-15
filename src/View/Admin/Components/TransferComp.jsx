import React from "react";
import { useNavigate } from "react-router-dom";

const TransferComp = () => {
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mt-4 ms-2 mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Transfer Money</h1>
      <p className="text-gray-400 text-sm sm:text-base">
          Send or receive money securely
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Pay Card */}
        <div onClick={()=>navigate("/transfer/pay")} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 md:p-8 hover:border-red-500 transition-all duration-200 cursor-pointer hover:border-red-500 transition-all duration-200 cursor-pointer 
hover:scale-[1.02] active:scale-[0.98]" >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">💸</span>
            <span className="text-xs bg-red-900 text-red-400 px-3 py-1 rounded-full">
              PAY
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Pay Money
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Send money to friends, merchants, or pay bills instantly.
          </p>
        </div>

        {/* Receive Card */}
        <div onClick={()=>navigate("/transfer/recieve")} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 md:p-8 hover:border-red-500 transition-all duration-200 cursor-pointer hover:border-red-500 transition-all duration-200 cursor-pointer 
hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">💰</span>
            <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full">
              RECEIVE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Receive Money
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Request money or receive payments directly into your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferComp;
