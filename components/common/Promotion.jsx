import React from "react";

function Promotion() {
  return (
    <div className="bg-white p-6 rounded-2xl">
      <h1 className="font-semibold text-2xl">Profile Information</h1>
      <p className="font-medium text-neutral-600 mb-4 mt-8">Select Duration</p>
      <div className="flex flex-col gap-3">
        <div className="w-[430px] h-14 pl-3 pr-2 py-1.5 bg-black rounded-xl text-white font-medium flex justify-center items-center cursor-pointer">
          7 days - $50
        </div>
        <div className="w-[430px] h-14 pl-3 pr-2 py-1.5 bg-black rounded-xl text-white font-medium flex justify-center items-center cursor-pointer">
          7 days - $50
        </div>
        <div className="w-[430px] h-14 pl-3 pr-2 py-1.5 bg-black rounded-xl text-white font-medium flex justify-center items-center cursor-pointer">
          7 days - $50
        </div>
      </div>
      <div className="w-[430px] h-14 mt-8 pl-3 pr-2 py-1.5 rounded-xl  font-medium flex justify-center items-center cursor-pointer">
        Cancel
      </div>
    </div>
  );
}

export default Promotion;
