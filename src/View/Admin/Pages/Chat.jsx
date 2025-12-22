import React from "react";
import Sidebar from "../Components/Sidebar";
import ChatComp from "../Components/ChatComp";

const Chat = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
       <ChatComp/>
      </div>
    </div>
  );
};

export default Chat;
