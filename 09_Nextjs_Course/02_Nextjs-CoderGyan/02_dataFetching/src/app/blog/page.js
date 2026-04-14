import Link from "next/link";

const BlogPage = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await data.json();
  console.log(posts);

  return (
    <div className="px-6">
      <h1>Blog Posts....</h1>

      <div className="flex flex-wrap gap-5 ">
        {posts.map((mypost) => {
          return (
            <div key={mypost.id} className="border p-3">
              <Link href={`/blog/${mypost.id}`}>
                <h2 className="text-indigo-500">
                  {mypost.id}: {mypost.title}
                </h2>
              </Link>
              <p>{mypost.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPage;
