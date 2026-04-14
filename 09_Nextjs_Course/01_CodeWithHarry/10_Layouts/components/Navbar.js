import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-around bg-slate-800 text-white text-lg py-3 px-4">
      <ul className="flex gap-72 logo font-bold">
        <Link href="/"><li>Portfolio</li></Link>
        <Link href="/"><li>Home</li></Link>
        <Link href="/about"><li>About</li></Link>
      </ul>
    </nav>
  );
};

export default Navbar;