import React from "react";

function AdminAnalytics({
  title,
  value,
  bgColor,
  icon,
  growthRate,
  growthRateIcon,
}) {
  return (
    <div className="w-full p-3 sm:p-4 bg-white rounded-lg flex flex-col justify-start items-start gap-3 sm:gap-5">
      <div className="self-stretch flex justify-start items-start gap-3 sm:gap-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100/50 rounded-lg flex justify-center items-center gap-2.5">
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center">
            <img src={icon} alt="User Icon" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 sm:gap-2">
          <div className="self-stretch justify-start text-neutral-600 text-xs sm:text-sm font-medium font-['Inter']">
            {title}
          </div>
          <div className="self-stretch justify-start text-neutral-800 text-xl sm:text-2xl font-semibold font-['Inter'] leading-normal">
            {value}
          </div>
        </div>
      </div>
      <div className="self-stretch flex justify-start items-center gap-1 sm:gap-2">
        <img src={growthRateIcon} className="w-3 sm:w-4" />
        <div className="justify-start text-green-600 text-sm sm:text-base font-medium leading-normal">
          {growthRate}
        </div>
        <div className="justify-start text-zinc-500 text-sm sm:text-base font-normal leading-normal">
          from last week
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
