import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  // useEffect ka kaam hai kisi function ko baar-baar chalana

  const getData = async () => {
    const response = await axios.get(
      "https://picsum.photos/v2/list?page=2&limit=10"
    );
    const data = response.data;
    setData(data);
    console.log(data);
  };

  return (
    <div className="p-10 bg-purple-500">
      <div className="p-10 bg-gray-950">
        {data.map(function (elem, index) {
          return (
            <div
              key={index}
              className="bg-gray-50 text-black flex items-center justify-between w-full py-6 px-12 mb-6 rounded"
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
