import React from "react";
import "./Bot-Add.css";

const BotAdd = ({ onClick }) => {
  return (
    <div className="botadd-container" onClick={onClick} style={{ cursor: "pointer" }}>
      +
    </div>
  );
};

export default BotAdd;
