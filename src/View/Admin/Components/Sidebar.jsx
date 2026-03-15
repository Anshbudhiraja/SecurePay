import { useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  BanknotesIcon,
  DocumentTextIcon,
  TicketIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore"
const menuItems = [
  { name: "Dashboard", icon: HomeIcon,path:"/admin" },
  { name: "Banks", icon: BuildingLibraryIcon,path:"/banks" },
  { name: "KYC", icon: IdentificationIcon,path:"/kyc" },
  { name: "Transfer", icon: BanknotesIcon,path:"/transfer" },
  { name: "Statements", icon: DocumentTextIcon,path:"/statements" },
  { name: "Tickets", icon: TicketIcon,path:"/tickets" },
  { name: "Chat", icon: ChatBubbleLeftRightIcon, path: "/chat" },
  { name: "Profile", icon: BellIcon,path:"/profile" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const {logout} = useAuthStore()
  const navigate = useNavigate()

  return (
    <div
      className={`bg-gray-900 text-gray-100 h-screen p-5 pt-8 relative transform-gpu transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-3 top-9 w-7 h-7 bg-gray-800 text-white rounded-full flex justify-center items-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5" />
        ) : (
          <Bars3Icon className="w-5 h-5" />
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-x-4 mb-8">
        <img style={{height:"30px"}}
          src="/logo.jpg"
          className={`cursor-pointer duration-500 ${isOpen && "rotate-[360deg]"}`}
          alt="Logo"
        />
        <h1
          className={`text-white origin-left font-bold text-xl duration-300 ${
            !isOpen && "scale-0"
          }`}
        >
          SecurePay
        </h1>
      </div>

      {/* Menu */}
      <ul className="flex-1">
        {menuItems.map((item, index) => (
          <li onClick={()=>navigate(item.path)}
            key={index}
            className="flex items-center gap-x-4 p-1.5 mt-2 rounded-md cursor-pointer hover:bg-gray-800 transition"
          >
            <item.icon className="w-6 h-6 text-gray-300" />
            <span
              className={`text-sm font-medium ${
                !isOpen && "hidden"
              } duration-200`}
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
       <div className="mt-6 mb-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <img
            src="/brand.png"
            alt="Ansh Budhiraja"
            className="w-12 h-12 rounded-full object-cover mb-2"
          />

          {isOpen && (
            <>
              <h3 className="text-sm font-semibold text-white">
                Ansh Budhiraja
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Building Secure Digital Payments
              </p>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-4" />

      {/* Bottom section */}
      <div>
        <div onClick={logout} className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-red-600 transition">
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-400" />
          <span
            className={`text-sm font-medium text-red-400 ${
              !isOpen && "hidden"
            }`}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
