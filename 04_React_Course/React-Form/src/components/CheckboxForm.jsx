import { useState } from "react";

function CheckboxForm() {
  const [agree, setAgree] = useState(false);
  // const [agree, setAgree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(agree ? "You agreed!" : "Please agree to continue.");
    setAgree('')
  };

  return (
    <>
      <h2>Checkbox Example</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          I agree to the terms
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default CheckboxForm;
