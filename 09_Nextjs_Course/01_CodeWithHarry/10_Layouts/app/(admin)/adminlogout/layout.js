export const metadata = {
  title: "adminlogout:- layout",
  description: "adminlogout Page layouts",
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <p className="text-lime-500">Logout Navbar</p>
      {children}
    </>
  );
};

export default AdminLayout;
