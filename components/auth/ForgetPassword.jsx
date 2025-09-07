"use client";
import React, { useState } from "react";
import Image from "next/image";
import AuthImage from "@/public/assets/authimage.png";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password submitted with email:", email);
    // Add your logic to send a password reset link
    alert(`Password reset link sent to: ${email}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-12">
            <h1 className="text-neutral-800 text-3xl md:text-4xl font-bold font-['Inter'] leading-tight mb-2">
              Forgot Password
            </h1>
            <p className="text-neutral-800 text-base font-normal leading-normal tracking-tight">
              We'll email you a link to reset your password. Please enter your
              email address below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="self-stretch h-14 p-3.5 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5">
              <div className="w-4 h-4 relative flex items-center justify-center text-gray-950">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
                className="flex-grow text-zinc-500 text-base font-normal leading-tight focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="self-stretch h-12 px-6 py-4 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal"
            >
              Send recovery link
            </button>
          </form>

          <div className="self-stretch text-center mt-6">
            <span className="text-neutral-600 text-base font-medium  leading-normal tracking-tight cursor-pointer">
              Back to Log in
            </span>
          </div>
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

export default ForgotPasswordPage;
