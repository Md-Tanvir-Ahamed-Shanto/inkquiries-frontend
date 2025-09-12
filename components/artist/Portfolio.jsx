"use client"
import React, { useState, useEffect } from "react";
import PortfolioDetails from "./PortfolioDetails";
import CardPortfolio from "../common/CardPortfolio";
import { getArtistPortfolio, addPortfolioItem } from "../../service/portfolioApi";

import Modal from "../common/Modal";
import { MdOutlineFileUpload } from "react-icons/md";
import PortfolioUploadForm from "./PortfolioUploadForm";

function Portfolio() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  
  // Get user from localStorage safely
  const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const artistId = userString ? JSON.parse(userString)?.id : 'me';
   const fetchPortfolio = async (isInitialLoad = false) => {
      try {
        // Only set loading to true for initial load
        if (isInitialLoad) setLoading(true);
        
        const data = await getArtistPortfolio(artistId);
        setPortfolio(data);
        
        if (isInitialLoad) setLoading(false);
      } catch (err) {
        setError(err.message);
        if (isInitialLoad) setLoading(false);
      }
    };

  useEffect(() => {
    if (artistId) {
      fetchPortfolio(true); // Initial load
    }
  }, [artistId]);

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const handleBackFromDetails = () => {
    setSelectedCard(null);
    fetchPortfolio(); // Refresh to get updated like counts
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-6 md:mt-12 flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm sm:text-base text-gray-600">  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div></p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-6 md:mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="text-sm sm:text-base">Error: {error}</p>
        </div>
      </div>
    );
  }

  console.log("portfolio", portfolio);

  return (
    <>
      {selectedCard === null ? (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-6 md:mt-12">
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
              Portfolio
            </h2>
            {artistId === 'me' && (
              <button
                onClick={() => setUploadModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 text-sm sm:text-base font-medium"
              >
                <MdOutlineFileUpload size={20} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Add New Work</span>
              </button>
            )}
          </div>
          
          {/* Portfolio Grid - Fixed Layout */}
          {portfolio?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {portfolio.map((item, index) => (
                <div 
                  key={item.id} 
                  onClick={() => handleCardClick(index)}
                  className="cursor-pointer transition-all duration-200 flex flex-col h-full"
                >
                  <div className="h-full">
                    <CardPortfolio
                      title={item.title}
                      style={item.style}
                      imageUrl={item?.imageUrls}
                      description={item.description}
                      likesCount={item.likesCount || 0}
                      commentsCount={item.comments?.length || 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="max-w-sm mx-auto">
                <div className="mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
                  {artistId === 'me' 
                    ? "Start building your portfolio by adding your first work." 
                    : "This artist hasn't added any portfolio items yet."
                  }
                </p>
                {artistId === 'me' && (
                  <button
                    onClick={() => setUploadModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <MdOutlineFileUpload size={16} className="mr-2" />
                    Add Your First Work
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <PortfolioDetails
          item={portfolio[selectedCard]}
          onBack={handleBackFromDetails}
          isOwner={artistId === 'me'}
          user={userString ? JSON.parse(userString) : null}
        />
      )}

      {/* Modal - Mobile Optimized */}
      <Modal 
        isOpen={uploadModal} 
        onClose={() => setUploadModal(false)}
        className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Add New Portfolio Item
            </h3>
            <button
              onClick={() => setUploadModal(false)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <PortfolioUploadForm
            fetchPortfolio={fetchPortfolio}
            onClose={() => {
              setUploadModal(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
}

export default Portfolio;