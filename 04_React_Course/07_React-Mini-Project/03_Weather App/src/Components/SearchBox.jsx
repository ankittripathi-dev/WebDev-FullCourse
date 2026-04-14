import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { colors } from "@mui/material";

const SearchBox = ({ updateInformation }) => {
  const [city, setCity] = useState(""); // State to store user input (city name)
  const [error, setError] = useState(false);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "ddcc8e1f7f025d45e354288d10477c26"; // API Key for OpenWeatherMap

  // (1) Fetch Weather Data from API
  const getWeatherInfo = async () => {
    try {
      let response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      let jsonResponse = await response.json();
      // console.log(jsonResponse);

      // Extract required information from API response
      let result = {
        city: city,
        temp: jsonResponse.main.temp,
        tempMin: jsonResponse.main.temp_min,
        tempMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelsLike: jsonResponse.main.feels_like,
        weather: jsonResponse.weather[0].description,
      };
      console.log(result); // Log the result to check the data
      return result;
    } catch (err) {
      throw err;
    }
  };

  // (2) Handle Input Change
  const handleChange = (evt) => {
    setCity(evt.target.value);
  };

  // (3) Handle Form Submission
  const handleSubmit = async (evt) => {
    evt.preventDefault(); // Prevent page reload
    setError(false); // 🔹 Reset error before fetching new data

    try {
      console.log(city); // Log the entered city name
      setCity(""); // Clear input field after submitting
      let newInfo = await getWeatherInfo(); // Fetch weather data
      updateInformation(newInfo); // Pass data to parent component
    } catch (error) {
      setError(true); // Show error message if API fails
    }

    setCity(""); // Clear input field after submitting
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
        />

        <br />
        <br />
        <Button variant="contained" type="submit">
          Search
        </Button>
        {error && <p style={{ color: "red" }}>No Such Place exist!</p>}
      </form>
    </div>
  );
};

export default SearchBox;
