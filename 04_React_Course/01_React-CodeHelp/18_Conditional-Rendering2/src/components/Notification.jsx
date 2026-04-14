import React from "react";

const Notification = ({ isLoggedIn }) => {
  // (3) Using && (short-circuit rendering) => Renders content only if condition is true
  return (
    <div className="notification-container">
      <h1>(3) Using Logical Operator</h1>
      {isLoggedIn && <p>Message Popup</p>}
    </div>
  );
};

export default Notification;
