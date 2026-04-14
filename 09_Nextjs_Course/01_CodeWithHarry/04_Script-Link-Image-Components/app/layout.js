import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Facebook - Connect with the World",
  description:
    "This is facebook and we can connect with the world using facebook",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container mx-auto min-h-[86vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
};
export default RootLayout;
