import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

export const metadata = {
  title: "NextAuth",
  description: "NextAuth in Nextjs",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <SessionWrapper>
        <body>{children}</body>
      </SessionWrapper>
    </html>
  );
};
export default RootLayout;
