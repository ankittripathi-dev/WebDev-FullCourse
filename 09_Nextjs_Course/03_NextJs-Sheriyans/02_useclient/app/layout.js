import "./globals.css";

export const metadata = {
  title: "use client",
  description: "use of 'use client'",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
