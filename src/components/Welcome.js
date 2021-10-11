import React from "react";
import mainLogo from "./giffur_main.png";
import { Link } from "react-router-dom";

function Welcome() {
  return (

    <div className="welcome-container">
      <Link to="/editor">
        <div className="container move">
          <div className="dog walking"></div>
        </div>
        <img src={mainLogo} alt="logo" className="background-giffur-image" />
      </Link>
    </div>
  );
}

export default Welcome;
