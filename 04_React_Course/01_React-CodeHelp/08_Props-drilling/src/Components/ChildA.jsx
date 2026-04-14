import ChildB from "./ChildB";

const ChildA = ({ user1 }) => {
  return (
    <div>
      <h2>User Details of Child A</h2>
      <p>Name: {user1.name}</p>
      <p>Age: {user1.age}</p>

      <ChildB user2={user1} />
    </div>
  );
};

export default ChildA;

// Notes: ChildA me props na use kr ke user1 ko destructuring kiya gaya hai.
// step:2  childB ke liye user1 ko user2 me kiya ja rha, to avoid confusion.
