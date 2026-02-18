import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "../../../stores/authStore";
const OtpComp = ({ email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errors, setError] = useState("");
  const inputsRef = useRef([]);
  const { verifyOtp, isLoading, error, tempEmail, setStep, clearError } = useAuthStore();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async() => {
    if (otp.includes("")) {
      setError("Please enter the complete OTP");
      return;
    }

    setError("");
    const enteredOtp = otp.join("");
    const result = await verifyOtp(enteredOtp);
    if (result.success) {
      console.log("Verified! Redirecting...");
    }
  };
  const handleBack = () => {
    clearError();
    setStep('login');
  };

  const resendOtp = () => {
    console.log("Resend OTP to:", email);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl text-center">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-white">
        Verify Your Email
      </h1>
      <p className="text-sm text-zinc-400 mt-2">
        Enter the 6-digit OTP sent to <br />
        <span className="text-white font-medium">{email}</span>
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mt-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-lg rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        ))}
      </div>

      {/* Error */}
      {errors && (
        <p className="text-sm text-red-500 mt-4">{errors}</p>
      )}

      {/* Verify Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || otp.length !== 6}
        className="w-full mt-6 bg-white text-black hover:bg-zinc-200"
      >
        {isLoading ? "Verifying..." : "Verify Account"}
      </Button>
      <Button 
        onClick={handleBack}
        className="w-full mt-4 text-sm text-zinc-500 hover:text-white transition-colors"
      >
        ← Back to Login
      </Button>

      {/* Resend */}
      <p className="text-sm text-zinc-400 mt-4">
        Didn’t receive the code?{" "}
        <span
          onClick={resendOtp}
          className="text-white cursor-pointer hover:underline"
        >
          Resend OTP
        </span>
      </p>
    </div>
  );
};

export default OtpComp;
