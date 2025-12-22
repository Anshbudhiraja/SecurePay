import React from 'react'
import Sidebar from '../Components/Sidebar'
import AnalyticsComp from '../Components/AnalyticsComp'

const Analytics = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <AnalyticsComp/>
      </div>
    </div>
  )
}

export default Analytics
