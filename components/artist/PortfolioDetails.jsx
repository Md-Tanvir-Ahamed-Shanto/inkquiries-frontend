import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GoComment, GoDotFill, GoHeartFill } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";
import { BiShare } from "react-icons/bi";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import heartIcon from "@/public/icon/heart.png";
import commentIcon from "@/public/icon/comment.png";
import {
  updatePortfolioItem,
  deletePortfolioItem,
  addPortfolioComment,
  getPortfolioComments,
  deletePortfolioComment,
  likePortfolioItem,
  unlikePortfolioItem,
  checkPortfolioLikeStatus,
  clearBatchPortfolioLikeStatusCache
} from "../../service/portfolioApi";
import { getCurrentUser } from "../../service/authApi";
import DeleteModal from "../common/DeleteModal";
import backendUrl from "@/utils/baseUrl";

function PortfolioDetails({ item, onBack, isOwner, user }) {
  const [editing, setEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || "",
    style: item.style,
    placement: item.placement,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(item.comments || []);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
console.log("Commentrs",comments)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePortfolioItem(item.id, formData);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update portfolio item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await deletePortfolioItem(item.id);
      onBack();
    } catch (err) {
      setError(err.message || "Failed to delete portfolio item");
      setDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    // Check authentication before allowing comment
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      alert('Please log in to comment on this portfolio item.');
      return;
    }
    
    setCommentLoading(true);
    try {
      // Use the item's ID as portfolioImageId
      const portfolioImageId = item.id;
      const newComment = await addPortfolioComment(portfolioImageId, commentText);
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (err) {
      setError(err.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    // Check authentication before allowing like
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      alert('Please log in to like this portfolio item.');
      return;
    }

    setLikeLoading(true);
    try {
      // Use the item's ID as portfolioImageId
      const portfolioImageId = item.id;
      if (isLiked) {
        await unlikePortfolioItem(portfolioImageId);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likePortfolioItem(portfolioImageId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
      // Clear cache to ensure consistency
      clearBatchPortfolioLikeStatusCache();
    } catch (err) {
      setError(err.message || "Failed to update like status");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Use the item's ID as portfolioImageId
      const portfolioImageId = item.id;
      await deletePortfolioComment(portfolioImageId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        // Use the item's ID as portfolioImageId
    const portfolioImageId = item.id;
        const response = await getPortfolioComments(portfolioImageId);
        setComments(response.comments || response);
      } catch (err) {
        setError(err.message || "Failed to load comments");
      }
    };
    
    const checkAuthAndLikeStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setIsAuthenticated(!!currentUser);
        
        if (currentUser) {
          // Use the item's ID as portfolioImageId
          const portfolioImageId = item.id;
          const likeStatus = await checkPortfolioLikeStatus(portfolioImageId);
          setIsLiked(likeStatus.isLiked);
        }
      } catch (err) {
        console.error('Failed to check authentication or like status:', err);
      }
    };
    
    loadComments();
    checkAuthAndLikeStatus();
    setLikesCount(item.likesCount || 0);
  }, [item.id, item.likesCount]);
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Breadcrumbs */}
      <div className="mt-4 md:mt-6 text-neutral-600 text-sm sm:text-base">
        <span
          className="cursor-pointer hover:text-black hover:underline"
          onClick={() => onBack()}
        >
          Portfolio
        </span>{" "}
        <span className="mx-1">&gt;</span>
        <span>Portfolio Details</span>
      </div>

      {/* Main Content */}
      <div className="mt-6 md:mt-8 flex justify-between items-start">
        <div>
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placement
                </label>
                <input
                  type="text"
                  name="placement"
                  value={formData.placement}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-900 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {item.title}
              </h1>
              <div className="mt-2 text-sm md:text-base">
                <span className="text-zinc-500">Style:</span>{" "}
                <span>{item.style}</span>
              </div>
              <div className="mt-2 text-sm md:text-base">
                <span className="text-zinc-500">Placement:</span>{" "}
                <span>{item.placement}</span>
              </div>
            </>
          )}
        </div>

        {isOwner && !editing && (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              <FiEdit3 className="mr-2" size={16} />
              Edit
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-100 rounded-lg text-red-700 hover:bg-red-200"
            >
              <FiTrash2 className="mr-2" size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <>
            <div className="col-span-1 md:col-span-3 h-80 md:h-[605px]">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${item.imageUrls[0]}`}
                alt={`${item.title} - Main`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            {item.imageUrls.slice(1).map((imageUrl, index) => (
              <div key={index} className="h-40 md:h-full">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${imageUrl}`}
                  alt={`${item.title} - ${index + 2}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-1 md:col-span-3 h-80 md:h-[605px] flex items-center justify-center bg-gray-100 rounded-xl">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-8 md:mt-12">
        <h2 className="font-semibold text-xl md:text-2xl">Description</h2>
        {editing ? (
          <div className="mt-4">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Add a description..."
            />
          </div>
        ) : (
          <p className="mt-4 text-neutral-600 text-sm md:text-base">
            {item.description || "No description available."}
          </p>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-8">
        <div className="flex items-center gap-6 py-4 border-y border-gray-200">
          <button
            onClick={handleLike}
            disabled={likeLoading || !isAuthenticated}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              !isAuthenticated 
                ? 'text-gray-400 cursor-not-allowed' 
                : isLiked 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
            title={!isAuthenticated ? 'Please log in to like this portfolio item' : ''}
          >
            {likeLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <Image
              src={heartIcon}
              height={20}
              width={20}
              alt="Heart Icon"
              style={{
                  filter: 'brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7151%) hue-rotate(3deg) brightness(97%) contrast(118%)'
              }}
              suppressHydrationWarning
            />
            )}
            <span className="font-medium">{likesCount}</span>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              !isAuthenticated 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
            }`}
            title={!isAuthenticated ? 'Please log in to comment on this portfolio item' : ''}
          >
            <Image
          src={commentIcon}
          width={20}
          height={20}
          className="w-5 h-5"
          alt="Comment Icon"
          suppressHydrationWarning
        />
            <span className="font-medium">{comments.length}</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-green-500 hover:bg-green-50 transition-all duration-200">
            <BiShare size={20} />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex flex-col gap-5 mt-6">
        <h3 className="font-semibold text-lg md:text-xl">All Comments</h3>

        {/* Comment Group Container */}
        <div className="flex flex-col gap-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="relative flex gap-2">
                {/* 🟡 Vertical Line Connector */}
                <div className="absolute top-8 left-4 w-[2px] h-[calc(100%-2rem)] bg-zinc-200" />
                {/* Parent Profile */}
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={`${backendUrl}${comment.client?.profilePhoto}`}
                    alt="profile image"
                    width={40}
                    height={40}
                    className="object-contain rounded-full"
                  />
                </div>
                {/* Comment Content */}
                <div className="flex-1">
                  <div className="p-3 bg-neutral-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{comment.client?.name || 'Anonymous'}</h4>
                  <GoDotFill className="text-neutral-600" size={6} />
                  <p className="text-neutral-600 text-sm">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 text-sm md:text-base">
                  {comment.content}
                </div>
              </div>
              <div className="mt-2 ml-auto flex gap-2.5 justify-end">
                {(user?.id === comment.clientId || isOwner) && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
          ))
          ) : (
            <p className="text-sm text-zinc-500">No comments yet.</p>
          )}
        </div>

        {/* New Comment Input */}
        <div className="mt-6 flex gap-2 items-center">
          {/* Input with emoji */}
          <div className="relative flex-1">
            <input
              type="text"
              className={`w-full h-12 pr-10 pl-4 border border-zinc-200 rounded-xl focus:outline-none ${
                !isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder={isAuthenticated ? "Comment here..." : "Please log in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && isAuthenticated && handleAddComment()}
              disabled={!isAuthenticated}
            />
         
          
          </div>
          {/* Send button */}
          <div 
            className={`w-12 h-12 rounded-full flex justify-center items-center cursor-pointer ${
              !isAuthenticated || !commentText?.trim() || commentLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            }`}
            onClick={isAuthenticated ? handleAddComment : undefined}
            title={!isAuthenticated ? 'Please log in to comment' : ''}
          >
            {commentLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <AiOutlineSend size={24} color="white" />
            )}
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default PortfolioDetails;
