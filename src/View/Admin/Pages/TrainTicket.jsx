import React from 'react'
import Sidebar from '../Components/Sidebar'
import TrainComp from '../Components/TrainComp'

const TrainTicket = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <TrainComp />
      </div>
    </div>
  )
}

export default TrainTicket
