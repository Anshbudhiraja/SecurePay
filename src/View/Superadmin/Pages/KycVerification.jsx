import React from 'react'
import Sidebar from '../Components/Sidebar'
import KycVerificationComp from '../Components/KycVerificationComp'

const KycVerification = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-7 overflow-auto">
        <KycVerificationComp/>
      </div>
    </div>
  )
}

export default KycVerification
