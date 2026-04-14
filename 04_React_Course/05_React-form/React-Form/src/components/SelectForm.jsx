import { useState } from "react";

function SelectForm() {
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected Country: ${country}`);
    setCountry("");
  };

  return (
    <div>
      <h2>Select Dropdown Example</h2>

      <form onSubmit={handleSubmit}>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Nepal">UK</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SelectForm;
