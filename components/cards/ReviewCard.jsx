"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import heartIcon from "@/public/icon/heart.png";
import commentIcon from "@/public/icon/comment.png";
import shareIcon from "@/public/icon/share.png";
import CommentPopup from "../models/CommentPopup";
import ReportReviewModal from "../models/ReportReviewModal";
import ImageGallery from "../common/ImageGallery";
import { addReviewComment, getAllCommentByReviewId, likeReview, unLikeReview, checkUserLikeStatus } from "@/service/reviewApi";
import { getCurrentUser } from "@/service/authApi";
import ArtistInfo from "./ArtistInfo";
import UserHeader from "./UserHeader";
import ReviewImages from "./ReviewImages";
import ReviewContent from "./ReviewContent";
import Link from "next/link";

// Error Display Component
const ErrorDisplay = ({ error, onRetry, className = "" }) => {
  if (!error) return null;
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`} suppressHydrationWarning>
      <div className="flex items-center justify-between" suppressHydrationWarning>
        <div className="flex items-center gap-2" suppressHydrationWarning>
          <div className="w-4 h-4 text-red-500" suppressHydrationWarning>⚠️</div>
          <span className="text-sm text-red-700" suppressHydrationWarning>{error}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-red-600 hover:text-red-800 "
            suppressHydrationWarning
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ size = "sm", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`} suppressHydrationWarning>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" suppressHydrationWarning></div>
    </div>
  );
};

// Hooks for managing component state (unchanged)
const useEngagement = (review, reviewId, initialLikeStatus = null) => {
  const initialLikes = review.likesCount !== undefined ? review.likesCount : (review.engagement_stats?.likes || 0);
  const initialComments = review.commentsCount !== undefined ? review.commentsCount : (review.engagement_stats?.comments || 0);
  const initialShares = review.sharesCount !== undefined ? review.sharesCount : (review.engagement_stats?.shares || 0);
  
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingLikeStatus, setFetchingLikeStatus] = useState(false);
  const [optimisticUpdate, setOptimisticUpdate] = useState(false); // Track optimistic updates
  
  // Cache to prevent duplicate API calls for the same reviewId
  const likeStatusCache = useRef(new Map());
  const currentReviewId = useRef(null);
  const user = getCurrentUser();

  // Optimized fetch user's like status with caching
  useEffect(() => {
    // If initialLikeStatus is provided, use it directly
    if (initialLikeStatus !== null && initialLikeStatus !== undefined) {
      setIsLiked(initialLikeStatus);
      likeStatusCache.current.set(reviewId, initialLikeStatus);
      return;
    }

    const fetchLikeStatus = async () => {
      if (!reviewId || fetchingLikeStatus || !user) return;
      
      // Check cache first
      if (likeStatusCache.current.has(reviewId)) {
        setIsLiked(likeStatusCache.current.get(reviewId));
        return;
      }
      
      setFetchingLikeStatus(true);
      try {
        const response = await checkUserLikeStatus(reviewId);
        const likedStatus = response.isLiked;
        
        // Cache the result
        likeStatusCache.current.set(reviewId, likedStatus);
        setIsLiked(likedStatus);
      } catch (err) {
        console.error('Error fetching like status:', err);
      } finally {
        setFetchingLikeStatus(false);
      }
    };

    // Only fetch if reviewId changed and no initial status provided
    if (reviewId && currentReviewId.current !== reviewId) {
      currentReviewId.current = reviewId;
      fetchLikeStatus();
    }
  }, [reviewId, fetchingLikeStatus, initialLikeStatus]);

  const toggleLike = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    
    // Store original state to revert if API call fails
    const originalLikeState = isLiked;
    const originalLikesCount = likes;
    
    // Set optimistic update flag
    setOptimisticUpdate(true);
    
    // Optimistically update UI immediately
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
      likeStatusCache.current.set(reviewId, false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      likeStatusCache.current.set(reviewId, true);
    }
    
    // Set loading to false immediately after UI update
    setLoading(false);
    
    try {
      // Make API call in background
      if (originalLikeState) {
        const response = await unLikeReview(reviewId);
        // Optional: sync with actual server count if needed
        // setLikes(response.likesCount);
      } else {
        const response = await likeReview(reviewId);
        // Optional: sync with actual server count if needed
        // setLikes(response.likesCount);
      }
      // Clear optimistic update flag after successful API call
      setOptimisticUpdate(false);
    } catch (err) {
      // Revert UI changes on error
      setError(err.message || 'Failed to update like status');
      setIsLiked(originalLikeState);
      setLikes(originalLikesCount);
      likeStatusCache.current.set(reviewId, originalLikeState);
      setOptimisticUpdate(false);
      
      // Auto-clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const clearError = () => setError(null);
  const incrementComments = () => setComments(prev => prev + 1);
  const incrementShares = () => setShares(prev => prev + 1);

  return {
    likes,
    comments,
    shares,
    isLiked,
    loading,
    error,
    optimisticUpdate,
    toggleLike,
    clearError,
    incrementComments,
    incrementShares
  };
};

