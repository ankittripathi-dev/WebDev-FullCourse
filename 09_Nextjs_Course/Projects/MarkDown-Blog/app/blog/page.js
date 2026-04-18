import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import fs from "fs";
import matter from "gray-matter";

const dirContent = fs.readdirSync("content", "utf-8");
// console.log(dirContent);
const blogs = dirContent.map((file) => {
  const fileContent = fs.readFileSync(`content/${file}`, "utf-8");
  // console.log(fileContent);

  /*
  const result = matter(fileContent);
  const data = result.data;
*/
  // This is same code using object destructurimg
  const { data } = matter(fileContent);
  return data;
});
console.log(blogs);

// const blogs = [
//   {
//     title: "First Blog",
//     description: "This is the first blog description.",
//     slug: "blog-one",
//     date: "2025-11-11",
//     author: "John Doe",
//     image: "/images/designer.avif",
//   },

//   {
//     title: "Second Blog",
//     description: "This is the second blog description.",
//     slug: "blog-two",
//     date: "2025-12-02",
//     author: "Jane Smith",
//     image: "/images/blogwriter.avif",
//   },

//   {
//     title: "Third Blog",
//     description: "This is the third blog description.",
//     slug: "blog-third",
//     date: "2025-07-7",
//     author: "Michael Brown",
//     image: "/images/blogger.avif",
//   },
//   // Add more blog objects here
// ];

const BlogPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md overflow-hidden  dark:border-2"
          >
            <Image
              height={300}
              width={300}
              priority
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 object-cover"
            />

            {/* Blog post content */}
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-2 ">{blog.title}</h2>
              <p className=" mb-4">{blog.description}</p>

              <div className="text-sm  mb-4">
                <span>By {blog.author}</span> |{" "}
                <span>
                  {new Date(blog.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Link to the full blog post */}
              <Link href={`/blogpost/${blog.slug}`}>
                <Button variant="outline">Click Here</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
