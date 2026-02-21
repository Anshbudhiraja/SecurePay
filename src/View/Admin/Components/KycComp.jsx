import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';
import useKycStore from "@/stores/admin/kycStore";
const KycComp = () => {
  const { kycData, isLoading, error, fetchKycStatus, submitKyc } = useKycStore();
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);
  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);
  const handleSubmit = async() => {
    if (!video || !document) {
     toast.error("Please upload both video and document");
      return;
    }

    toast.promise(submitKyc(video, document), {
    loading: 'Uploading KYC files...',
    success: (result) => {
      if (result.success) return 'KYC Submitted successfully!';
      throw new Error(result.error); 
    },
    error: (err) => `Error: ${err.message || "Upload failed"}`,
  });
  };

  const renderStatus = (status) => {
    switch (status) {
      case true:
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            Approved
          </div>
        );
      case false:
        return (
          <div className="flex items-center gap-2 text-red-400">
            <XCircleIcon className="w-5 h-5" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <ClockIcon className="w-5 h-5" />
            Pending Verification
          </div>
        );
    }
  };
  if (isLoading) return <div className="text-center text-gray-400">Loading KYC info...</div>;
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-gray-400">
          Complete your KYC to unlock all features
        </p>
      </div>
    {error && <p className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg">{error}</p>}
      {kycData ? (
        /* Status View */
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Submitted KYC Details</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Video Evidence</span>
              <a href={kycData.video} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View Video</a>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">ID Document</span>
              <a href={kycData.pdf} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View PDF</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Status</span>
              {renderStatus(kycData.status)}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Submit Your KYC</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload Recorded Video</label>
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload Identity Document (PDF)</label>
              <input type="file" accept="application/pdf" onChange={(e) => setDocument(e.target.files[0])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSubmit} disabled={isLoading}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 transition px-6 py-2 rounded-lg font-medium">
                {isLoading ? "Uploading..." : "Submit KYC"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
            ⚠️ KYC can be submitted only once. Please ensure files are correct.
          </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycComp;
