import GrandChildB from "./GrandChildB";

const GrandChildA = ({ userData, styles }) => {
  return (
    <>
      <div style={styles.grandChildA}>
        <h2>GrandChild A Component</h2>
        <h3>City: {userData.city}</h3>
      </div>

      <GrandChildB userData={userData} Styles={styles} />
    </>
  );
};

export default GrandChildA;
