import React, { useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { addPortfolioItem } from "@/service/portfolioApi";
import { toast } from "react-hot-toast";

function CreatePortfolio({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    tattooStyle: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview the selected files
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.tattooStyle || photos.length === 0) {
      setError("Please fill in all required fields and upload at least one photo");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const portfolioFormData = new FormData();
      portfolioFormData.append("title", formData.title);
      portfolioFormData.append("style", formData.tattooStyle);
      portfolioFormData.append("description", formData.description);
      
      // Append all photos
      photos.forEach((photo, index) => {
        portfolioFormData.append("portfolioImages", photo.file);
      });
      
      const response = await addPortfolioItem(portfolioFormData);
      
      toast.success("Portfolio item created successfully!");
      if (onSuccess) onSuccess(response);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Failed to create portfolio item");
      toast.error(err.message || "Failed to create portfolio item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 bg-white rounded-2xl">
      <h1 className="font-bold text-xl sm:text-2xl">Create Portfolio</h1>
      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 mt-4">
        {/* Title Input */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full h-12 p-3 border border-gray-100 rounded-xl font-medium text-neutral-600 placeholder:text-zinc-400 focus:outline-none focus:border-black"
          required
        />

        {/* Tattoo Style Input */}
        <input
          type="text"
          name="tattooStyle"
          value={formData.tattooStyle}
          onChange={handleInputChange}
          placeholder="Tattoo Style"
          className="w-full h-12 p-3 border border-gray-100 rounded-xl font-medium text-neutral-600 placeholder:text-zinc-400 focus:outline-none focus:border-black"
          required
        />

        {/* Description Textarea */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Portfolio Description"
          className="w-full h-44 p-3 border border-gray-100 rounded-xl font-medium text-neutral-600 placeholder:text-zinc-400 resize-none focus:outline-none focus:border-black"
        />

        {/* Upload Photo Button */}
        <label className="h-24 w-full flex flex-col gap-2.5 items-center justify-center border-2 border-dashed border-gray-100 rounded-[12px] text-black cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handlePhotoUpload} 
            className="hidden" 
          />
          <MdOutlineAddPhotoAlternate size={24} />
          <p className="font-medium text-zinc-400 text-sm">Upload Photo</p>
        </label>

        {/* Image Previews */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3 w-full">
            {photos.map((photo, index) => (
              <div key={index} className="w-24 h-24 rounded-lg overflow-hidden relative">
                <img
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer"
                  aria-label="Remove"
                >
                  <span className="text-[15px] leading-none font-bold">×</span>
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-100 flex flex-col gap-2.5 items-center justify-center text-black font-semibold cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
                <MdOutlineAddPhotoAlternate size={24} />
                <p className="font-medium text-zinc-400 text-sm">Add more</p>
              </label>
            )}
          </div>
        )}

        {/* Post Button */}
        <button 
          type="submit"
          disabled={loading || !formData.title || !formData.tattooStyle || photos.length === 0}
          className={`h-12 rounded-xl font-medium flex justify-center items-center cursor-pointer ${loading || !formData.title || !formData.tattooStyle || photos.length === 0 ? 'bg-gray-100 text-neutral-300' : 'bg-black text-white'}`}
        >
          {loading ? "Creating..." : "Create Portfolio"}
        </button>
      </form>
    </div>
  );
}

export default CreatePortfolio;