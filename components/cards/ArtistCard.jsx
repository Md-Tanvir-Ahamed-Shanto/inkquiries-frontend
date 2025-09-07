import React from "react";
import Star from "@/public/icon/star.png"
import Image from "next/image";
import Link from "next/link";

const ArtistCard = ({ artist }) => {
  return (
    <div className="px-2.5 pt-20 pb-2.5 relative bg-gray-100 rounded-3xl flex flex-col justify-start items-start">
      <div className="self-stretch relative flex flex-col justify-start items-center">
        <div className="self-stretch pt-16 pb-8 bg-white rounded-2xl flex flex-col justify-start items-center gap-12">
          <div className="self-stretch flex flex-col justify-start items-center gap-5">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
              <div className="self-stretch text-center text-zinc-950 text-2xl font-semibold font-['Inter'] capitalize leading-loose">
               <Link className="hover:text-gray-500" href={`/artist/profile/${artist.id}`}>
               {artist.name}
               </Link>
              </div>
              <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <div className="text-center text-neutral-600 text-base font-normal capitalize leading-normal">
                  {artist.genre}
                </div>
                <div className="w-[5px] h-[5px] bg-zinc-500 rounded-full" />
                <div className="text-center text-neutral-600 text-base font-normal capitalize leading-normal">
                  {artist.location || "Unknown"}
                </div>
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-2.5">
              <div className="w-6 h-6 relative">
                <Image src={Star} alt="star" className="w-5 h-5 left-[2px] top-[2px] absolute " />
              </div>
              <div className="text-zinc-950 text-2xl font-medium capitalize leading-9">
                {artist.rating ? parseFloat(artist.rating).toFixed(1) : "0.0"}
              </div>
            </div>
          </div>
        </div>
        <img
          className="w-20 h-20 absolute top-[-40px] rounded-full border-2 border-gray-100"
          src={artist.image}
          alt={artist.name}
        />
      </div>
      {artist.promoted && (
        <div className="px-3 py-0.5 absolute top-[10px] right-[10px] bg-zinc-950 rounded-[29px] inline-flex justify-center items-center gap-2.5">
          <div className="text-center text-white text-base font-medium capitalize leading-normal">
            promoted
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;
