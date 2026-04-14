import React from "react";
import './ParamComp.css'
import { useParams } from "react-router-dom";

const ParamComp = () => {
  const { id } = useParams();

  return (
    <div className="params">
      <h1>Params: {id}</h1>
    </div>
  );
};

export default ParamComp;
