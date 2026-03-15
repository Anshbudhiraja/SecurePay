import React from "react";
import ProfileDetails from "../Components/ProfileDetails";
import Sidebar from "../Components/Sidebar";
import TicketComp from "../Components/TicketComp";

const Ticket = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-7 overflow-auto">
        <TicketComp />
      </div>
    </div>
  );
};

export default Ticket;
