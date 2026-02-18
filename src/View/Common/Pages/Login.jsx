import React, { useEffect } from "react";
import LoginComp from "../Components/LoginComp";
import OtpComp from "../Components/OtpComp";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { step, tempEmail,token, role } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role) {
      navigate(`/${role}`);
    }
  }, [token, role, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <img
        src={"brand.png"}
        alt="Brand Advertisement"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-lg px-4">
        {step === 'login' ? (
          <LoginComp />
        ) : (
          <OtpComp email={tempEmail} />
        )}
      </div>
    </div>
  );
};

export default Login;
