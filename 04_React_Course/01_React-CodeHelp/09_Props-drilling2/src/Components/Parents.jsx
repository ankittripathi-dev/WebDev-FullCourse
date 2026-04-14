import Child from "./Child";

const Parents = ({message}) => {
  return (
    <div>
      <Child message={message} />
    </div>
  );
};

export default Parents;
