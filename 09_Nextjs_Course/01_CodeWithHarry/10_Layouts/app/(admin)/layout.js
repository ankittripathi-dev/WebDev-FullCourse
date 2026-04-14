export const metadata = {
  title: "Admin:- layouts page",
  description: "This is admin layouts",
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <p className="text-orange-500">Admin Navbar</p>
      {children}
    </>
  );
};

export default AdminLayout;
