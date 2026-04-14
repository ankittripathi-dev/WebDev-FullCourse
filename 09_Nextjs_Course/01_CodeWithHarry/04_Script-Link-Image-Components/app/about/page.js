import Image from "next/image";

export const metadata = {
  title: "AboutPage - Facebook",
  description: "This is About Facebook Page",
};

const AboutPage = () => {
  return (
    <div className="flex gap-20 text-black">
      <div className="container my-2 size-60 bg-lime-300 relative">
        <Image
          fill={true}
          className="mx-auto object-fill" /* obejct fill */
          src="https://live.staticflickr.com/3716/11924762773_af69c9d5f4_z.jpg"
          alt="AboutPage-Image"
        />
        <h1 className="text-center">About page</h1>
      </div>

      <div className="container my-2 size-60 bg-lime-300 relative">
        <Image
          fill={true}
          className="mx-auto object-contain" /* obejct contain */
          src="https://live.staticflickr.com/3716/11924762773_af69c9d5f4_z.jpg"
          alt="AboutPage-Image"
        />
        <h1 className="text-center">About page</h1>
      </div>

      <div className="container my-2 size-60 bg-lime-300 relative">
        <Image
          fill={true}
          className="mx-auto object-cover" /* obejct cover */
          src="https://live.staticflickr.com/3716/11924762773_af69c9d5f4_z.jpg"
          alt="AboutPage-Image"
        />
        <h1 className="text-center">About page</h1>
      </div>
    </div>
  );
};

export default AboutPage;
