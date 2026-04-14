import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-around bg-orange-600 py-2 text-xl mb-30">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
};

export default Navbar;
// Notes:Here Link tag is used because use of anchor tag will refresh the whole page.
