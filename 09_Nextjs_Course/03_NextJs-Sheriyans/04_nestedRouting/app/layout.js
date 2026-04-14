import "./globals.css";
import Navbar from "./Components/Navbar";

export const metadata = {
  title: "Nested Routing",
  description: "Nested Routing in Nextjs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
