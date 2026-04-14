import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-emerald-600 text-white py-5 px-10 flex items-center justify-between">
      <h2 className="text-2xl">
        E-mart <input className="text-black rounded" type="text" />
      </h2>

      <div className="flex gap-10 text-lg underline">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/product">Product</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </div>
  );
};

export default Header;

