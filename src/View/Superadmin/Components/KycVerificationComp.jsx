import React, { useState, useEffect } from "react";
import useSuperAdminStore from "@/stores/superadmin/kycStore";
import toast from "react-hot-toast";

const KycVerificationComp = () => {
  const { requests, isLoading, fetchAllRequests, acceptKyc, declineKyc } = useSuperAdminStore();
  const [selectedKyc, setSelectedKyc] = useState(null);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  const handleAction = async (id, actionType) => {
    const action = actionType === "approved" ? acceptKyc : declineKyc;
    
    toast.promise(action(id), {
      loading: `${actionType === "approved" ? "Approving" : "Declining"} request...`,
      success: () => {
        setSelectedKyc(null);
        return `KYC ${actionType === "approved" ? "Accepted" : "Declined"} Successfully`;
      },
      error: (err) => err.error || "Action failed",
    });
  };

  if (isLoading && requests.length === 0) {
    return <div className="text-center text-gray-400 mt-20">Loading KYC Requests...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-gray-400">Review and verify user KYC requests</p>
      </div>

      {requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests?.filter(req => req !== null)?.map((req) => {
           return (
            <div key={req._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="font-semibold text-lg">
                  {req.userId ? `${req.userId.firstName || ""} ${req.userId.lastName || ""}` : "Unknown User"}
                </p>
                <p className="text-sm text-gray-400">{req.userId?.email || "No email available"}</p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  req.status 
                    ? "bg-green-900 text-green-400" 
                    : "bg-yellow-900 text-yellow-400" 
                }`}>
                  {req.status ? "ACCEPTED" : "PENDING"}
                </span>
                <button disabled={req.status}
                  onClick={() => setSelectedKyc(req)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
                >
                  Review
                </button>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">No pending KYC requests</p>
      )}

      {selectedKyc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Review KYC – {selectedKyc.userId?.firstName}</h2>
              <button onClick={() => setSelectedKyc(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">KYC Document (PDF)</h3>
                <iframe src={selectedKyc.pdf} title="KYC PDF" className="w-full h-80 rounded-lg border border-gray-700 bg-black" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Verification Video</h3>
                <video src={selectedKyc.video} controls className="w-full h-80 rounded-lg border border-gray-700 bg-black" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAction(selectedKyc._id, "declined")}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium"
              >
                Decline
              </button>
              <button
                onClick={() => handleAction(selectedKyc._id, "approved")}
                className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycVerificationComp;