import React, { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
const Message = ({ message, own, userPhoto }) => {
  // console.log(own);
  const [extension, setExtension] = useState();
  const getExtension = (file) => {
    const type = file.split(";")[0].split(":")[1];
    console.log(type);
    setExtension(type);
  };
  useEffect(() => {
    if (message.image) {
      getExtension(message.image);
    }
  }, []);

  return (
    <div className={own ? "message" : "message own"}>
      <div>
        {message.image && extension == "application/pdf" && (
          // <iframe src={message.image}></iframe>
          <object
            data={message.image}
            type="application/pdf"
            width="80%"
            height="300px"
          >
            <p>
              Your web browser doesn't have a PDF plugin.
              {/* <a href={message.image}>click here to download the PDF file.</a> */}
            </p>
          </object>
        )}
        {message.image && extension?.includes("image") && (
          <img
            src={message.image}
            style={{ width: "80%", height: "300px" }}
            alt="Photo not available right now"
          />
        )}

        {message.image && extension?.includes("video") && (
          <video src={message.image} controls></video>
        )}
      </div>
      <div className="messageTop">
        <img className="messageImg" src={userPhoto} alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
