import React from "react";

function DeleteUserModal({ onClose, onConfirm }) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Icon */}
      <div className="w-12 h-12 bg-rose-50 rounded-full outline-[3px] outline-rose-50/50 flex items-center justify-center">
        {/* Replace with actual delete/trash icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
          />
        </svg>
      </div>

      {/* Title & Description */}
      <div className="flex flex-col items-center gap-4 text-center px-2">
        <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
          Delete this user?
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
          Deleting this user will <strong>permanently remove their account</strong>.
          They won’t be able to log in or access any services again.
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
          Confirm Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteUserModal;
