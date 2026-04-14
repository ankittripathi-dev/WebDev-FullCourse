import Link from "next/link";

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "Post 1",
      body: "Post Body 1",
    },

    {
      id: 2,
      title: "Post 2",
      body: "Post Body 2",
    },
  ];

  return (
    <div className="text-center text-xl">
      <h1 className="mb-3">Blog Posts..</h1>

      <div>
        {posts.map((mypost) => {
          return (
            <div key={mypost.id}>
              <Link href={`/blog/${mypost.id}`}>
                <h2 className="text-blue-600">{mypost.title}</h2>
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
