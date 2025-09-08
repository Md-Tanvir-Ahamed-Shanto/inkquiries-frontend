import { formatTimeAgo } from "@/utils/formatedTime";
import Link from "next/link";

const UserHeader = ({ userInfo, review }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.inkquiries.org";
  const user = userInfo || review?.client;
  const profilePicture = user?.profilePhoto ? `${baseUrl}${user.profilePhoto}` : null;
  const name = user?.name || "Anonymous";
  const id = user?.id;
  const timeAgo = formatTimeAgo(review?.createdAt);
  
  
  return (
    <div className="flex items-center justify-between mb-4" suppressHydrationWarning>
      <div className="flex items-center gap-3" suppressHydrationWarning>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200" suppressHydrationWarning>
          {profilePicture ? (
            <img
              className="w-full h-full object-cover"
              src={profilePicture}
              alt={name}
              suppressHydrationWarning
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center" suppressHydrationWarning>
              <span className="text-gray-500 text-sm font-medium" suppressHydrationWarning>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col" suppressHydrationWarning>
          <Link 
            href={`/client/profile/${id}`}
            className="text-gray-900 text-sm font-semibold hover:text-gray-600 transition-colors"
            suppressHydrationWarning
          >
            {name}
          </Link>
          <div className="text-gray-500 text-xs" suppressHydrationWarning>
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader