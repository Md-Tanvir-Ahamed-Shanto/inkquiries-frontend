import React, { useState, useEffect } from "react";

function EditAboutUs({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    about: initialData?.about || "",
    personalVibe: initialData?.personalVibe || {}
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-[908px] p-4 sm:p-6 bg-white rounded-2xl flex flex-col gap-4">
      <h1 className="font-bold text-xl sm:text-2xl">Edit About Us</h1>
      <textarea
        className="h-[250px] sm:h-[360px] w-full resize-none border border-zinc-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
        placeholder="Write something about you..."
        name="about"
        id="about"
        value={formData.about}
        onChange={handleChange}
      ></textarea>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
        <button 
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 text-center cursor-pointer hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black font-medium text-white text-center cursor-pointer hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditAboutUs;
