import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-3.5 md:px-10 py-2 text-xs md:text-xl bg-emerald-800">
      <h3>Sheriyans</h3>

      <div className="flex gap-2 md:gap-12">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/product">Product</Link>
        <Link href="/courses">Courses</Link>
      </div>
    </div>
  );
};

export default Navbar;
