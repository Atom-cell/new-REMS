import React from 'react'
import "./message.css";
import {format} from "timeago.js"
const Message = ({message,own, userPhoto}) => {
  // console.log(own);
  return (
    <div className={own ? "message" : "message own"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={userPhoto}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message