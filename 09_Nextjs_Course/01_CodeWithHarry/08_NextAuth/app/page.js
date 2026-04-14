"use client";
import { useSession, signIn, signOut } from "next-auth/react";

const Component = () => {
  const { data: session } = useSession();
  console.log("session =", session);

  if (session) {
    return (
      <div className="text-center text-xl m-5">
        <h1>Signed in as :- {session.user.email} </h1>
        <button
          className="bg-sky-500 p-1 px-2 rounded-md"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-xl m-5">
      <h1>Not Signed In</h1>

      <button
        className="bg-sky-500 px-2 p-1 rounded-md mr-2"
        onClick={() => signIn()}
      >
        Sign in as Github
      </button>

      <button
        className="bg-orange-500 px-2 p-1 rounded-md"
        onClick={() => signIn("github")}
      >
        Sign in as Github
      </button>

      <button
        className="bg-lime-500 px-2 p-1 rounded-md ml-2"
        onClick={() => signIn("google")}
      >
        Sign in as Google
      </button>
    </div>
  );
};

export default Component;
