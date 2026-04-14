"use client";

const HomePage = () => {
  const handleClick = async () => {
    let data = { name: "Ankit", role: "Coder" };
    console.log(data);

    let a = await fetch("api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let res = await a.json();
    console.log("response", res);
  };

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold">Nextjs API Routes Demo</h1>
      <button className="bg-red-500 rounded-md p-1" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
};

export default HomePage;
