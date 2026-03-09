import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import ChatComp from "../Components/ChatComp";
import useAuthStore  from "@/stores/authStore";

const Chat = () => {
  const { user,fetchUser } = useAuthStore(); 
  useEffect(()=>{
    fetchUser()
  },[fetchUser])

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-7 overflow-hidden flex flex-col">
        {user ? (
          <ChatComp currentUser={user} fetchUser = {fetchUser} />
        ) : (
          <div className="flex items-center justify-center h-full">
             <p className="text-gray-500">Please log in to access chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;