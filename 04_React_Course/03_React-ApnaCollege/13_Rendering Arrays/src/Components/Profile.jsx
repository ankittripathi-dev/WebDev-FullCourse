import React from "react";

const Profile = ({ features }) => {
  return (
    <div>
      <h1>
        {features.map((item) => (
          <li>{item}</li>
        ))}
      </h1>
    </div>
  );
};

export default Profile;
