"use client";
import { submitAction } from "@/actions/form";
import { useRef } from "react";

const HomePage = () => {
  let ref = useRef();

  return (
    <div className="w-3/5 mx-auto my-10">
      <form
        ref={ref}
        action={(e) => {
          submitAction(e);
          ref.current.reset();
        }}
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            className="text-black bg-white rounded-xs ml-1 p-0.5"
          />
        </div>

        <div>
          <label htmlFor="add">Address:</label>
          <input
            type="text"
            name="add"
            id="add"
            className="text-black bg-white rounded-xs m-1 p-0.5"
          />
        </div>

        <div>
          <button className="bg-red-600 rounded-md px-2 py-1" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
