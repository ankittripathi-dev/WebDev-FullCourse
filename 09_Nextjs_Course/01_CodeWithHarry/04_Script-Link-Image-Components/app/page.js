import Image from "next/image";

const HomePage = () => {
  return (
    <>
      <div className="container my-2 bg-lime-300 mx-auto">
        <Image
          className="mx-auto"
          width={400}
          height={400}
          src="https://live.staticflickr.com/3716/11924762773_af69c9d5f4_z.jpg"
          alt="HomePage-Image"
        />

        <h1 className="text-center text-xl text-black">Welcome, Home page</h1>
      </div>

      <div className="container my-2 size-90 bg-lime-300 mx-auto">
        <Image
          className="mx-auto"
          width={600}
          height={600}
          src="https://live.staticflickr.com/3716/11924762773_af69c9d5f4_z.jpg"
          alt="HomePage-Image"
        />

        <h1 className="text-center text-xl text-black">Welcome, Home page</h1>
      </div>
    </>
  );
};

export default HomePage;
