import React from "react";
import Robot from "../assets/robot.gif";
import './chat.scss'
export default function Welcome({ user }) {
  return (
    <div className="welcome">
      <img src={Robot} alt="robot GIF" />
      <h1>
        Welcome, <span>{user && user.username ? user.username : ''}</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  )
}
