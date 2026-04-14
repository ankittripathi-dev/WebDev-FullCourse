import React from "react";

const ValPage = async ({ params }) => {
  const { val } = await params;
  console.log("val =", val);

  return (
    <div>
      <h1>My Blog Post: {val}</h1>
      <p className="text-red-600 text-xl">Check Console & Terminal as Well</p>
    </div>
  );
};

export default ValPage;
