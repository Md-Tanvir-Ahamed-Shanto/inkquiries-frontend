"use client";
import React, { useState } from "react";
import Image from "next/image";
import AuthImage from "@/public/assets/authimage.png";
import { Lock, Eye, EyeOff } from "lucide-react";

const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Set password submitted with:", { password, confirmPassword });
    // Add your logic to update the password
    alert("Password has been reset successfully");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const formFields = [
    { label: "New Password", name: "password" },
    { label: "Confirm New Password", name: "confirmPassword" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-12">
            <h1 className="text-neutral-800 text-3xl md:text-4xl font-bold font-['Inter'] leading-tight mb-2">
              Set Password
            </h1>
            <p className="text-neutral-800 text-base font-normal leading-normal tracking-tight">
              Please enter and confirm your new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formFields.map((field) => (
              <div
                key={field.name}
                className="self-stretch h-14 p-3.5 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5"
              >
                <div className="w-4 h-4 relative flex items-center justify-center text-gray-950">
                  <Lock size={16} />
                </div>
                <input
                  type={
                    field.name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name={field.name}
                  placeholder={field.label}
                  value={field.name === "password" ? password : confirmPassword}
                  onChange={
                    field.name === "password"
                      ? handlePasswordChange
                      : handleConfirmPasswordChange
                  }
                  className="flex-grow text-zinc-500 text-base font-normal leading-tight focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="flex-shrink-0 text-zinc-500"
                >
                  {field.name === "password" ? (
                    showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )
                  ) : showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            ))}

            <button
              type="submit"
              className="self-stretch h-12 px-6 py-4 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal"
            >
              Set new password
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center p-6 rounded-xl">
        <Image
          src={AuthImage}
          alt="auth"
          width={668}
          height={892}
          className="max-w-xl h-auto object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default SetPasswordPage;
