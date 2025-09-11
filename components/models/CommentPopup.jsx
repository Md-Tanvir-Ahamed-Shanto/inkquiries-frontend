import React from 'react';
import Image from 'next/image';
import { formatTimeAgo } from '@/utils/formatedTime';
import backendUrl from '@/utils/baseUrl';
import { getCurrentUser } from '@/service/authApi';

const CommentPopup = ({ comments, onClose, onAddComment }) => {

  const user = getCurrentUser();
  return (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4" suppressHydrationWarning>
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200" suppressHydrationWarning>
        <h3 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>Comments</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
          suppressHydrationWarning
        >
          ×
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 max-h-96" suppressHydrationWarning>
        {comments.fetchingComments ? (
          <div className="flex justify-center py-8" suppressHydrationWarning>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" suppressHydrationWarning></div>
          </div>
        ) : comments.error ? (
          <p className="text-red-500 text-center py-8" suppressHydrationWarning>{comments.error}</p>
        ) : comments.commentsList.length === 0 ? (
          <p className="text-gray-500 text-center py-8" suppressHydrationWarning>No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4" suppressHydrationWarning>
            {comments.commentsList.map((comment) => (
              <div key={comment.id} className="flex gap-3" suppressHydrationWarning>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 relative overflow-hidden" suppressHydrationWarning>
                  {comment.authorImage ? (
                    <Image
                      src={`${backendUrl}${comment?.authorImage}`}
                      alt={comment.author}
                      fill
                      className="object-contain"
                      suppressHydrationWarning
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium" suppressHydrationWarning>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={`flex-1 ${comment.isOptimistic ? 'opacity-70' : ''}`} suppressHydrationWarning>
                  <div className="flex items-center gap-2 mb-1" suppressHydrationWarning>
                    <span className="font-medium text-sm text-gray-900" suppressHydrationWarning>
                      {comment.author === user?.name || comment.author === user?.username ? "Your": comment.author }
                    </span>
                    <span className="text-xs text-gray-500" suppressHydrationWarning>{formatTimeAgo(comment.timestamp)}</span>
                    
                  </div>
                  <p className="text-sm text-gray-700" suppressHydrationWarning>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 p-4" suppressHydrationWarning>
        <div className="flex gap-3" suppressHydrationWarning>
          <div className=" rounded-full flex-shrink-0" suppressHydrationWarning>
            {user?.profilePhoto ? (
              <Image
                src={`${backendUrl}${user?.profilePhoto}`}
                alt={user?.name}
                width={40}
                height={40}
                className="object-contain w-8 h-8 rounded-full"
                suppressHydrationWarning
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium" suppressHydrationWarning>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1" suppressHydrationWarning>
            <textarea
              value={comments.commentText}
              onChange={(e) => comments.setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              rows="2"
              suppressHydrationWarning
            />
            <div className="flex justify-end mt-2" suppressHydrationWarning>
              <button
                onClick={onAddComment}
                disabled={!comments.commentText.trim() || comments.loading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                suppressHydrationWarning
              >
                {comments.loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" suppressHydrationWarning></div>
                )}
                {comments.loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default CommentPopup;