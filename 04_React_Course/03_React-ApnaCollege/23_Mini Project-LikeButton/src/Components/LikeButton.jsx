import React, { useState } from "react";
import "./LikeButton.css";

const handleClick = () => {
  alert("clicked on heart");
};

const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const styleSet = {color : 'red'}

  return (
    <div>
      <p onClick={toggleLike}>
        {isLiked ? (
          <i className="fa-solid fa-heart" style={styleSet}></i>
        ) : (
          <i className="fa-regular fa-heart"></i>
        )}
      </p>
    </div>
  );
};

export default LikeButton;
