import React from "react";
import { GoComment } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoHeartFill } from "react-icons/go";

function PostActionBar({ borderBottom = true }) {
  return (
    <div
      className={`flex justify-between items-center py-3 border-y border-zinc-200 ${
        borderBottom ? "" : "border-b-0"
      } `}
    >
      <div className="flex items-center gap-1.5">
        <GoHeartFill className="text-rose-600" size={24} /> 0
      </div>
      <div className="flex items-center gap-1.5">
        <GoComment className="text-gray-800" size={24} /> 0
      </div>
      <div className="flex items-center gap-1.5">
        <BsThreeDotsVertical className="text-neutral-600" size={24} />
      </div>
    </div>
  );
}

export default PostActionBar;
