'use client'
import { SessionProvider } from "next-auth/react";

const SessionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
// Notes: Jaha par vi aap SessionProvide use kr rhe hoo Waha pe aapko client components banana padta hai.