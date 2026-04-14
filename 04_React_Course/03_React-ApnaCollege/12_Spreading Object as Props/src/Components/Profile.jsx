import React from "react";

function Profile({ name, email }) {
  return (
    <div>
      <h1>Name: {name}</h1>
      <h3>Email: {email}</h3>
    </div>
  );
}

export default Profile;
