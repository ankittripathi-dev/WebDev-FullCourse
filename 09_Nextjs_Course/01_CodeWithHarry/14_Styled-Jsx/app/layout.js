import "./globals.css";

export const metadata = {
  title: "Styled JSX",
  description: "Styled JSX and other ways to Style in Nextjs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
