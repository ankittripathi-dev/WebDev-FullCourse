In Next.js, the priority prop tells the browser:
🟢 “This image is important — load it immediately.”
It disables lazy loading and forces the image to load as soon as possible.

# What is fs ?

```
1️⃣ import fs from "fs";

- It is a Node.js built-in module that lets you:

-- fs = File System
- Read files
- Write files
- Delete files
- Read folders

# 📁 Example:
-- fs.readFileSync("file.txt");
👉 Here, we use it to read files from the content folder.

```

2️⃣ import matter from "gray-matter";
❓ What is gray-matter?

Markdown blog files usually look like this:

---

title: JavaScript Tutorial
author: Harsh Sharma
date: 02/03/2025

---

This is blog content

gray-matter:
-- Separates front-matter (metadata) from content
-- Converts it into JavaScript objects

📌 Example:
-- matter(fileContent)
-- Returns:
{
data: { title, author, date },
content: "This is blog content"
}

3️⃣ fs.readdirSync("content", "utf-8")
❓ What does this do?

It reads all filenames inside the content folder.

📁 Suppose content/ contains:

javascript.md
react.md
nextjs.md

Then:

dirContent = ["javascript.md", "react.md", "nextjs.md"];

❓ Why Sync?

Sync = blocking

Code waits until folder is fully read

OK for build time / server components

5️⃣ fs.readFileSync(\content/${file}`, "utf-8")`
❓ What does this do?

Reads the actual content of each markdown file.

Example:

file = "react.md"

So it reads:

content/react.md

Result:

fileContent = "---\ntitle: React\n---\nReact is..."

6️⃣ const { data } = matter(fileContent);
❓ What happens here?

This extracts front-matter metadata.

From this markdown:

---

title: React Tutorial
author: Sarthak
date: 2025

---

You get:

data = {
title: "React Tutorial",
author: "Sarthak",
date: "2025"
}

7️⃣ return data;

Each loop returns only metadata, not full content.

So the final result is:

blogs = [
{ title: "JavaScript Tutorial", author: "Harsh", date: "2025" },
{ title: "React Tutorial", author: "Sarthak", date: "2025" },
{ title: "Next.js Tutorial", author: "Harry", date: "2026" }
]

🏁 Final Output (Easy View)
console.log(blogs);

## Important

fs:-File System (Node.js)
readFileSync:- Read file immediately
filePath:- Which file
"utf-8":- Read as text

####

🔹 LINE 1 — process.cwd()
process.cwd()

What it means:
process → Node.js gives this automatically
cwd → Current Working Directory

📌 Plain English:
“Give me the main folder where my project is running from”

If your project is here:
C:/Users/Ankit/my-nextjs-blog

-- path.join() makes the path work on all OS

##
Line Meaning
process.cwd() Project root
"content" Folder
${slug}.md File name
path.join() Combine safely
fs.readFileSync() Read file text
