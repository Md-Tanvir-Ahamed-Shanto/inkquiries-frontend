import React from "react";

const TattoCard = ({ tatto }) => {
  return (
    <div className="w-full relative rounded-lg overflow-hidden max-w-sm mx-auto">
      {/* Blurred background */}
      <img
        src={tatto.imageUrl}
        alt={tatto.title}
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
      />

      {/* Main image */}
      <img
        className="relative w-96 h-[30rem] object-contain rounded-lg z-10"
        src={tatto.imageUrl}
        alt={tatto.title}
      />

      {/* Title overlay */}
      <div className="w-96 h-20 p-8 absolute bottom-0 bg-gradient-to-b from-black/0 to-black/60 rounded-bl-lg rounded-br-lg backdrop-blur-[1.2px] flex justify-start items-end gap-2.5 z-20">
        <div className="text-center text-white text-xl sm:text-2xl font-semibold font-['Inter'] capitalize leading-7">
          {tatto.title}
        </div>
      </div>
    </div>
  );
};

export default TattoCard