import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import SuperadminComp from "../Components/SuperadminComp";
import Sidebar from "../Components/Sidebar";

const SuperadminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <SuperadminComp />
        {/* Uncomment if you want profile details */}
        {/* <ProfileDetails /> */}
      </div>
    </div>
  );
};

export default SuperadminDashboard;
