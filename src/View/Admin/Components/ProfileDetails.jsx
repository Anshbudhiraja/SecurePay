import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/authStore";
const ProfileDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const { updateProfile, isLoading, error: apiError } = useAuthStore();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const generalRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!generalRegex.test(formData.firstName)) newErrors.firstName = "Invalid first name";
    if (!generalRegex.test(formData.lastName)) newErrors.lastName = "Invalid last name";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number";

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await updateProfile(formData);
    if (result.success) {
      console.log("Profile updated successfully!");
    }
  };

  return (
    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Profile Details
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        {apiError && (
          <p className="text-center text-sm text-red-500 bg-red-500/10 py-2 rounded border border-red-500/20">
            {apiError}
          </p>
        )}
        <div className="space-y-1">
          <Label className="text-zinc-300">First Name</Label>
          <Input
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <Label className="text-zinc-300">Last Name</Label>
          <Input
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label className="text-zinc-300">Phone</Label>
          <Input
            name="phone"
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <Label className="text-zinc-300">Address</Label>
          <Input
            name="address"
            placeholder="123 Street Name"
            value={formData.address}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1">
          <Label className="text-zinc-300">City</Label>
          <Input
            name="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-1">
          <Label className="text-zinc-300">State</Label>
          <Input
            name="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          {errors.state && (
            <p className="text-xs text-red-500">{errors.state}</p>
          )}
        </div>

        <Button
          type="submit" disabled={isLoading}
          className="w-full bg-white text-black hover:bg-zinc-200"
        >
          {isLoading ? "Saving..." : "Save and Continue"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileDetails;
