import React from "react";

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Icon */}
      <div className="w-12 h-12 bg-orange-50 rounded-full outline-[3px] outline-orange-50/50 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </div>

      {/* Title & Description */}
      <div className="flex flex-col items-center gap-4 text-center px-2">
        <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
          Log out of your account?
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
          You will be signed out of your account and redirected to the login page.
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
          className="flex-1 px-6 py-3 bg-red-500 rounded-lg text-white text-base font-medium hover:bg-red-600 transition-colors cursor-pointer"
          onClick={onConfirm}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default LogoutModal;