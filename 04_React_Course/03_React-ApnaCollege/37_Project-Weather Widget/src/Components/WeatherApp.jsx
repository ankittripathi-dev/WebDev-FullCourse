import React, { useState } from "react";
import Searchbox from "./SearchBox";
import InfoBox from "./InfoBox";

const WeatherApp = () => {
  // (1) State to store weather information
  const [weatherInfo, setWeatherInfo] = useState({
    city: "Wonderland",
    temp: 25.05,
    tempMin: 25.04,
    tempMax: 25.05,
    feelsLike: 24.84,
    humidity: 47,
    weather: "haze",
  });

  // (2) Function to update weather information when a new city is searched
  const updateInfo = (newInfo) => {
    setWeatherInfo(newInfo); // Update state with new weather data
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Weather App</h1>
      <Searchbox updateInformation={updateInfo} />
      <InfoBox info={weatherInfo} />
    </div>
  );
};

export default WeatherApp;
