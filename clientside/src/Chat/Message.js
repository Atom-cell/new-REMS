import React, { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import AttachmentIcon from "@mui/icons-material/Attachment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
const Message = ({ message, own, userPhoto }) => {
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
      <div className="messageTop">
        <img className="messageImg" src={userPhoto} alt="" />
        <div className="messageText">
          {message.Image && (
            <div className="messageFile">
              <div className="attachment-icon">
                <AttachmentIcon />
              </div>
              <div className="message-file-name">
                <a href={message.Image.image} download={message.Image.name}>
                  {message.Image.name.length > 25
                    ? `${message.Image.name.substring(0, 25)}....`
                    : message.Image.name}
                </a>
              </div>
              <div className="download-icon">
                <a href={message.Image.image} download={message.Image.name}>
                  <FileDownloadIcon />
                </a>
              </div>
            </div>
          )}
          <p>{message.text}</p>
        </div>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
