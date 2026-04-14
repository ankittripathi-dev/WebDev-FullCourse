import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-slate-800 text-white text-lg py-3 px-4">
      <div className="logo font-bold">Facebook</div>
      <ul className="flex gap-12">
        <Link href="/"><li>Home</li></Link>
        <Link href="/about"><li>About</li></Link>
        <Link href="/contact"><li>Contact</li></Link>
      </ul>
    </nav>
  );
};

export default Navbar;