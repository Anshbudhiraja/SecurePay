import React, { useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const ProfileComp = () => {
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ansh Budhiraja",
    email: "ansh@example.com",
    phone: "+91 98765 43210",
    password: "********",
    address: "123, Main Street",
    city: "Delhi",
    state: "Delhi",
    image: "profile.png",

    upiId: "ansh@upi",
    qrImage:
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ansh@upi",

    upiVerified: true,
    kycStatus: "VERIFIED", // VERIFIED | PENDING | REJECTED
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: URL.createObjectURL(file) });
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(profile.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = profile.qrImage;
    link.download = "upi-qr.png";
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* ================= Personal Details ================= */}
        <div className="w-full xl:w-[60%] bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Details</h2>

          {/* Profile Image */}
          <div className="flex items-center gap-6 mb-8">
            <img
              src={profile.image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-800"
            />

            <div>
              <label className="cursor-pointer inline-block bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG / JPG • Max 5MB</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Full Name", value: profile.name },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone },
              { label: "Password", value: profile.password },
              { label: "Address", value: profile.address },
              { label: "City", value: profile.city },
              { label: "State", value: profile.state },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-sm text-gray-400 mb-1 block">
                  {field.label}
                </label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-8">
        <button className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
          Edit Profile
        </button>
        <button className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500">
          Save Changes
        </button>
      </div>
        </div>

        {/* ================= Payment & KYC ================= */}
        <div className="w-full xl:w-[40%] bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Payment & Verification</h2>

          {/* KYC Status */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">KYC Status</p>
            <div
              className={`flex items-center gap-2 text-sm ${
                profile.kycStatus === "VERIFIED"
                  ? "text-green-400"
                  : profile.kycStatus === "PENDING"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              <IdentificationIcon className="w-5 h-5" />
              {profile.kycStatus}
            </div>
          </div>

          {/* UPI Status */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">UPI Status</p>
            {profile.upiVerified ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <ShieldCheckIcon className="w-5 h-5" />
                UPI Linked & Verified
              </div>
            ) : (
              <div className="text-yellow-400 text-sm">
                UPI not linked
              </div>
            )}
          </div>

          {/* QR */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={profile.qrImage}
              alt="UPI QR"
              className="w-48 h-48"
            />
            <button
              onClick={downloadQR}
              className="mt-3 flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download QR
            </button>
          </div>

          {/* UPI ID */}
          <div>
            <p className="text-sm text-gray-400 mb-1">UPI ID</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm">
                {profile.upiId}
              </div>
              <button
                onClick={copyUpi}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
              >
                {copied ? (
                  <CheckIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ClipboardIcon className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
