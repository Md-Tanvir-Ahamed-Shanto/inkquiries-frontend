import React from "react";

function DeleteModal({ onClose, onDelete, title = "Delete Item", message = "This action is permanent and cannot be undone." }) {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-rose-50 ring-4 ring-rose-50/50 flex justify-center items-center">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-xl">
            {title}
          </div>
          <div className="text-sm text-neutral-600">
            {message}
          </div>
        </div>
      </div>
      <div className="w-full mt-8 flex flex-col-reverse sm:flex-row gap-3">
        <button
          onClick={() => onClose()}
          className="bg-slate-50 text-zinc-500 rounded-xl px-6 py-3 w-full font-medium cursor-pointer"
        >
          Cancel
        </button>
        <button 
          onClick={() => onDelete && onDelete()}
          className="bg-red-500 text-white rounded-xl px-6 py-3 w-full font-medium cursor-pointer"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;