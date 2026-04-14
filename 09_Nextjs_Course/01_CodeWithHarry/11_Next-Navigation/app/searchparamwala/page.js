"use client";
import { useSearchParams } from "next/navigation";

const SearchParamWala = () => {
  const searchParams = useSearchParams();

  const blog = searchParams.get("blog");
  const utmSource = searchParams.get("utm_source");

  return (
    <div className="mt-20">
      <h1>
        Our Blog is {blog} and utm source is {utmSource}
      </h1>
    </div>
  );
};
export default SearchParamWala;
/*Notes:
 # useSearchparams use krne ke liye url me yahi type ka url hona chaiye
 - http://localhost:3000/searchparamwala?blog=harry&utm_source=instagram/
*/
