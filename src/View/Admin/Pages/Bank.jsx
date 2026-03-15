import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import Sidebar from "../Components/Sidebar";
import BankComp from "../Components/BankComp";

const Bank = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-3 sm:p-5 md:p-7 overflow-x-hidden">
        <BankComp />
      </div>
    </div>
  );
};

export default Bank;
