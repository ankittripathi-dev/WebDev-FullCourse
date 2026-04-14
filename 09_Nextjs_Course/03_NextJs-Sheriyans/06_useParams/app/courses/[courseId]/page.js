'use client'
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams()
  console.log(params);
  console.log(params.courseId);

  return (
    <div>
      <h1>{params.courseId} Course</h1>
    </div>
  );
};

export default page;

/*
Notes:
(1) Dynamic Routing me [] bracket ke ander folder bana loo. Aur phir url me kuch vi likhenge access ho jaega.
(2) All Hooks are client components, So if you want to write/use any client components we have to mention 'use client' at the top. Because nextjs support both client side components and server side components So if you want to render at clint side we have to mention use client 
*/