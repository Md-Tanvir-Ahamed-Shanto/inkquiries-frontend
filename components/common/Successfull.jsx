import React from "react";

function Successfull() {
  return (
    <div className="w-[478px] bg-white p-18 flex justify-center items-center rounded-xl">
      <div>
        <div className="flex justify-center">
          <img
            className="w-[137px]"
            src="/images/Illustration.png"
            alt="Successful"
          />
        </div>
        <div className="mt-4 mb-8">
          <h1 className="font-semibold text-xl text-center pb-[9px]">
            Payment Successfull
          </h1>
          <p className="text-neutral-600">
            You are currently on the <strong>7days</strong> plan.
          </p>
        </div>
        <div className="h-12 bg-black rounded-[20px] font-medium text-white flex justify-center items-center cursor-pointer">
          Done
        </div>
      </div>
    </div>
  );
}

export default Successfull;