const useComments = (reviewId) => {
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingComments, setFetchingComments] = useState(false);

  const openCommentPopup = async () => {
    setShowCommentPopup(true);
    await fetchComments();
  };
  const closeCommentPopup = () => setShowCommentPopup(false);

  const fetchComments = async () => {
    if (!reviewId) return;
    
    setFetchingComments(true);
    try {
      const response = await getAllCommentByReviewId(reviewId);
      const formattedComments = response.comments?.map(comment => ({
        id: comment.id,
        text: comment.content,
        author: comment?.client?.name || comment?.client?.username || comment?.artist?.name || comment?.artist?.username || 'Anonymous',
        timestamp: comment.createdAt,
        authorImage: comment?.client?.profilePhoto || comment?.artist?.profilePhoto
      })) || [];
      setCommentsList(formattedComments);
    } catch (err) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setFetchingComments(false);
    }
  };

  const addComment = async () => {
    if (commentText.trim()) {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Store the comment text before clearing it
      const commentToAdd = commentText;
      
      // Get current user info for optimistic update
      const user = getCurrentUser();
      
      // Create temporary ID for optimistic comment
      const tempId = `temp-${Date.now()}`;
      
      // Create optimistic comment object
      const optimisticComment = {
        id: tempId,
        text: commentToAdd,
        author: user?.name || user?.username || "You",
        timestamp: new Date().toISOString(),
        authorImage: user?.profilePhoto,
        isOptimistic: true // Flag to identify optimistic comments
      };
      
      // Add optimistic comment to the list immediately
      setCommentsList(prev => [...prev, optimisticComment]);
      
      // Clear the input field immediately
      setCommentText("");
      
      // Set loading to false after UI update
      setLoading(false);
      
      try {
        // Make API call in background
        const response = await addReviewComment(reviewId, commentToAdd);
        
        // Replace optimistic comment with real one from server
        setCommentsList(prev => prev.map(comment => 
          comment.id === tempId ? {
            id: response.id,
            text: response.content,
            author: response.client?.name || response.client?.username || response.artist?.name || response.artist?.username || "You",
            timestamp: response.createdAt,
            authorImage: response.client?.profilePhoto || response.artist?.profilePhoto
          } : comment
        ));
        
        return true;
      } catch (err) {
        // Remove the optimistic comment on error
        setCommentsList(prev => prev.filter(comment => comment.id !== tempId));
        setError(err.message || 'Failed to add comment');
        
        // Auto-clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
        return false;
      }
    }
    return false;
  };

  const clearError = () => setError(null);

  return {
    showCommentPopup,
    commentText,
    commentsList,
    setCommentText,
    openCommentPopup,
    closeCommentPopup,
    addComment,
    fetchingComments,
    fetchComments,
    loading,
    error,
    clearError
  };
};



// Updated EngagementButtons component
const EngagementButtons = ({ engagement, onLike, onComment, onShare }) => {
  const user = getCurrentUser();
  const isAuthenticated = !!user;
  
  return (
  <div className="space-y-3" suppressHydrationWarning>
    <div className="h-px bg-gray-100" suppressHydrationWarning></div>
    
    {/* Error Display for Engagement Actions */}
    <ErrorDisplay 
      error={engagement.error} 
      onRetry={engagement.clearError} 
      className="mb-2"
      suppressHydrationWarning
    />
    
    <div className="flex items-center justify-between" suppressHydrationWarning>
      <button
        onClick={onLike}
        disabled={engagement.loading || !isAuthenticated || user.role === 'admin'}
        className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          engagement.isLiked 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : isAuthenticated 
              ? 'text-gray-600 hover:bg-gray-50 hover:text-red-500'
              : 'text-gray-400 cursor-not-allowed'
        }`}
        title={!isAuthenticated ? "Please log in to like reviews" : ""}
        suppressHydrationWarning
      >
        <div className="w-5 h-5 relative flex items-center justify-center" suppressHydrationWarning>
          {engagement.loading ? (
            <LoadingSpinner size="sm" suppressHydrationWarning />
          ) : (
            <Image
              src={heartIcon}
              className={`w-5 h-5 transition-all duration-200 ${
                engagement.isLiked ? 'scale-110' : ''
              } ${engagement.optimisticUpdate ? '' : ''}`}
              height={20}
              width={20}
              alt="Heart Icon"
              style={{
                filter: engagement.isLiked ? 
                  'brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7151%) hue-rotate(3deg) brightness(97%) contrast(118%)' : 
                  'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%)'
              }}
              suppressHydrationWarning
            />
          )}
        </div>
        <span className={`text-sm font-medium ${engagement.optimisticUpdate ? 'animate-pulse' : ''}`} suppressHydrationWarning>
          {engagement.likes}
        </span>
      </button>

      <button
        onClick={onComment}
        disabled={!isAuthenticated}
        className={`flex items-center gap-2 px-3 cursor-pointer py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isAuthenticated
            ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-600'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        title={!isAuthenticated ? "Please log in to comment on reviews" : ""}
        suppressHydrationWarning
      >
        <Image
          src={commentIcon}
          width={20}
          height={20}
          className="w-5 h-5"
          alt="Comment Icon"
          suppressHydrationWarning
        />
        <span className="text-sm font-medium" suppressHydrationWarning>
          {engagement.comments}
        </span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors cursor-pointer"
        suppressHydrationWarning
      >
        <Image
          src={shareIcon}
          width={20}
          height={20}
          className="w-5 h-5"
          alt="Share Icon"
          suppressHydrationWarning
        />
        
      </button>
    </div>
  </div>
  );
};


