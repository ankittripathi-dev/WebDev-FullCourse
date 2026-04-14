import "./UserCard.css";

const UserCard = ({ name, image, description }) => {
  return (
    <div className="user-container">
      <p className="user-name">{name}</p>
      <img className="user-img" src={image} alt={name} />
      <p className="user-desc">{description}</p>
    </div>
  );
};

export default UserCard;
