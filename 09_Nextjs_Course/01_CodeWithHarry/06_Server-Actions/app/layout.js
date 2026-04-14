import "./globals.css";

export const metadata = {
  title: "Server Actions",
  description: "Server Actions In Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;