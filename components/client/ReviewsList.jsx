"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { deleteReview, updateReview, uploadReviewPhotos } from '@/service/clientApi';
import { toast } from 'react-hot-toast';

const ReviewsList = ({ reviews = [], onUpdate }) => {
  const [editingReview, setEditingReview] = useState(null);

  const handleUpdate = (updatedReview) => {
    const newReviews = reviews.map(review =>
      review.id === updatedReview.id ? updatedReview : review
    );
    onUpdate(newReviews);
    setEditingReview(null);
  };

  const handleDelete = (reviewId) => {
    const newReviews = reviews.filter(review => review.id !== reviewId);
    onUpdate(newReviews);
  };

  return (
    <div className="space-y-6 py-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No reviews yet. Share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

const ReviewCard = ({ review, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdate = async () => {
    try {
      await updateReview(review.id, {
        text: editedReview.text,
        rating: editedReview.rating
      });
      onUpdate(editedReview);
      setIsEditing(false);
      toast.success('Review updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(review.id);
      onDelete(review.id);
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePhotoUpload = async (files) => {
    try {
      setIsUploading(true);
      await uploadReviewPhotos(review.id, files);
      toast.success('Photos uploaded successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Review for {review.artistName || "Unknown Artist"}
          </h3>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedReview.text}
              onChange={(e) => setEditedReview({
                ...editedReview,
                text: e.target.value
              })}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Write your review here..."
            />
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditedReview({ ...editedReview, rating: star })}
                  className={`text-xl ${star <= editedReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">{review.text}</p>
            {review.photos?.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {review.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt="Review"
                    className="rounded-lg object-cover w-full h-24"
                  />
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">
              Posted on {format(new Date(review.createdAt), 'PPP')}
            </p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <div className="space-x-2">
          <button
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-gray-600 text-white hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
        {!isEditing && (
          <div className="relative">
            <button
              onClick={() => document.getElementById(`photo-upload-${review.id}`).click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Add Photos
            </button>
            <input
              id={`photo-upload-${review.id}`}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoUpload(Array.from(e.target.files))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;