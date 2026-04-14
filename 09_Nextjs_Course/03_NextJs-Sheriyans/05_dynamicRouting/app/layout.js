import Navbar from "./Components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Dynamic Routing",
  description: "Dynamic routing in nextjs",
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
