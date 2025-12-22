import React from 'react'
import Sidebar from '../Components/Sidebar'
import AllBanksComp from '../Components/AllBanksComp'

const AllBanks = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
       <AllBanksComp/>
      </div>
    </div>
  )
}

export default AllBanks
