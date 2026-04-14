import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Dynamic Routes",
  description: "Dynamic Routes In Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <nav className="bg-orange-700 flex justify-around p-1.5 text-2xl mb-50">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/dashboard">DashBoard</Link>
        </nav>
        <div className="text-center text-4xl">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
