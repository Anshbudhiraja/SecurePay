import React, { useEffect } from "react";
import ProfileDetails from "../Components/ProfileDetails";
import SuperadminComp from "../Components/SuperadminComp";
import Sidebar from "../Components/Sidebar";
import useAuthStore from "@/stores/authStore";
const SuperadminDashboard = () => {
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
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-7 overflow-auto">
          <SuperadminComp />
        </div>
      </div>
      )}
    </div>
  );
};

export default SuperadminDashboard;
