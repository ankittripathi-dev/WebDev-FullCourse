import GrandChildA from "./GrandChildA";

const Child = ({ userData, styles }) => {
  return (
    <>
      <div style={styles.child}>
        <h2>Child Component</h2>
        <h3>User: {userData.username}</h3>
      </div>

      <GrandChildA userData={userData} styles={styles} />
    </>
  );
};

export default Child;
