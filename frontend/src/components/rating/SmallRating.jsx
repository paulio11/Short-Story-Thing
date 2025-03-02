import React from "react";

const SmallRating = ({ rating, color, size }) => {
  return (
    <div style={{ color: color, fontSize: size }}>{"★".repeat(rating)}</div>
  );
};

export default SmallRating;
