import Link from "next/link";

const NotFound = () => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-black mb-4">Not Found</h2>
      <p className="text-lg text-gray-600">Could not find requests resource</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
