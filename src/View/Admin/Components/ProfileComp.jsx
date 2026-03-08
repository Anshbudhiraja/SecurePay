import React, { useState, useEffect } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../../../stores/authStore"; 
import useProfileStore from "../../../stores/admin/profileStore";
import toast from "react-hot-toast";

const ProfileComp = () => {
  const { user, fetchUser,token } = useAuthStore(); 
  const { updateImage, updateDetails, processUpi, isLoading } = useProfileStore();
  
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const initApp = async () => {
      if (token) {
        await fetchUser();
      }
      setCheckingAuth(false);
    };
    initApp();
  }, []);
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        password: "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
      });
      if(user?.kyc_verified && !user?.upiId && !isLoading){
        handleGenerateUpi()
      }
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      toast.promise(updateImage(file), {
        loading: "Uploading photo...",
        success: (res) => {
          if (res.success) {
            fetchUser();
            return "Photo updated!";
          }
          throw new Error(res.error);
        },
        error: (err) => err.message,
      });
    }
  };

  const handleSaveDetails = async () => {
    toast.promise(updateDetails(formData), {
      loading: "Saving details...",
      success: (res) => {
        if (res.success) {
          setIsEditing(false);
          fetchUser();
          return "Profile updated!";
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };

  const handleGenerateUpi = async () => {
    const upiPrompt = window.prompt("Enter UPI ID or leave blank for default:", user.upiId || "");
    if (upiPrompt === null) return;

    toast.promise(processUpi(upiPrompt), {
      loading: "Processing UPI & QR...",
      success: (res) => {
        if (res.success) {
          fetchUser();
          return "UPI/QR updated successfully!";
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(user?.upiId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("UPI ID copied!");
  };
  if (checkingAuth) return <div className="bg-black h-screen flex items-center justify-center">Loading...</div>;
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* ================= Personal Details ================= */}
        <div className="w-full xl:w-[60%] bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Personal Details</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-blue-400 hover:underline"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <img
              src={user?.image || (user?.firstName ? "https://ui-avatars.com/api/?name=" + user?.firstName : "profile.png")}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-zinc-800"
            />
            <div>
              <label className="cursor-pointer inline-block bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm text-white">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <p className="text-xs text-zinc-500 mt-2">PNG / JPG • Max 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="text-sm text-zinc-500 mb-1 block capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                {isEditing ? (
                  <input
                    type={key === "password" ? "password" : "text"}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                ) : (
                  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-300">
                    {key === "password" ? "********" : user?.[key] || "Not Set"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex justify-end mt-8">
              <button 
                onClick={handleSaveDetails}
                disabled={isLoading}
                className="px-8 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium disabled:bg-zinc-700"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ================= Payment & KYC ================= */}
        <div className="w-full xl:w-[40%] bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white">Verification & UPI</h2>

          <div className="space-y-6">
            {/* KYC Status */}
            <div>
              <p className="text-sm text-zinc-500 mb-1">KYC Status</p>
              <div className={`flex items-center gap-2 text-sm font-medium ${user?.kyc_verified ? "text-green-400" : "text-yellow-400"}`}>
                <IdentificationIcon className="w-5 h-5" />
                {user?.kyc_verified ? "VERIFIED" : "PENDING VERIFICATION"}
              </div>
            </div>

            {/* QR Section */}
            <div className="flex flex-col items-center bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-500 mb-3 self-start">My UPI QR Code</p>
              {user?.upiQr ? (
                <>
                  <img src={user.upiQr} alt="UPI QR" className="w-48 h-48 rounded-lg bg-white p-2" />
                  <a 
                    href={user.upiQr} 
                    download="my-upi-qr.png"
                    className="mt-4 flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" /> Download QR
                  </a>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center text-zinc-600 text-xs italic">
                  No QR Generated Yet
                </div>
              )}
            </div>

            {/* UPI ID Section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-zinc-500">Linked UPI ID</p>
                <button onClick={handleGenerateUpi} className="text-[10px] text-blue-400 uppercase tracking-widest">Update</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-sm text-zinc-300">
                  {user?.upiId || "Not Linked"}
                </div>
                <button onClick={copyUpi} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700">
                  {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-zinc-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;