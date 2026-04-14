import Link from "next/link";

const product = () => {
  return (
    <div>
      <div className="flex justify-center gap-5 py-4">
        <Link href='/product/men'>Men's Collection</Link>
        <Link href='/product/women'>Women's Collection</Link>
      </div>
      
      <h1>Product Page</h1>
    </div>
  );
};

export default product;
