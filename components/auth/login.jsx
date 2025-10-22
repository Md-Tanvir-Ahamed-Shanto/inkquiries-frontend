"use client";
import React, { useState } from "react";
import Image from "next/image";
import AuthImage from "@/public/assets/authimage.png";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../service/authApi"; 
import { toast } from "sonner";
import { FaFacebook } from "react-icons/fa6";
// import { setCookie } from "cookies-next";
// import { getCookie } from "cookies-next";



const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      return setError("Email and password are required.");
    }

    setIsLoading(true);

    try {
      const res = await loginUser(formData);  
      // localStorage storage is already handled in loginUser function
      const userData = res.user || res.artist || res.client;
      if(userData.role === "artist"){
        router.push("/artist/dashboard");
      } else if(userData.role === "admin"){
        router.push("/admin");
      } else {
        router.push("/");
      }
      toast.success("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [activeUserType, setActiveUserType] = useState("Client");

  const handleSocialLogin = (provider) => {
    // Redirect to OAuth provider with role parameter
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const role = activeUserType.toLowerCase();
    window.location.href = `${backendUrl}/auth/${provider}?role=${role}`;
  };

  const formFields = [
    { label: "Enter Email", name: "email", icon: <Mail size={16} /> },
    { label: "Password", name: "password", icon: <Lock size={16} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full items-center md:px-24 justify-center min-h-screen bg-white overflow-hidden">
      {/* Login Form Section */}
      <div className=" flex flex-col w-full items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-3xl">
          <div className="mb-8 md:mb-12">
            <h1 className="text-neutral-800 text-3xl md:text-4xl font-bold font-['Inter'] leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-800 text-base font-normal leading-normal tracking-tight">
              We're excited to see you again! Please log in to continue.
            </p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           
            {formFields.map((field) => (
              <div
                key={field.name}
                className="self-stretch h-14 p-3.5 bg-white rounded-lg  outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5"
              >
                <div className="w-4 h-4 relative flex items-center justify-center text-gray-950">
                  {field.icon}
                </div>
                <input
                  type={
                    field.name === "password" && showPassword
                      ? "text"
                      : field.name === "password"
                      ? "password"
                      : "text"
                  }
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="flex-grow text-zinc-500 text-base font-normal leading-tight focus:outline-none"
                />
                {field.name === "password" && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="flex-shrink-0 text-zinc-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            ))}

            <div className="self-stretch text-right mb-4">
              <span className="text-gray-600 text-base font-medium  leading-normal tracking-tight cursor-pointer">
                <Link href={"/forgot-password"}>Forgot password?</Link>
              </span>
            </div>

            <button
              type="submit"
              className="self-stretch cursor-pointer h-12 px-6 py-4 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="self-stretch text-center text-neutral-600 text-base font-medium leading-normal tracking-tight">
              - Or -
            </div>

            {/* User Type Selector for Social Login */}
            {/* <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 h-10 px-4 py-2 rounded-lg border transition-colors ${
                    activeUserType === "Client"
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-950 border-zinc-200 hover:border-zinc-300"
                  }`}
                  onClick={() => setActiveUserType("Client")}
                >
                  Client
                </button>
                <button
                  type="button"
                  className={`flex-1 h-10 px-4 py-2 rounded-lg border transition-colors ${
                    activeUserType === "Artist"
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-950 border-zinc-200 hover:border-zinc-300"
                  }`}
                  onClick={() => setActiveUserType("Artist")}
                >
                  Artist
                </button>
              </div>
            </div> */}

            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="w-full cursor-pointer h-12 px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg flex justify-center items-center gap-2.5 text-white text-base font-semibold font-['Inter'] leading-normal transition-colors"
                onClick={() => handleSocialLogin("facebook")}
              >
                <FaFacebook size={16} /> Continue with Facebook
              </button>
              <p className="text-sm text-gray-500 text-center">
                Instagram login is temporarily unavailable due to platform changes.
              </p>
            </div>

            <div className="self-stretch text-center">
              <span className="text-neutral-600 text-base font-medium  leading-normal tracking-tight">
                Don't have an account?{" "}
              </span>
              <span className="text-gray-600 text-base font-medium  leading-normal tracking-tight cursor-pointer">
                <Link href={"/signup"}>Sign up</Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-full justify-center items-center p-6 rounded-xl">
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

export default LoginPage;