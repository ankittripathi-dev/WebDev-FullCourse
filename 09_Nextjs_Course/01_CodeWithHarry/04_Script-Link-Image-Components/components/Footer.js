import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex justify-around text-md bg-slate-800 text-white py-4">
      <div className="text-center">
        Copyright © Facebook | All rights reserved
      </div>
      <ul className="flex items-center gap-10 text-md">
        <Link href="/">
          <li>Home</li>
        </Link>
        <Link href="/about">
          <li>About</li>
        </Link>
        <Link href="/contact">
          <li>Contact</li>
        </Link>
      </ul>
    </footer>
  );
};

export default Footer;
