import './Button.css'

const Button = (props) => {
  return (
    <div>
      {props.children}
      <button onClick={props.handlerPlus}>{props.incrementText}</button>
      <button onClick={props.handlerMinus}>{props.decrementText}</button>
    </div>
  );
};

export default Button;
