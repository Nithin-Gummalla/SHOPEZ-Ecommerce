import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star key={i} size={size} className="text-warning fill-warning" />
      );
    } else if (i - rating < 1) {
      stars.push(
        <Star key={i} size={size} className="text-warning fill-warning opacity-75" />
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-muted" />
      );
    }
  }

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="d-flex align-items-center">{stars}</div>
      <span className="fw-semibold text-dark small ms-1">{rating ? rating.toFixed(1) : '0.0'}</span>
      {numReviews !== undefined && (
        <span className="text-muted small">({numReviews})</span>
      )}
    </div>
  );
};

export default RatingStars;
