"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const SlugPage = () => {
  const params = useParams();
  const router = useRouter();

  // Aaise timer vi laga skte hai same route ke badd E wala route pe visit kr dega
  useEffect(() => {
    setTimeout(() => {
      router.push("/signin");
    }, 3500);
  }, []);

  return (
    <div className="mt-20">
      <h1>{params.slug}</h1>

      <button
        type="button"
        className="bg-green-800 px-1.5 text-lg rounded-md"
        onClick={() => router.push("/signin")}
      >
        SignIn
      </button>
    </div>
  );
};

export default SlugPage;
