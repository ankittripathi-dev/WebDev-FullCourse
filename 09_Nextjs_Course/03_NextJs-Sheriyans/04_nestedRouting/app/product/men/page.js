import Link from "next/link";

const men = () => {
  return (
    <div>
      <div className="flex justify-center gap-5 py-4">
        <Link href="/product/men/pants">Pant's Collection</Link>
        <Link href="/product/men/shirt">Shirt's Collection</Link>
      </div>

      <h1>Men's Collection</h1>
    </div>
  );
};

export default men;
