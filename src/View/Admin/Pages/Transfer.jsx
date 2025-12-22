import React from "react";
import Sidebar from "../Components/Sidebar";
import TransferComp from "../Components/TransferComp";

const Transfer = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <TransferComp />
        
      </div>
    </div>
  );
};

export default Transfer;
