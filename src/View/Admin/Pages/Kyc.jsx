import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import KycComp from "../Components/KycComp";
import Sidebar from "../Components/Sidebar";

const Kyc = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <KycComp />
      </div>
    </div>
  );
};

export default Kyc;
