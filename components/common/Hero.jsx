import React from "react";
import Search from "./Search";

const Hero = ({title}) => {
  return (
    <div className="w-full relative px-4 py-12 sm:px-8 md:px-16 lg:px-96 lg:py-24 rounded-2xl flex flex-col justify-end items-center gap-2.5">
      <div
        className="absolute inset-0 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
      <div className="w-full relative z-10 flex flex-col justify-start items-center gap-8 md:gap-16">
        <div className="flex flex-col justify-start items-center gap-6 md:gap-9">
          <div className="h-auto text-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Inter'] capitalize leading-tight lg:leading-[76.80px]">
            {title}
          </div>
          <div className="text-center text-white text-sm sm:text-base font-normal capitalize leading-normal tracking-tight max-w-2xl">
            Find Trusted Tattoo Artists and Read Real Reviews with Photo
            Evidence. The Journey to Your Masterpiece Begins Now.
          </div>
        </div>

        <Search />
       
      </div>
    </div>
  );
};

export default Hero;