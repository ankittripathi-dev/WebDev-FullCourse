import Link from "next/link";
import { Suspense } from "react";
import Posts from "./components/posts";

const BlogPage = async () => {
  // const data = await 
  // const posts = await data.json();

  const myPromise = fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res)=>res.json())

  return (
    <div>
      <h1>Blog Posts</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Posts myPromise={myPromise} />
      </Suspense>
    </div>
  );
};

export default BlogPage;
