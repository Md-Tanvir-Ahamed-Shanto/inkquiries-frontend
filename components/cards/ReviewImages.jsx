import backendUrl from "@/utils/baseUrl";

const ReviewImages = ({ images }) => {
  if (!images || images.length === 0) return null;
  
  const baseUrl = backendUrl
  
  const renderImages = () => {
    const imageCount = images.length;
    
    if (imageCount === 1) {
      return (
        <div className="w-full" suppressHydrationWarning>
          <img
            src={`${baseUrl}${images[0]}`}
            alt="Review image"
            className="w-full h-64 object-contain rounded-xl hover:scale-105 transition-transform duration-200"
            suppressHydrationWarning
          />
        </div>
      );
    }
    
    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden" suppressHydrationWarning>
          {images.map((image, index) => (
            <img
              key={index}
              src={`${baseUrl}${image}`}
              alt={`Review image ${index + 1}`}
              className="w-full h-48 object-contain hover:scale-105 transition-transform duration-200"
              suppressHydrationWarning
            />
          ))}
        </div>
      );
    }
    
    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden" suppressHydrationWarning>
          <div className="row-span-2" suppressHydrationWarning>
            <img
              src={`${baseUrl}${images[0]}`}
              alt="Review image 1"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
              style={{ minHeight: '200px' }}
              suppressHydrationWarning
            />
          </div>
          <div className="grid grid-rows-2 gap-1" suppressHydrationWarning>
            <img
              src={`${baseUrl}${images[1]}`}
              alt="Review image 2"
              className="w-full h-24 object-contain hover:scale-105 transition-transform duration-200"
              suppressHydrationWarning
            />
            <img
              src={`${baseUrl}${images[2]}`}
              alt="Review image 3"
              className="w-full h-24 object-contain hover:scale-105 transition-transform duration-200"
              suppressHydrationWarning
            />
          </div>
        </div>
      );
    }
    
    // 4 or more images
    return (
      <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden" suppressHydrationWarning>
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="relative" suppressHydrationWarning>
            <img
              src={`${baseUrl}${image}`}
              alt={`Review image ${index + 1}`}
              className="w-full h-32 object-contain hover:scale-105 transition-transform duration-200"
              suppressHydrationWarning
            />
            {imageCount > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" suppressHydrationWarning>
                <span className="text-white text-lg font-semibold" suppressHydrationWarning>
                  +{imageCount - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return renderImages();
};

export default ReviewImages;