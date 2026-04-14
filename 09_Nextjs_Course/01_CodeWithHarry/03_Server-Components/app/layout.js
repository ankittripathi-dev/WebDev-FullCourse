import "./globals.css";

export const metadata = {
  title: "Server Componenents",
  description: "How to use server components",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
