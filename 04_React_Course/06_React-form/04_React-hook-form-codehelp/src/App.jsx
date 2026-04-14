import React from "react";
import "./App.css";
import { useForm } from "react-hook-form";

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmitted(data) {
    console.log("submitted the form", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitted)}>
      <div>
        <label>First Name:</label>
        <input
          className={errors.firstName ? "input-error" : ""}
          {...register("firstName", { required: true,
            minLength: { value: 3, message: "Min Length should be atleat 3" },
            maxLength: { value: 6, message: "Max length should be atmost 6" },
          })}
        />
        {errors.firstName && (
          <p className="error-msg">{errors.firstName.message}</p>
        )}
      </div>


      <div>
        <label>Middle Name:</label>
        <input {...register("middleName")} />
      </div>


      <div>
        <label>Last Name:</label>
        <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
      </div>

      <div>
        <input type="submit" />
        {/* <button>Submitted</button> */}
      </div>
    </form>
  );
};

export default App;
