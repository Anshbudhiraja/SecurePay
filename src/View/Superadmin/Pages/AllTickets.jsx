import React from 'react'
import Sidebar from '../Components/Sidebar'
import AllTicketsComp from '../Components/AllTicketsComp'

const AllTickets = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <AllTicketsComp/>
      </div>
    </div>
  )
}

export default AllTickets
