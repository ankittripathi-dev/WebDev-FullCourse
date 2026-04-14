import "../Navbar/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div id="left-side">
        <li>Home</li>
        <li>About</li>
        <li>Product</li>
      </div>

      <div id="right-side">
        <li>Contact</li>
        <li>SignIn</li>
      </div>
    </nav>
  );
};

export default Navbar;
