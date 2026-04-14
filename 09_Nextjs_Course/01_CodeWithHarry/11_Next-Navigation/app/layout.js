import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Next Navigation",
  description: "Next Navigation In Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="text-center text-xl">
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
