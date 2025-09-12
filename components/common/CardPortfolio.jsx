import React from "react";
import Image from "next/image";
import { GoHeartFill, GoComment } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import backendUrl from "@/utils/baseUrl";
import heartIcon from "@/public/icon/heart.png";
import commentIcon from "@/public/icon/comment.png";
import placeHolderImage from "@/public/placeholder-image.svg";

function CardPortfolio({ title, style, placement, imageUrl, description, likesCount = 0, commentsCount = 0, isOwner = false, onDelete }) {
  const baseUrl = backendUrl;

  return (
    <div className="w-full max-w-3xl p-3 bg-white rounded-2xl outline outline-offset-[-1px] outline-zinc-200 flex flex-col justify-start items-start gap-4 relative">
      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          {/* Image Section */}
          <div className="self-stretch h-72 rounded-xl relative overflow-hidden">
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete();
                }}
                className="absolute top-2 right-2 cursor-pointer p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200 z-10"
                aria-label="Delete portfolio item"
              >
                <FiTrash2 className="text-white" size={16} />
              </button>
            )}
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
            <div className="self-stretch justify-start text-zinc-950 text-2xl font-semibold  capitalize leading-7">
              {title}
            </div>
            
            {/* Style Info */}
            <div className="self-stretch inline-flex justify-start items-center gap-2.5">
              <div className="text-center justify-start">
                <span className="text-zinc-500 text-base font-normal  capitalize leading-normal">Style: </span>
                <span className="text-neutral-800 text-base font-normal  capitalize leading-normal">{style}</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="self-stretch justify-start text-neutral-800 text-base font-normal  leading-normal">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPortfolio;