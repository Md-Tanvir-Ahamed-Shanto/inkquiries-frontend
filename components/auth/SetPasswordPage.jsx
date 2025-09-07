"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AuthImage from "@/public/assets/authimage.png";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyResetToken, resetPassword } from "@/service/authApi";
import { toast } from "react-hot-toast";

const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get("token");
    const userType = searchParams.get("type");
    
    if (!token || !userType) {
      toast.error("Invalid password reset link");
      setIsVerifying(false);
      return;
    }
    
    setToken(token);
    setUserType(userType);
    
    const verifyToken = async () => {
      try {
        const response = await verifyResetToken(token, userType);
        setIsValid(true);
      } catch (error) {
        console.error("Error verifying token:", error);
        toast.error("This password reset link is invalid or has expired");
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [searchParams]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await resetPassword({
        token,
        password,
        userType
      });
      
      toast.success("Password has been reset successfully");
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
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
    { label: "New Password", name: "password" },
    { label: "Confirm New Password", name: "confirmPassword" },
  ];

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-neutral-800 text-xl font-bold mb-4">Verifying your reset link...</h2>
          <div className="animate-pulse bg-gray-200 h-2 w-full rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!isValid) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-neutral-800 text-xl font-bold mb-4">Invalid or Expired Link</h2>
          <p className="text-neutral-600 mb-6">This password reset link is invalid or has expired.</p>
          <a 
            href="/forgot-password"
            className="inline-block px-6 py-3 bg-zinc-950 rounded-lg text-white text-base font-semibold"
          >
            Request a new link
          </a>
        </div>
      </div>
    );
  }
  
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
              disabled={isLoading || !isValid}
              className={`self-stretch h-12 px-6 py-4 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal ${(isLoading || !isValid) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Setting password..." : "Set new password"}
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
