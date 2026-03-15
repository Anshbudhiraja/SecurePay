import React, { useEffect } from "react";
import ProfileDetails from "../Components/ProfileDetails";
import DashboardComp from "../Components/DashboardComp";
import Sidebar from "../Components/Sidebar";
import useAuthStore from "@/stores/authStore";

const Dashboard = () => {
  const { fetchUser, isProfileComplete, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading Profile...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {!isProfileComplete ? (
        <ProfileDetails />
      ) : (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-7 overflow-y-auto bg-black"> {/* Changed to main for SEO/A11y */}
        <DashboardComp />
      </main>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
