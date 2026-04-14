import "./globals.css";

export const metadata = {
  title: "Creating API",
  description: "Creating API in Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
