import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuthStore from "../../../stores/authStore";
import toast from "react-hot-toast";

const LoginComp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { login, isLoading, error: apiError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const result = await login(formData.email, formData.password);
  
  if (result.success) {
    if (result.type === 'DONE') {
      toast.success("Welcome back!");
      console.log("Redirecting...");
    } else if (result.type === 'OTP_SENT') {
      toast.success("OTP sent to your email");
      console.log("Please check your email for OTP");
    }
  } else {
    toast.error(result.error);
  }
};

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-white">Welcome Back 👋</h1>
        <p className="text-sm text-zinc-400 mt-1">Login to your account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Show API error if it exists */}
        {apiError && (
          <p className="text-center text-sm text-red-500 bg-red-500/10 py-2 rounded">
            {apiError}
          </p>
        )}

        <div className="space-y-1">
          <Label className="text-zinc-300">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <Label className="text-zinc-300">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black hover:bg-zinc-200"
        >
          {isLoading ? "Verifying..." : "Login"}
        </Button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="px-3 text-xs text-zinc-400">OR</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Continue with Google
      </Button>
    </div>
  );
};

export default LoginComp;