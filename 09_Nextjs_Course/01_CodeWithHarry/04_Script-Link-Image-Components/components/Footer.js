import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex justify-around text-xs bg-slate-800 text-white py-3">
      <div className="text-center">Copyright © Facebook | All rights reserved</div>
      <ul className="flex items-center gap-8 text-sm">
        <Link href="/"><li className="text-xs">Home</li></Link>
        <Link href="/about"><li className="text-xs">About</li></Link>
        <Link href="/contact"><li className="text-xs">Contact</li></Link>
      </ul>
    </footer>
  );
};

export default Footer;
