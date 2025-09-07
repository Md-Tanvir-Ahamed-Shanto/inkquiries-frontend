import Link from "next/link";
import StarRating from "../common/StarRating";

const ArtistInfo = ({ postContent, artist }) => {
  const artistName = artist?.name || postContent?.artist?.name || "Unknown Artist";
  const rating = postContent?.rating || postContent?.overallExperience || 0;
  const tattooStyle = postContent?.tattooStyle || "Unknown Style";
  const location = postContent?.location || "Unknown Location";
  const price = postContent?.price;
  const content = postContent?.content;
  
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-gray-900 text-lg font-semibold">
          <Link 
            href={`/artist/profile/${artist?.id}`}
            className="hover:text-gray-600"
          >
            {artistName}
          </Link>
        </h3>
        <StarRating rating={rating} />
        <div className="flex items-center text-gray-600 text-sm space-x-2">
          <span>{tattooStyle}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{location}</span>
        </div>
      </div>
      {content && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );
};

export default ArtistInfo;
