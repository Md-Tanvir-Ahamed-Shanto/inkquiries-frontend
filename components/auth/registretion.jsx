"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AuthImage from "@/public/assets/authimage.png";
import { User, Mail, Link as LinkIcon, Lock, Eye, EyeOff, User2, UserCheck, } from "lucide-react";

import { registerArtist, registerClient, claimArtistAccount } from "../../service/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import backendUrl from "@/utils/baseUrl";

const Registration = () => {
  const [activeUserType, setActiveUserType] = useState("Client");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    socialHandleLink: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isClaimableAccount, setIsClaimableAccount] = useState(false);
  const [isCheckingClaim, setIsCheckingClaim] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
    
    // Check for claimable account when social handle is entered
    if (name === "socialHandleLink" && value && activeUserType === "Artist") {
      checkForClaimableAccount(value);
    }
  };
  
  const checkForClaimableAccount = async (socialHandle) => {
    if (!socialHandle) return;
    
    setIsCheckingClaim(true);
    try {
      // Make a request to check if this social handle has an unclaimed account
      const response = await fetch(`${backendUrl}/api/artists/check-claimable?socialHandle=${encodeURIComponent(socialHandle)}`);
      const data = await response.json();
      
      setIsClaimableAccount(data.claimable || false);
    } catch (err) {
      console.error("Error checking for claimable account:", err);
      setIsClaimableAccount(false);
    } finally {
      setIsCheckingClaim(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("All fields are required.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);

    try {
      // If this is a claimable artist account
      if (activeUserType === "Artist" && isClaimableAccount && formData.socialHandleLink) {
        // Claim the existing account
        const claimPayload = {
          email: formData.email,
          password: formData.password,
          socialHandle: formData.socialHandleLink
        };
        
        const res = await claimArtistAccount(claimPayload);
        if (res) {
          router.push("/artist/dashboard");
          toast.success("Account claimed successfully! Welcome to Inkquiries.");
          setFormData({
            fullName: "",
            email: "",
            socialHandleLink: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          toast.error(
            res.message || "An unexpected error occurred while claiming the account."
          );
        }
      } else {
        // Regular registration flow
        const payload = {
          name: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,  
          role: activeUserType.toUpperCase(),
        };

        if (activeUserType === "Artist") {
          // Add social handle if provided
          if (formData.socialHandleLink) {
            payload.socialHandle = formData.socialHandleLink;
          }
          
          const res = await registerArtist(payload)
          if (res) {
            router.push("/login");
            toast.success("Registration successful! You can now log in.");
            setFormData({
              fullName: "",
              email: "",
              socialHandleLink: "",
              username: "",
              password: "",
              confirmPassword: "",
            });
          } else {
            toast.error(
              res.message || "An unexpected error occurred during registration."
            );
          }
        } else {
          const res = await registerClient(payload);
          if (res) {
            router.push("/login");
            toast.success("Registration successful! You can now log in.");
            setFormData({
              fullName: "",
              email: "",
              username: "",
              socialHandleLink: "",
              password: "",
              confirmPassword: "",
            });
          } else {
            toast.error(
              res.message || "An unexpected error occurred during registration."
            );
          }
        }
      }
    } catch (err) {
      toast.error(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const formFields = [
    { label: "Full Name", name: "fullName", icon: <User size={16} /> },
    { label: "Enter Email", name: "email", icon: <Mail size={16} /> },
    ...(activeUserType === "Artist"
      ? [
          {
            label: "Social Handle Link",
            name: "socialHandleLink",
            icon: <LinkIcon size={16} />,
          },
        ]
      : []),
    { label: "Username", name: "username", icon: <UserCheck size={16} /> },
    { label: "Password", name: "password", icon: <Lock size={16} /> },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      icon: <Lock size={16} />,
    },
  ];

  // Handler for social login buttons
  const handleSocialLogin = (provider) => {
    // The social login flow is a redirect.
    // The backend handles the OAuth process and redirects back to the frontend with a token.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const role = activeUserType.toLowerCase();
    window.location.href = `${backendUrl}/auth/${provider}?role=${role}`;
  };

  return (
    <div className="flex flex-col md:flex-row w-full items-center md:px-24 justify-center min-h-screen bg-white overflow-hidden">
      <div className="flex flex-col w-full items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-3xl">
          <div className="mb-8 md:mb-12">
            <h1 className="text-neutral-800 text-3xl md:text-4xl font-bold font-['Inter'] leading-tight mb-2">
              Create an account
            </h1>
            <p className="text-neutral-800 text-base font-normal leading-normal tracking-tight">
              We're excited to see you again! Please log in to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 h-12 px-6 cursor-pointer py-4 bg-slate-50 rounded-lg flex justify-center items-center gap-2.5 text-zinc-950 text-base font-semibold font-['Inter'] leading-normal ${
                  activeUserType === "Client"
                    ? " outline-[1.50px] outline-offset-[-1.50px] outline-black"
                    : ""
                }`}
                onClick={() => setActiveUserType("Client")}
              >
                Client
              </button>
              <button
                type="button"
                className={`flex-1 h-12 px-6 cursor-pointer py-4 bg-slate-50 rounded-lg flex justify-center items-center gap-2.5 text-zinc-950 text-base font-semibold font-['Inter'] leading-normal ${
                  activeUserType === "Artist"
                    ? " outline-[1.50px] outline-offset-[-1.50px] outline-black"
                    : ""
                }`}
                onClick={() => setActiveUserType("Artist")}
              >
                Artist
              </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {formFields.map((field) => (
              <div
                key={field.name}
                className="self-stretch h-14 p-3.5 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5"
              >
                <div className="w-4 h-4 relative flex items-center justify-center text-gray-950">
                  {field.icon}
                </div>
                <input
                  type={
                    field.name.includes("password")
                      ? showPassword && field.name === "password"
                        ? "text"
                        : showConfirmPassword &&
                          field.name === "confirmPassword"
                        ? "text"
                        : "password"
                      : "text"
                  }
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="flex-grow text-zinc-500 text-base font-normal leading-tight focus:outline-none"
                />
                {field.name.includes("password") && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="flex-shrink-0 cursor-pointer text-zinc-500"
                  >
                    {(field.name === "password" && showPassword) ||
                    (field.name === "confirmPassword" &&
                      showConfirmPassword) ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                )}
              </div>
            ))}

            {activeUserType === "Artist" && isClaimableAccount && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-green-700 font-medium">We found an existing artist profile with this social handle!</p>
                <p className="text-green-600 text-sm mt-1">You can claim this account by completing the registration.</p>
              </div>
            )}
            
            <button
              type="submit"
              className="self-stretch cursor-pointer h-12 px-6 py-4 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : isClaimableAccount && activeUserType === "Artist" ? "Claim Account" : "Sign up"}
            </button>

            <div className="self-stretch text-center text-neutral-600 text-base font-medium leading-normal tracking-tight">
              - Or -
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 cursor-pointer h-12 px-6 py-4 bg-gray-100 rounded-lg flex justify-center items-center gap-2.5 text-zinc-950 text-base font-semibold font-['Inter'] leading-normal"
                onClick={() => handleSocialLogin("facebook")} // You'll need to implement a 'facebook' endpoint
              >
                <FaFacebook size={16} /> Facebook
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer h-12 px-6 py-4 bg-gray-100 rounded-lg flex justify-center items-center gap-2.5 text-zinc-950 text-base font-semibold font-['Inter'] leading-normal"
                onClick={() => handleSocialLogin("instagram")} // You'll need to implement an 'instagram' endpoint
              >
                <FaInstagram size={16} /> Instagram
              </button>
            </div>

            <div className="self-stretch text-center">
              <span className="text-neutral-600 text-base font-medium  leading-normal tracking-tight">
                Already have an account?{" "}
              </span>
              <Link href={"/login"} className="text-gray-600 cursor-pointer text-base font-medium  leading-normal tracking-tight">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-center items-center p-6 rounded-xl">
        <Image
          src={AuthImage}
          alt="auth"
          width={668}
          height={892}
          className="max-w-xl h-auto max-h-full object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default Registration;
