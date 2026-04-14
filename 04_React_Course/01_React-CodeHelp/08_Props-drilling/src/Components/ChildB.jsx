import ChildC from "./ChildC";

const ChildB = ({ user2 }) => {
  return (
    <div>
      <h2>User Details of ChildB</h2>
      <p>Name: {user2.name}</p>
      <p>Age: {user2.age}</p>

      <ChildC user3={user2} />
    </div>
  );
};

export default ChildB;
