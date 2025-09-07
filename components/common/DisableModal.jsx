import React from "react";

function DisableModal({ onClose, onDisable }) {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-rose-50 ring-4 ring-rose-50/50 flex justify-center items-center">
          <img src="/images/alert-diamond.svg" alt="danger" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-xl">
            Disable Account
          </div>
          <div className="text-sm text-neutral-600">
            Disabling your account is temporary. You can reactivate it anytime.
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
          onClick={() => onDisable && onDisable()}
          className="bg-black text-white rounded-xl px-6 py-3 w-full font-medium cursor-pointer"
        >
          Yes, Disable
        </button>
      </div>
    </div>
  );
}

export default DisableModal;