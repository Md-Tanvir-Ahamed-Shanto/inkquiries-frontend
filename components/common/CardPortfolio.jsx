import React from "react";
import Image from "next/image";
import { GoHeartFill, GoComment } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import backendUrl from "@/utils/baseUrl";
import placeHolderImage from "@/public/placeholder-image.svg";

function CardPortfolio({ title, style, placement, imageUrl, description, likesCount = 0, commentsCount = 0 }) {
  const baseUrl = backendUrl;

  return (
    <div className="w-full max-w-3xl p-3 bg-white rounded-2xl outline  outline-offset-[-1px] outline-zinc-200 flex flex-col justify-start items-start gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          {/* Image Section */}
          <div className="self-stretch h-72 rounded-xl relative overflow-hidden">
            <Image
              src={imageUrl?.[0] ? `${baseUrl}${imageUrl[0]}` : placeHolderImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Content Section */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            {/* Title */}
            <div className="self-stretch justify-start text-zinc-950 text-2xl font-semibold font-['Serotiva'] capitalize leading-7">
              {title}
            </div>
            
            {/* Style Info */}
            <div className="self-stretch inline-flex justify-start items-center gap-2.5">
              <div className="text-center justify-start">
                <span className="text-zinc-500 text-base font-normal font-['Geist'] capitalize leading-normal">Style: </span>
                <span className="text-neutral-800 text-base font-normal font-['Geist'] capitalize leading-normal">{style}</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="self-stretch justify-start text-neutral-800 text-base font-normal font-['Geist'] leading-normal">
              {description}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          {/* Divider */}
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-100" />
          
          {/* Stats Row */}
          <div className="self-stretch py-2 inline-flex justify-between items-center">
            {/* Likes */}
            <div className="w-14 flex justify-start items-center gap-1.5">
              <div className="w-6 h-6 relative">
                <GoHeartFill className="w-5 h-4 absolute left-[2px] top-[3px] text-rose-600" size={20} />
              </div>
              <div className="justify-start text-gray-800 text-sm font-medium font-['Manrope'] leading-tight tracking-tight">
                {likesCount}
              </div>
            </div>
            
            {/* Comments */}
            <div className="w-14 flex justify-start items-center gap-1.5">
              <div className="w-6 h-6 relative">
                <GoComment className="w-5 h-5 absolute left-[2px] top-[2.50px] text-gray-800" size={20} />
              </div>
              <div className="justify-start text-gray-800 text-sm font-medium font-['Manrope'] leading-tight tracking-tight">
                {commentsCount}
              </div>
            </div>
            
            {/* More Options */}
            <div className="w-6 h-6 relative overflow-hidden">
              <BsThreeDots className="w-1 h-5 absolute left-[9.75px] top-[2.25px] text-neutral-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPortfolio;