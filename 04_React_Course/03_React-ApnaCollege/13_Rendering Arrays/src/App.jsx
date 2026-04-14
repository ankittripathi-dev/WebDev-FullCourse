import Profile from "./Components/Profile";

function App() {
  const fruits = ["Apple", "Banana", "Mango", "Orange"];

  const users = [
    { name: "Ankit", email: "ankit@gmail.com" },
    { name: "John Doe", email: "john@example.com" },
  ];

  return (
    <>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>

      <div>
        <Profile features={fruits} />
      </div>

      <div>
        {users.map((user) => (
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
