import ChildE from "./ChildE";

const ChildD = ({ user4 }) => {
  return (
    <div>
      <h2 style={{ color: "blue" }}>Details of Child D</h2>
      <p>Name: {user4.name}</p>

      <ChildE user5={user4}/>
    </div>
  );
};

export default ChildD;
