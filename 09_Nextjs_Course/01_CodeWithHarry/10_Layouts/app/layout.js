import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Layouts",
  description: "Layouts In Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="h-[86vh] text-center pt-44 text-xl">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
