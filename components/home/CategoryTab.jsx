"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const CategoryTab = () => {
      const [activeCategory, setActiveCategory] = useState("Featured");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);
  
  const categories = [
    "Featured",
    "Minimalist Tattoos",
    "Traditional Tattoos",
    "Realism Tattoos",
    "Blackwork Tattoos",
    "Fine Line Tattoos",
    "Watercolor Tattoos",
    "Tattoo Designs",
    "Featureddf",
    "Minimalist dfTattoos",
    "Traditional dfTattoos",
    "Realismfdf Tattoos",
    "Blackwork dfTattoos",
    "Fine Line dfTattoos",
    "Watercolodfr Tattoos",
    "Tattoodf Designs",
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Add small buffer to account for rounding differences
      const isAtStart = scrollLeft <= 5;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5;

      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd);
    }
  };

  useEffect(() => {
    // Initial check with multiple attempts to ensure DOM is ready
    const initialCheck = () => {
      checkScrollButtons();
      // If container still has no scrollWidth, try again
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.scrollWidth === 0
      ) {
        setTimeout(initialCheck, 100);
      }
    };

    setTimeout(initialCheck, 50);

    const handleResize = () => {
      setTimeout(() => checkScrollButtons(), 100);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      checkScrollButtons();
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
      // Check buttons after scroll animation
      setTimeout(() => checkScrollButtons(), 350);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
      // Check buttons after scroll animation
      setTimeout(() => checkScrollButtons(), 350);
    }
  };

  return (
    <div className="flex items-center bg-white border-b border-gray-200 relative">
        {/* Left scroll button with gradient fade - Hidden on mobile */}
        <div
          className={`absolute left-0 top-0 bottom-0 items-center z-10 transition-all duration-300 hidden md:flex ${
            showLeftArrow
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-r from-white via-white to-transparent w-12 h-full flex items-center pl-4">
            <button
              onClick={scrollLeft}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors bg-white shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-1 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2 md:mx-8 md:px-0 md:py-2 w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === category
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right scroll button with gradient fade - Hidden on mobile */}
        <div
          className={`absolute right-0 top-0 bottom-0 items-center z-10 transition-all duration-300 hidden md:flex ${
            showRightArrow
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-l from-white via-white to-transparent w-12 h-full flex items-center justify-end pr-4">
            <button
              onClick={scrollRight}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors bg-white shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile scroll indicators */}
        <div className="md:hidden absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="md:hidden absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>
  )
}

export default CategoryTab