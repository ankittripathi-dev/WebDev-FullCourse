'use client'

const Posts = ({myPromise}) => {
  console.log(myPromise);
  
  return (
    <div className="flex flex-wrap gap-5">
      {posts.map((mypost) => {
        return (
          <div key={mypost.id} className="border p-3">
            <Link href={`/blog/${mypost.id}`}>
              <h2 className="text-indigo-500">{mypost.title}</h2>
            </Link>
            <p>{mypost.body}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
