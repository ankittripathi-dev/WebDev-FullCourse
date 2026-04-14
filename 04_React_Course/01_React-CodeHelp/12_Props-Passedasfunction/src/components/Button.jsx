import "./Button.css";

const Button = (props) => {
  return (
    <div>
      {props.children}
      <button onClick={props.handler}>{props.text}</button>
    </div>
  );
};

export default Button;
