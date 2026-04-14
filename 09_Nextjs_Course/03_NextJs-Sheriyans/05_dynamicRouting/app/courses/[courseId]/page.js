import React from "react";

const page = () => {
  return (
    <div>
      <h1>XYZ Course</h1>
    </div>
  );
};

export default page;

// Notes:- Dynamic Routing me [] bracket ke ander folder bana loo. Aur phir url me kuch vi likhenge access ho jaega

// Notes: All Hooks are client components, So if you want to write/use any client components we have to mention 'use client' at the top. Because nextjs support both client side components and server side components. So if you want to render at clint side we have to mention 'use client' at the top of the code.
