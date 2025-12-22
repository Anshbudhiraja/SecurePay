import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import Sidebar from "../Components/Sidebar";
import BankComp from "../Components/BankComp";

const Bank = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <BankComp />
      </div>
    </div>
  );
};

export default Bank;
