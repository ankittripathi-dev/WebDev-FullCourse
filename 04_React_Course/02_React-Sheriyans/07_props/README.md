## Props in React

- Props = data passed from parent → child

### Example 
```
 Parent Component
const App = () => {
  return <User name="Ankit" />;
};

 Child Component
const User = (props) => {
  return <h1>Hello {props.name}</h1>;
};


⚡ Destructuring Props (Best Practice)
const User = ({ name }) => {
  return <h1>Hello {name}</h1>;
};
```
