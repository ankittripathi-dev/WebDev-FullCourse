import GrandChild from "./GrandChild";

const Child = ({message}) => {
  return (
    <div>
      <GrandChild message={message} />
    </div>
  );
};

export default Child;
