import React from "react";
import Sidebar from "../Components/Sidebar";
import PayComp from "../Components/PayComp";
import RecieveComp from "../Components/RecieveComp";

const TransferRecieve = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-3 sm:p-5 md:p-7 overflow-x-hidden">
        <RecieveComp />
        
      </div>
    </div>
  );
};

export default TransferRecieve;
