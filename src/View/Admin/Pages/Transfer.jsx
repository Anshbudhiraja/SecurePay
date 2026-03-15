import React from "react";
import Sidebar from "../Components/Sidebar";
import TransferComp from "../Components/TransferComp";

const Transfer = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="max-w-6xl mx-auto w-full px-1 sm:px-2">
        <TransferComp />
        
      </div>
    </div>
  );
};

export default Transfer;
