// "use client";

const ClientComp = () => {
  console.log("The ID =", process.env.NEXT_PUBLIC_ID);
  console.log("The Secret =", process.env.NEXT_PUBLIC_SECRET);
  return (
    <div className="text-center text-2xl">
      <h1>Client Page</h1>
      <p>
        The ID = {process.env.NEXT_PUBLIC_ID} & Secret = {process.env.NEXT_PUBLIC_SECRET}
      </p>
    </div>
  );
};

export default ClientComp;

// Avaible on both client and server side because here we use  NEXT_PUBLIC_ID, NEXT_PUBLIC_SECRET
