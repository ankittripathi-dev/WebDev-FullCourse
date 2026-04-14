import "./globals.css";

export const metadata = {
  title: "SSR, SSG, ISR",
  description: "Server-Side Rendering, Static-Site Generation, Incremental-Static Regeneration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}