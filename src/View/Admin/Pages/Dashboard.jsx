import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import DashboardComp from "../Components/DashboardComp";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-7 overflow-auto">
          <DashboardComp />
        </div>
      </div>
      {/* <ProfileDetails /> */}
    </div>
  );
};

export default Dashboard;
