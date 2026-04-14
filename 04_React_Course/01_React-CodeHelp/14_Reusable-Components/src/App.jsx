import DhoniPhoto from "./assets/Dhoni.jpeg";
import RainaPhoto from "./assets/Raina.jpg";
import WatsonPhoto from "./assets/Watson.webp";
import UserCard from "./Components/UserCard";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <UserCard
        name="Dhoni"
        image={DhoniPhoto}
        description="Former Indian Captain"
      />

      <UserCard
        name="Raina"
        image={RainaPhoto}
        description="Indian Batting Allrounder"
      />

      <UserCard
        name="Watson"
        image={WatsonPhoto}
        description="Australian Allrounder"
      />
    </div>
  );
};

export default App;
