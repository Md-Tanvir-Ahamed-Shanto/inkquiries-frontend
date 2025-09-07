import React from "react";
import { FaStar } from "react-icons/fa6";

function Review() {
  return (
    <div className="flex items-center gap-[3px]">
      <div
        className="w-4 h-4 bg-no-repeat bg-center bg-contain flex items-center justify-center"
        style={{ backgroundImage: `url('/images/starbg.svg')` }}
      >
        <FaStar size={8} color="white" />
      </div>
      <div
        className="w-4 h-4 bg-no-repeat bg-center bg-contain flex items-center justify-center"
        style={{ backgroundImage: `url('/images/starbg.svg')` }}
      >
        <FaStar size={8} color="white" />
      </div><div
        className="w-4 h-4 bg-no-repeat bg-center bg-contain flex items-center justify-center"
        style={{ backgroundImage: `url('/images/starbg.svg')` }}
      >
        <FaStar size={8} color="white" />
      </div><div
        className="w-4 h-4 bg-no-repeat bg-center bg-contain flex items-center justify-center"
        style={{ backgroundImage: `url('/images/starbg.svg')` }}
      >
        <FaStar size={8} color="white" />
      </div><div
        className="w-4 h-4 bg-no-repeat bg-center bg-contain flex items-center justify-center"
        style={{ backgroundImage: `url('/images/starbghalf.svg')` }}
      >
        <FaStar size={8} color="white" />
      </div>
      <div className="font-semibold pl-[6px]">9.8</div>
    </div>
  );
}

export default Review;