// Main ReviewCard Component
const ReviewCard = ({ item, reviewId = item?.id, initialLikeStatus }) => {
  const engagement = useEngagement(item, reviewId, initialLikeStatus);
  const comments = useComments(reviewId);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const user = getCurrentUser();
  const handleLike = () => {
    if (!user) {
      alert("Please log in to like reviews");
      return;
    }
    engagement.toggleLike();
  };

  const handleComment = () => {
    const user = getCurrentUser();
    if (!user) {
      alert("Please log in to comment on reviews");
      return;
    }
    comments.openCommentPopup();
  };

  const handleShare = async () => {
    engagement.incrementShares();
    
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `Review for ${item.artist?.name || item.post_content?.artist_name || 'Artist'}`,
          text: item.content || item.post_content?.review_text || '',
          url: window.location.href,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log("Sharing failed:", error);
    }
  };

  const handleAddComment = async () => {
    const success = await comments.addComment();
    if (success) {
      engagement.incrementComments();
    }
  };

  // Clear errors after a timeout
  useEffect(() => {
    if (engagement.error) {
      const timer = setTimeout(() => {
        engagement.clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [engagement.error, engagement.clearError]);

  useEffect(() => {
    if (comments.error) {
      const timer = setTimeout(() => {
        comments.clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [comments.error, comments.clearError]);

  const handleReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user) {
      alert("Please log in to report reviews");
      return;
    }
    setShowReportModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 hover:shadow-md transition-shadow duration-200 max-w-xl mx-auto cursor-pointer" suppressHydrationWarning>
        <Link href={`/review/${reviewId}`}>
       
        <div className="flex justify-between items-start" suppressHydrationWarning>
          <UserHeader userInfo={item.user_info} review={item} />
          
          {/* Report Button - Only show for artists */}
          {user?.id === item.artistId && (
            <button 
              onClick={handleReport}
              className="text-sm text-gray-500 cursor-pointer hover:text-red-500 flex items-center gap-1 transition-colors"
              title="Report this review"
              suppressHydrationWarning
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Report</span>
            </button>
          )}
        </div>
        
        {/* Global Error Display */}
        <ErrorDisplay 
          error={comments.error && !comments.showCommentPopup ? comments.error : null} 
          onRetry={comments.clearError}
          className="mb-2"
        />
        
        <div className="space-y-4" suppressHydrationWarning>
          {/* Images Section */}
          {item.photoUrls ? (
            <ReviewImages images={item?.photoUrls || item?.post_content?.photoUrls} />
          ) : item.post_content ? (
            <ImageGallery post={item.post_content} />
          ) : null}
          
          {/* Content Section */}
          {item.post_content ? (
            <ArtistInfo postContent={item.post_content} />
          ) : item.artist ? (
            <ArtistInfo postContent={item} artist={item.artist} />
          ) : (
            <ReviewContent review={item} />
          )}
          
          {/* Engagement Section */}
          
        </div>
         </Link>
         <EngagementButtons
            engagement={engagement}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
      </div>

      {/* Comment Popup */}
      {comments.showCommentPopup && (
        <CommentPopup
          comments={comments}
          onClose={comments.closeCommentPopup}
          onAddComment={handleAddComment}
        />
      )}
      
      {/* Report Review Modal */}
      <ReportReviewModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reviewId={reviewId}
      />
    </>
  );
};

export default ReviewCard;