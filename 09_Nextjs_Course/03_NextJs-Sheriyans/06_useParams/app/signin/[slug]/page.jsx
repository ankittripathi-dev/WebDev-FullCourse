import React from "react";

// Method-2 use of params
const page = async ({ params }) => {
  const resolvedParams = await params;
  console.log(resolvedParams);
  console.log(resolvedParams.slug);

  return (
    <div>
      <h1>SignIn with: {resolvedParams.slug}</h1>
    </div>
  );
};

export default page;
