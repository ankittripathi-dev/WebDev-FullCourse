import React from "react";

const Section = () => {
  return (
    <>
      <div className="flex w-full h-full">
        <div className="bg-blue-400 text-center  h-full w-1/2 flex items-center justify-center">
          <h1 className="text-4xl">Hero section-1</h1>
        </div>

        <div className="bg-green-400 text-center h-full w-1/2 flex items-center justify-center">
          <h1 className="text-4xl">Hero section-2</h1>
        </div>
      </div>
    </>
  );
};

export default Section;
