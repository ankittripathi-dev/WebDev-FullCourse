"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname); 
  return (
    <div>
      <div className="flex justify-around text-xl bg-emerald-950 p-1">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/blogpost">BlogPost</Link>
      </div>
      <div className="text-emerald-500">
        <h1>You are inside {pathname}</h1>
      </div>
    </div>
  );
};

export default Navbar;
