import React from "react";
import Sidebar from "../Components/Sidebar";
import PayComp from "../Components/PayComp";

const TransferPay = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <PayComp />
        
      </div>
    </div>
  );
};

export default TransferPay;
