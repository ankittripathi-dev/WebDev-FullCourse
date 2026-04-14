import React from "react";

const ProfileDestructuring = ({user}) => {
  const { name, email } = user;
  return (
    <div>
      <h2>Name: {name}</h2>
      <p>Email: {email}</p>

      {/* <h2>Name: {user.name}</h2> */}
      {/* <p>Email: {user.email}</p> */}
    </div>
  );
};

export default ProfileDestructuring;
