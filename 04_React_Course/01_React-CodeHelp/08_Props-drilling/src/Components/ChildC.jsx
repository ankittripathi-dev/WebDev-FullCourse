import ChildD from "./ChildD";

const ChildC = ({ user3 }) => {
  return (
    <div>
      <h2 style={{ color: "red" }}>Details of Child C</h2>
      <p>Details baad me print krunga avi maan nhi hai</p>

      <ChildD user4={user3} />
    </div>
  );
};

export default ChildC;
