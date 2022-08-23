import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import axios from "axios";

const ShareWork = ({ handleClose, show, project, userEmail }) => {
  const [file, setFile] = useState();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const getFiles = (files) => {
    const type = files.base64.split(";")[0].split(":")[1];
    if (type.includes("pdf")) {
      setFile(files);
    } else {
      toast.info("you can only Upload pdf");
    }
  };

  const handleSendEmail = () => {
    // sender email , receiver email, subject, description, project Name, file
    // console.log(project);
    if (file && subject) {
      const myObj = {
        senderEmail: userEmail,
        receiverUsername: project.projectAssignedBy,
        projectName: project.projectName,
        subject: subject,
        description: description,
        file: file.base64,
        fileName: file.name,
      };
      //   console.log(myObj);
      axios
        .post("/myprojects/sendemail", myObj)
        .then((rec) => console.log("success"))
        .catch((err) => console.log(err));
    } else toast.error("Please Fill All Required Fields");
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Share Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            placeholder="Enter Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="inputTextFields"
          />
          <input
            type="text"
            placeholder="Enter Email Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="inputTextFields"
          />
          <div style={{ marginTop: "10px" }}>
            <FileBase64 multiple={false} onDone={getFiles} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendEmail}>
          Send Email
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareWork;
