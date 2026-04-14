import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Data Fetching",
  description: "Nextjs Crash Course By CoderGyan",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-around gap-60 bg-sky-700 py-2 text-xl mb-10">
          <Link href="./">Logo</Link>
          <Link href="./">Home</Link>
          <Link href="./blog">Blog</Link>
        </nav>
        {children}
      </body>
    </html>
  );
};
export default RootLayout;
