import React from "react";

function ActivationSuccessModal({ onClose }) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Title & Message */}
      <div className="flex flex-col items-center gap-4 text-center px-2">
        <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
          User Activated Successfully
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
          The user's account has been successfully activated. They can now log
          in and access the services.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-6 py-3 bg-green-500 rounded-lg text-white text-base font-medium hover:bg-green-600 transition-colors cursor-pointer"
      >
        Okay
      </button>
    </div>
  );
}

export default ActivationSuccessModal;
