import React, { useState } from "react";

function RestrictUserModal({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("For 3 months");

  const options = [
    "For 1 week",
    "For 1 month",
    "For 3 months",
    "For 6 months",
    "Permanently",
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
      {/* Icon */}
      <div className="w-12 h-12 bg-rose-50 rounded-full outline-[3px] outline-rose-50/50 flex items-center justify-center">
        <div className="w-6 h-6 relative">{/* Put your SVG icon here */}</div>
      </div>

      {/* Title & Description */}
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
          Restrict this user?
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
          Restricting the user will temporarily disable their account. They
          won’t be able to log in or access any services.
        </p>
      </div>

      {/* Duration Selector */}
      <div className="w-full relative">
        <div
          className="h-12 px-4 py-3 rounded-lg border border-zinc-200 flex justify-between items-center cursor-pointer hover:bg-zinc-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-zinc-500 text-sm font-normal leading-tight">
            {selected}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
            {options.map((option) => (
              <div
                key={option}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-zinc-50 transition-colors ${
                  option === selected
                    ? "bg-zinc-50 text-neutral-800"
                    : "text-zinc-500"
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
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
          onClick={() => console.log("Confirm clicked")}
        >
          Confirm Restriction
        </button>
      </div>
    </div>
  );
}

export default RestrictUserModal;
