import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader color="crimson" size={60} />
    </div>
  );
};

export default Loading;
