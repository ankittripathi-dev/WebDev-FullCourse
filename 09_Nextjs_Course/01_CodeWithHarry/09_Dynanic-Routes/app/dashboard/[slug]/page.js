import React from "react";

const SlugPage = async ({ params }) => {
  const { slug } = await params;
  console.log("slug =", slug);

  return (
    <div>
      <h1> My DashBoard Post: {slug}</h1>
      <p className="text-red-600 text-xl">Check Console & Terminal as Well</p>
    </div>
  );
};

export default SlugPage;

/############### With Some Conditions ##################/;
/*
const SlugPage = async ({ params }) => {
  const { slug } = await params;
  console.log(slug);

  let languages = ["python", "javascript", "java", "go", "rust", "kotlin"];
  // console.log(languages[1]);

  if (languages.includes(slug)) {
    return <div>My DashBoard Post: {slug}</div>;
  } else {
    return <div>Post not found</div>;
  }
};

export default SlugPage;
*/

/############### With Error Wala Conditions ##################/;
/*
const SlugPage = async ({ params }) => {
  const { slug } = await params;

  throw new Error("error hai beta");

  let languages = ["python", "javascript", "java", "go", "rust", "kotlin"];
  // console.log(languages[1]);

  if (languages.includes(slug)) {
    return <div>My Post: {slug}</div>;
  } else {
    return <div>Post not found</div>;
  }
};

export default SlugPage;
*/
