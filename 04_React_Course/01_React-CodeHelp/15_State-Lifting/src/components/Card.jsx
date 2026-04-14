import "./Card.css";

const Card = (props) => {
  return (
    <div>
      <input
        type="text"
        onChange={(evt) => props.setNameKaro(evt.target.value)}
      />

      <p>
        Name state variable ki value inside {props.title} : {props.userName}
      </p>
    </div>
  );
};

export default Card;
