import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "middleware",
  description: "Middlewear in Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-around py-2 bg-orange-700 text-xl mb-50">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
