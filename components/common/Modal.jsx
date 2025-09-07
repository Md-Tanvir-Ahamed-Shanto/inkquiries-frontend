"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      {/* The fix is applied to this container */}
      <div
        ref={modalRef}
        className="bg-white shadow-xl rounded-xl z-50 w-full max-w-lg max-h-full overflow-y-auto"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}