import React from 'react'
import Sidebar from '../Components/Sidebar'
import FlightComp from '../Components/FlightComp'

const FlightTicket = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-7 overflow-auto">
        <FlightComp />
      </div>
    </div>
  )
}

export default FlightTicket
