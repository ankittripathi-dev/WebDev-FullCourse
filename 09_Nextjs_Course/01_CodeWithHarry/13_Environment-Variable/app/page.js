const Home = () => {
  console.log("My Id is:", process.env.ID);
  console.log("My Secret is:", process.env.SECRET);

  return (
    <div className="text-center text-2xl">
      <h1>Home Page</h1>
      <p>
        My Id is: {process.env.ID} & Secret is: {process.env.SECRET}
      </p>
    </div>
  );
};

export default Home;

/* Notes:
🔼 Higher priority overrides lower priority
(1) .env.local  (highest priority)
(2) .env  (lower priority)

process.env.ID => Avaibale only at server side
process.env.SECRET_PUBLIC_ID => Available on both server & client side.
*/
