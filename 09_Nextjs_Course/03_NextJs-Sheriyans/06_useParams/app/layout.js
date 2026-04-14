import Navbar from "./Components/Navbar";
import "./globals.css";

export const metadata = {
  title: "use params",
  description: "use params in nextjs",
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
