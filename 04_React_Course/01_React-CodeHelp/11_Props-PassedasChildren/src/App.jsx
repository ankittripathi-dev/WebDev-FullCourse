import Card from "./components/Card";
import "./App.css";

const App = () => {
  return (
    <>
      <div className="cardOne">
        <Card name="Ankit Tripathi" children="Mein vi Ek chldren hu">
          <h1>Best Web Dev Course</h1>
          <p>Trying to be Consistant in This</p>
          <p>Will Complete the Course Soon</p>
        </Card>
      </div>

      <div className="cardTwo">
        <Card children="Mein Ek children hu"></Card>
      </div>

      <div className="cardThree">
        <Card children="Mein Ek children hu">
          Hello Jee, Kaise ho sare // overRight kr dega children ko
        </Card>
      </div>
    </>
  );
};

export default App;
