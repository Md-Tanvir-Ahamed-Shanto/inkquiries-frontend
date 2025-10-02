import React from "react";
import Image from "next/image";
import Phone from "@/public/icon/phone.png"
import Mail from "@/public/icon/email.png"

const Footer = () => {
  return (
    <div className="w-full h-auto mt-14 lg:px-28 py-12 bg-zinc-950 rounded-xl flex flex-col justify-end items-center gap-2.5 px-6 sm:px-10 md:px-16"> 
      <div className="w-full flex flex-col justify-start items-start gap-12 sm:gap-16 lg:gap-20"> 
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-0"> 
          <div className="flex flex-col justify-start items-start gap-8 sm:gap-10 lg:gap-12"> 
            <div className="justify-start text-white text-2xl sm:text-3xl font-bold font-['Inter'] capitalize leading-10"> 
              Inkquiries
            </div>
            <div className="flex flex-col justify-start items-start gap-3 sm:gap-3.5"> 
              <div className="flex justify-start items-start gap-3 sm:gap-4"> 
                <div className="w-5 h-5 relative">
                  <Image width={100} height={100} src={Mail} alt="Phone" />
                </div>
                <div className="justify-start">
                  <span className="text-gray-200 text-sm sm:text-base font-medium capitalize leading-normal">
                    inkquiries
                  </span>
                  <span className="text-gray-200 text-sm sm:text-base font-medium lowercase leading-normal">
                    @gmail
                  </span>
                  <span className="text-gray-200 text-sm sm:text-base font-medium leading-normal">
                    .com
                  </span>
                </div>
              </div>
             
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start items-start gap-10 sm:gap-12 md:gap-16"> 
            <div className="flex flex-col justify-start items-start gap-4 sm:gap-6">
              <div className="justify-start text-white text-base sm:text-lg font-semibold font-['Inter'] capitalize leading-normal">
                company
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 sm:gap-2"> 
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  home
                </div>
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  explore
                </div>
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  pricing
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 sm:gap-6"> 
              <div className="justify-start text-white text-base sm:text-lg font-semibold font-['Inter'] capitalize leading-normal">
                Legal
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 sm:gap-2"> 
                <a href="/privacy-policy" className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal hover:underline">
                  privacy policy
                </a>
                <a href="/term-conditions" className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal hover:underline">
                  term & conditions
                </a>
                <a href="/cookies-policy" className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal hover:underline">
                  cookies policy
                </a>
                <a href="/terms-of-service" className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal hover:underline">
                  terms of service
                </a>
                <a href="/data-deletion-instructions" className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal hover:underline">
                  data deletion
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 sm:gap-6"> 
              <div className="justify-start text-white text-base sm:text-lg font-semibold font-['Inter'] capitalize leading-normal">
                follow us
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 sm:gap-2"> 
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  facebook
                </div>
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  instagram
                </div>
                <div className="justify-start text-white text-sm sm:text-base font-normal capitalize leading-normal">
                  linkedin
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-center gap-4 sm:gap-6">
         <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-zinc-400/50"></div>
          <div className="self-stretch text-center justify-start text-gray-200 text-xs sm:text-base font-normal capitalize leading-normal"> 
            © 2025 inkquiries, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;