import React from "react";

function RestrictedReasonsModal({ onCancel, onReview }) {
  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-8 sm:gap-10 lg:gap-12 w-full max-w-lg mx-auto">
      <div className="flex flex-col justify-start items-center gap-3 sm:gap-4 w-full">
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 bg-rose-50 rounded-[99px] outline-[3px] outline-rose-50/50 inline-flex justify-center items-center gap-2 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 relative" />
        </div>
        
        <div className="self-stretch flex flex-col justify-start items-center gap-6 sm:gap-8">
          <div className="flex flex-col justify-start items-start gap-4 sm:gap-6 w-full">
            {/* Title */}
            <div className="self-stretch text-center justify-start text-neutral-800 text-xl sm:text-2xl font-semibold">
              Possible Restricted Reasons:
            </div>
            
            {/* Textarea Section */}
            <div className="flex flex-col justify-start items-start gap-2 sm:gap-3 w-full">
              <div className="w-full justify-start text-zinc-500 text-sm sm:text-base font-normal leading-normal">
                Write the review Restricted reasons
              </div>
              <div className="h-24 sm:h-28 p-3 sm:p-4 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-start gap-2.5 w-full">
                <textarea
                  className="w-full justify-start text-neutral-800 text-sm sm:text-base font-normal leading-normal bg-transparent border-none outline-none resize-none"
                  placeholder="Their review violated our community guideline, so the reason we restricted the review"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="self-stretch flex flex-col sm:inline-flex sm:flex-row justify-start items-start gap-3 sm:gap-4">
            <button
              onClick={onCancel}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg outline-1 outline-offset-[-1px] outline-zinc-200 flex justify-center items-center gap-2 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <div className="justify-start text-neutral-800 text-sm sm:text-base font-medium leading-normal">
                Cancel
              </div>
            </button>
            <button
              onClick={onReview}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 rounded-lg flex justify-center items-center gap-2 hover:bg-red-600 transition-colors cursor-pointer"
            >
              <div className="justify-start text-white text-sm sm:text-base font-medium leading-normal">
                Review Restricted
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestrictedReasonsModal;