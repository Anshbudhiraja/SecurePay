import React from "react";
import Sidebar from "../Components/Sidebar";
import ProfileComp from "../Components/ProfileComp";

const Profile = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
       <ProfileComp/>
      </div>
    </div>
  );
};

export default Profile;
