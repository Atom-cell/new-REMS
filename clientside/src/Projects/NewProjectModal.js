import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
const NewProjectModal = ({ handleClose, show }) => {
  const [check, setCheck] = useState();
  const [type, setType] = useState();
  const getFiles = (files) => {
    const type = files.base64.split(";")[0].split(":")[1];
    setType(type);
    // console.log(type);
    if (
      type.includes("image") ||
      type.includes("video") ||
      type.includes("pdf")
    ) {
      setCheck(files.base64);
    } else {
      toast.info("you can only send image or pdf or video");
    }
  };
  return (
    <Modal show={show} fullscreen={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            placeholder="Enter Project Name"
            // value={newEvent.title}
            // onChange={(e) =>
            //   setNewEvent({ ...newEvent, title: e.target.value })
            // }
            className="inputTextFields"
          />
          <input
            type="text"
            placeholder="Enter Project Description"
            // value={newEvent.title}
            // onChange={(e) =>
            //   setNewEvent({ ...newEvent, title: e.target.value })
            // }
            className="inputTextFields"
          />
          <DatePicker
            placeholderText="Due Date"
            // selected={newEvent.start}
            // onChange={(start) => setNewEvent({ ...newEvent, start: start })}
            dateFormat="MM/dd/yyyy"
            className="inputTextFields"
            minDate={new Date()}
          />
          <input
            type="text"
            placeholder="Set Milestones"
            // value={newEvent.title}
            // onChange={(e) =>
            //   setNewEvent({ ...newEvent, title: e.target.value })
            // }
            className="inputTextFields"
          />
          <input
            type="text"
            placeholder="Assign Project"
            // value={newEvent.title}
            // onChange={(e) =>
            //   setNewEvent({ ...newEvent, title: e.target.value })
            // }
            className="inputTextFields"
          />
          <div>
            <FileBase64 multiple={false} onDone={getFiles} />
            {check && type.includes("image") && (
              <img
                src={check}
                alt="No Image"
                style={{
                  width: "100px",
                  height: "60px",
                  marginTop: "5px",
                }}
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Create Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProjectModal;
