const { default: Image } = require("next/image");
import startTattoo from "@/public/icon/starTattoo.png";


const StarRating = ({ rating = 0, showNumber = true }) => {
  const ratingValue = rating ? (rating / 2) : 0;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-4 h-4 relative">
            {index < ratingValue ? (
              <Image
                src={startTattoo}
                width={16}
                height={16}
                className="w-4 h-4"
                alt="Filled Star"
                style={{ 
                  filter: 'brightness(1.2) sepia(1) hue-rotate(-10deg) saturate(3) contrast(1.2)' 
                }}
              />
            ) : (
              <Image
                src={startTattoo}
                width={16}
                height={16}
                className="w-4 h-4"
                alt="Empty Star"
                style={{ 
                  opacity: 0.2, 
                  filter: 'grayscale(100%)' 
                }}
              />
            )}
          </div>
        ))}
      </div>
      {showNumber && rating !== undefined && rating !== null && (
        <span className="text-gray-900 text-sm font-medium">
          {parseFloat(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating