import fs from "fs";
import path from "path";
import matter from "gray-matter";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { unified } from "unified";
import OnThisPage from "@/components/onthispage";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from 'rehype-slug'

const SlugPage = async ({ params }) => {
  const { slug } = await params;
  console.log(slug);

  // const blog = {
  //   author: "John Don",
  //   description: "This is a sample blog post description.",
  //   date: "2026-01-02",
  //   title: "Typescript Tutorial in Hindi",
  //   content:
  //     "<p>This is the content of the blog post. It can include <strong>HTML</strong> tags and other elements.</p>",
  // };

  //  cwd: current working directory
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);
  // console.log("filepath =", filePath);

  if (!fs.existsSync(filePath)) {
    return (
      <h1 className="text-3xl underline text-center mt-20 text-orange-500">
        Blog not found
      </h1>
    );
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);
  // console.log(data);

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument, { title: "🌍" })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(rehypeAutolinkHeadings)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      // See Options section below.
      theme: "github-dark",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3_000,
        }),
      ],
    });

  const htmlContent = (await processor.process(content)).toString();
  console.log(htmlContent);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-lg mb-2 border-l-4 border-gray-500 pl-4 italic">
        &quot;{data.description}&quot;
      </p>
      <div className="flex gap-2">
        <p className="text-sm text-gray-500 mb-4 italic">{data.author}</p>
        <p className="text-sm text-gray-500 mb-4">{data.date}</p>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose dark:prose-invert"
      ></div>
      <OnThisPage htmlContent={htmlContent} />
    </div>
  );
};

export default SlugPage;
