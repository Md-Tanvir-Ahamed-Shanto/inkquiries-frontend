import StarRating from "../common/StarRating";

const ReviewContent = ({ review }) => {
  const displayContent = review?.post_content?.review_text || review?.content || "";
  
  return (
    <div className="space-y-3">
      {displayContent && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {displayContent}
        </p>
      )}
      {review?.overallExperience && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Overall Experience:</span>
            <StarRating rating={review.overallExperience} />
          </div>
          
          {/* Display detailed ratings if available */}
          {(review.bedsideManner || review.accommodation || review.price || 
            review.heavyHandedness || review.artworkQuality || review.tattooQuality) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              {review.bedsideManner && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Bedside Manner:</span>
                  <StarRating rating={review.bedsideManner} showNumber={false} />
                </div>
              )}
              {review.accommodation && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Accommodation:</span>
                  <StarRating rating={review.accommodation} showNumber={false} />
                </div>
              )}
              {review.price && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Price:</span>
                  <StarRating rating={review.price} showNumber={false} />
                </div>
              )}
              {review.heavyHandedness && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Heavy Handedness:</span>
                  <StarRating rating={review.heavyHandedness} showNumber={false} />
                </div>
              )}
              {review.artworkQuality && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Artwork Quality:</span>
                  <StarRating rating={review.artworkQuality} showNumber={false} />
                </div>
              )}
              {review.tattooQuality && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Tattoo Quality:</span>
                  <StarRating rating={review.tattooQuality} showNumber={false} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewContent;