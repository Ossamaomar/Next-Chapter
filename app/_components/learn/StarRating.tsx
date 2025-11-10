import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({ onRatingChange, defaultRating })  {
  const [rating, setRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const handleClick = (value) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const currentRating = hoverRating || rating;

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg ">
      <div className="h-6 flex items-center">
        {currentRating > 0 && (
          <p className="text-lg font-semibold text-gray-700 animate-fade-in">
            {ratingLabels[currentRating]}
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={40}
              className={`transition-colors duration-200 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
    </div>
  );
};