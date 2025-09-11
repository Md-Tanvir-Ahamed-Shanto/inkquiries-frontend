import React, { useRef, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

function UploadPhoto({ onUpload, onClose }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        await onUpload(selectedFile);
        onClose();
      } catch (error) {
        console.error("Error uploading photo:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="w-full max-w-[696px] p-4 sm:p-6 bg-white rounded-2xl flex flex-col gap-4 sm:gap-6">
      <h1 className="font-bold text-xl sm:text-2xl">Upload Photo</h1>
      <div
        className="h-[200px] sm:h-[265px] w-full flex flex-col gap-2.5 items-center justify-center border-2 border-dashed border-zinc-400 rounded-[12px] text-zinc-600 cursor-pointer relative overflow-hidden"
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-contain rounded-[12px]"
          />
        ) : (
          <>
            <MdOutlineAddPhotoAlternate size={24} />
            <p className="font-medium text-zinc-400">Upload Photo</p>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 text-center cursor-pointer hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black text-white font-medium flex justify-center items-center cursor-pointer hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>
    </div>
  );
}

export default UploadPhoto;
