import React from "react";

function ActivateUserModal({ onClose, onConfirm }) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Icon */}
      <div className="w-12 h-12 bg-green-50 rounded-full outline-[3px] outline-green-50/50 flex items-center justify-center">
        {/* Replace with your activation/restore icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-green-500"
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

      {/* Title & Description */}
      <div className="flex flex-col items-center gap-4 text-center px-2">
        <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
          Activate this user?
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
          Activating this user will restore their account access, allowing them
          to log in and use the services again.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <button
          className="flex-1 px-6 py-3 rounded-lg border border-zinc-200 text-neutral-800 text-base font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="flex-1 px-6 py-3 bg-green-500 rounded-lg text-white text-base font-medium hover:bg-green-600 transition-colors cursor-pointer"
          onClick={onConfirm}
        >
          Confirm Activation
        </button>
      </div>
    </div>
  );
}

export default ActivateUserModal;
