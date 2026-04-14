import React from "react";
import "./Dashboard.css";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard Page</h1>
      <Outlet />
    </div>
  );
};

export default Dashboard;
