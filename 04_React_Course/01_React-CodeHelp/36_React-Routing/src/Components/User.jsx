import React from "react";
import { useParams } from "react-router-dom";

const User = () => {
  const params = useParams();

  return (
    <div>
      <h2>I am user {params.username}</h2>
    </div>
  );
};

export default User;
