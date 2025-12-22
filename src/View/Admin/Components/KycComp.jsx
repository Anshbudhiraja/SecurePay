import React, { useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const KycComp = () => {
  const [kycData, setKycData] = useState(null);
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);

  const handleSubmit = () => {
    if (!video || !document) {
      alert("Please upload both video and document");
      return;
    }

    // Mock submission (replace with API later)
    setKycData({
      videoName: video.name,
      documentName: document.name,
      status: "pending", // pending | approved | rejected
      submittedAt: new Date().toLocaleString(),
    });
  };

  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            Approved
          </div>
        );
      case "rejected":
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-gray-400">
          Complete your KYC to unlock all features
        </p>
      </div>

      {/* If KYC already submitted */}
      {kycData ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Submitted KYC Details</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Video File</span>
              <span>{kycData.videoName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Document File</span>
              <span>{kycData.documentName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Submitted On</span>
              <span>{kycData.submittedAt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              {renderStatus(kycData.status)}
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            🔒 KYC can only be submitted once. Please wait for verification.
          </div>
        </div>
      ) : (
        /* KYC Submission Form */
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Submit Your KYC</h2>

          <div className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Upload Recorded Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Upload Identity Document (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setDocument(e.target.files[0])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded-lg font-medium"
              >
                Submit KYC
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            ⚠️ KYC can be submitted only once. Please ensure files are correct.
          </p>
        </div>
      )}
    </div>
  );
};

export default KycComp;
