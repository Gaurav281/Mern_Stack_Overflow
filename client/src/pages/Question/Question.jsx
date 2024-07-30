/* eslint-disable react/prop-types */
// import React from 'react'
import "../../App.css";
import Homemainbar from "../../Comnponent/Homemainbar/homemainbar";
import Leftsidebar from "../../Comnponent/Leftsidebar/Leftsidebar";
import Rightsidebar from "../../Comnponent/Rightsidebar/Rightsidebar";
const Question = ({ slidein }) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <Homemainbar />
        <Rightsidebar />
      </div>
    </div>
  );
};

export default Question;
