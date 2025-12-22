import React from "react";
import LoginComp from "../Components/LoginComp";
import OtpComp from "../Components/OtpComp";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Brand / Advertisement */}
      <img
        src={"brand.png"}
        alt="Brand Advertisement"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Optional overlay to darken the background */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <LoginComp />
        {/* <OtpComp email="john@example.com" /> */}
      </div>
    </div>
  );
};

export default Login;
