import "./UserCard.css";

const Usercard = (props) => {
  return (
    <div className="user-container" style={props.style}>
      <p className="user-name">{props.name}</p>
      <img className="user-img" src={props.image} alt={props.name} />
      <p className="user-desc">{props.disc}</p>
    </div>
  );
};

export default Usercard;
