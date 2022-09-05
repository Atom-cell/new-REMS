import React, { useState } from "react";
import "./fileupload.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
const FileUpload = ({ file, setFile }) => {
  const getFiles = async (e) => {
    console.log("hello");
    const filee = e.target.files[0];
    const base64 = await convertBase64(filee);
    setFile({ name: filee.name, base64: base64 });
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  return (
    <div className="btn-file-container">
      <span class="btn-file">
        <FileUploadIcon />
        <input
          className="send-message-icon"
          type="file"
          onChange={(e) => {
            getFiles(e);
          }}
        />
      </span>
    </div>
  );
};

export default FileUpload;
