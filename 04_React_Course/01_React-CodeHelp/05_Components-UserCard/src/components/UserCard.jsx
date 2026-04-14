import DhoniPhoto from "../assets/msdhoni.jpg";
import "./UserCard.css";

const Usercard = () => {
  return (
    <div className="user-container">
      <p className="user-name">MS Dhoni</p>
      <img className="user-img" src={DhoniPhoto} alt="photo" />
      <p className="user-desc">Former Indian Captain</p>
    </div>
  );
};

export default Usercard;
