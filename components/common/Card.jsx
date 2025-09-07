import React from "react";
import { GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa6";

function Card() {
  return (
    <div className="relative w-[312px] bg-gray-100 p-2.5 pt-22 rounded-[22px] cursor-pointer">
      <div className="absolute bg-black text-white font-medium rounded-[29px] px-3 py-2 leading-[100%] tracking-0 top-[10px] right-[10px]">
        Promoted
      </div>
      <div className="relative bg-white w-full pt-16 pb-8 rounded-2xl flex flex-col gap-5 justify-center items-center">
        <img
          src="/images/profile.png"
          alt="Top Image"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-[2px] border-gray-100"
        />
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-[26px] font-semibold">Leisel Alexender</div>
          <div className="flex gap-2.5 items-center text-neutral-600">
            <p>industrial</p>
            <GoDotFill size={5} />
            <p>Mar Del Plata</p>
          </div>
        </div>
        <div className="flex gap-2.5 items-center justify-center font-medium text-2xl">
          <FaStar className="text-amber-500" />
          9.8
        </div>
      </div>
    </div>
  );
}

export default Card;
