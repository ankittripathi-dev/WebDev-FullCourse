import Comp5 from "./Comp5";

const Comp4 = ({ user }) => {
  return (
    <div>
      <h1>Component 4</h1>
      <Comp5 user={user} />
    </div>
  );
};

export default Comp4;
