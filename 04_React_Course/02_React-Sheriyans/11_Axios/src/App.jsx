import axios from "axios";
import  { useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get("https://picsum.photos/v2/list?page=2&limit=08");
    const data = response.data;
    setData(data);
    console.log(data);

    // Same using fetch method
    // const response = await fetch("https://picsum.photos/v2/list?page=2&limit=08")
    // const data = await response.json()
    // console.log(data);
    // setData(data)
  };

  return (
    <div className="flex flex-col p-10 justify-center items-center">
      <button
        onClick={getData}
        className="bg-blue-600 px-6 py-2 text-xl font-semibold rounded active:scale-90"
      >
        Get Data
      </button>

      <div className="p-8 mt-6 bg-orange-500 rounded-md w-full">
        {data.map((elem, index) => {
          return (
            <div
              key={index}
              className="bg-gray-50 text-black flex items-center justify-between w-full py-8 px-16 mb-5 rounded"
            >
              <img className="h-60 rounded" src={elem.download_url} alt="" />

              <h1>{elem.author}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
