import React, { useState } from "react";

const KycVerificationComp = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      username: "rahul_99",
      token: "USR-98231",
      pdfUrl: "/docs/rahul_kyc.pdf",
      videoUrl: "/videos/rahul_verification.mp4",
      status: "pending",
    },
    {
      id: 2,
      username: "priya_dev",
      token: "USR-77412",
      pdfUrl: "/docs/priya_kyc.pdf",
      videoUrl: "/videos/priya_verification.mp4",
      status: "pending",
    },
  ]);

  const [selectedKyc, setSelectedKyc] = useState(null);

  /* ---------------- Actions ---------------- */
  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    );
    setSelectedKyc(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-gray-400">
          Review and verify user KYC requests
        </p>
      </div>

      {/* Requests */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="font-semibold text-lg">
                  {req.username}
                </p>
                <p className="text-sm text-gray-400">
                  Token: {req.token}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    req.status === "pending"
                      ? "bg-yellow-900 text-yellow-400"
                      : req.status === "approved"
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>

                {req.status === "pending" && (
                  <button
                    onClick={() => setSelectedKyc(req)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No KYC requests
        </p>
      )}

      {/* ================= Review Modal ================= */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Review KYC – {selectedKyc.username}
              </h2>
              <button
                onClick={() => setSelectedKyc(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PDF */}
              <div>
                <h3 className="font-semibold mb-2">KYC Document (PDF)</h3>
                <iframe
                  src={selectedKyc.pdfUrl}
                  title="KYC PDF"
                  className="w-full h-80 rounded-lg border border-gray-700 bg-black"
                />
              </div>

              {/* Video */}
              <div>
                <h3 className="font-semibold mb-2">
                  Verification Video
                </h3>
                <video
                  src={selectedKyc.videoUrl}
                  controls
                  className="w-full h-80 rounded-lg border border-gray-700 bg-black"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() =>
                  updateStatus(selectedKyc.id, "declined")
                }
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium"
              >
                Decline
              </button>
              <button
                onClick={() =>
                  updateStatus(selectedKyc.id, "approved")
                }
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
