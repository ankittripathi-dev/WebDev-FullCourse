import React from "react";

const SlugPage = async ({ params }) => {
  const { slug } = await params;
  console.log(slug);

  return (
    <div className="text-center text-xl">
      <h1>Single Article Page: {slug}</h1>
    </div>
  );
};

export default SlugPage;
