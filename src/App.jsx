import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './View/Common/Pages/Login'
import Dashboard from './View/Admin/Pages/Dashboard'
import Profile from './View/Admin/Pages/Profile'
import Kyc from './View/Admin/Pages/Kyc'
import Bank from './View/Admin/Pages/Bank'
import Ticket from './View/Admin/Pages/Ticket'
import TrainTicket from './View/Admin/Pages/TrainTicket'
import FlightTicket from './View/Admin/Pages/FlightTicket'
import Statements from './View/Admin/Pages/Statements'
import Transfer from './View/Admin/Pages/Transfer'
import TransferPay from './View/Admin/Pages/TransferPay'
import TransferRecieve from './View/Admin/Pages/TransferRecieve'
import SuperadminDashboard from './View/Superadmin/Pages/SuperadminDashboard'
import AllBanks from './View/Superadmin/Pages/AllBanks'
import AllTickets from './View/Superadmin/Pages/AllTickets'
import KycVerification from './View/Superadmin/Pages/KycVerification'
import SuperadminProfile from './View/Superadmin/Pages/SuperadminProfile'
import Analytics from './View/Superadmin/Pages/Analytics'
import Chat from './View/Admin/Pages/Chat'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/admin' element={<Dashboard/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/kyc' element={<Kyc/>}></Route>
        <Route path='/banks' element={<Bank/>}></Route>
        <Route path='/tickets' element={<Ticket/>}></Route>
        <Route path='/tickets/train' element={<TrainTicket/>}></Route>
        <Route path='/tickets/flight' element={<FlightTicket/>}></Route>
        <Route path='/statements' element={<Statements/>}></Route>
        <Route path='/transfer' element={<Transfer/>}></Route>
        <Route path='/transfer/pay' element={<TransferPay/>}></Route>
        <Route path='/transfer/recieve' element={<TransferRecieve/>}></Route>
        <Route path='/chat' element={<Chat/>}></Route>
        <Route path='/superadmin' element={<SuperadminDashboard/>}></Route>
        <Route path='/analytics' element={<Analytics/>}></Route>
        <Route path='/yourprofile' element={<SuperadminProfile/>}></Route>
        <Route path='/kycverification' element={<KycVerification/>}></Route>
        <Route path='/allbanks' element={<AllBanks/>}></Route>
        <Route path='/alltickets' element={<AllTickets/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
