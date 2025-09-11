import React from 'react'

const ImageGallery = ({ post }) => {
  if (post.image_urls) {
    return (
      <img
        className="w-full h-56 rounded-xl object-contain mb-6"
        src={post.image_urls[0]}
        alt="Tattoo work"
        suppressHydrationWarning
      />
    );
  }

  if (post.image_urls) {
    if (post.image_urls.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <img
            className="w-full h-56 rounded-xl object-contain"
            src={post.image_urls[0]}
            alt="Tattoo work 1"
            suppressHydrationWarning
          />
          <img
            className="w-full h-56 rounded-xl object-contain"
            src={post.image_urls[1]}
            alt="Tattoo work 2"
            suppressHydrationWarning
          />
        </div>
      );
    } else if (post.image_urls.length === 3) {
      return (
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="grid grid-cols-2 gap-2.5">
            <img
              className="w-full h-48 rounded-xl object-contain"
              src={post.image_urls[0]}
              alt="Tattoo work 1"
              suppressHydrationWarning
            />
            <img
              className="w-full h-48 rounded-xl object-contain"
              src={post.image_urls[1]}
              alt="Tattoo work 2"
              suppressHydrationWarning
            />
          </div>
          <img
            className="w-full h-40 rounded-xl object-contain"
            src={post.image_urls[2]}
            alt="Tattoo work 3"
            suppressHydrationWarning
          />
        </div>
      );
    }
  }
  return null;
};

export default ImageGallery