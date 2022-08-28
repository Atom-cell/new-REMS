import axios from "axios";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";

const UploadMilestoneFile = ({ project, show, handleClose }) => {
  const [file, setFile] = useState();
  const [milestonePercentage, setMilestonePercentage] = useState();

  const getFiles = (files) => {
    setFile(files);
  };
  const handleShareFile = () => {
    if (file) {
      const type = file.base64.split(";")[0].split(":")[1];
      if (type.includes("pdf")) {
        const myObj = {
          projectId: project._id,
          fileObj: {
            file: file.base64,
            fileName: file.name,
            completionPercentage: milestonePercentage || "30",
            completed: false,
          },
        };
        axios
          .post("/myprojects/uploadmilestonefile", myObj)
          .then((rec) => {
            toast.success("File Uploaded");
            setFile();
            handleClose();
          })
          .catch((err) => console.log(err));
      } else {
        toast.error("you can only Upload pdf");
      }
    } else toast.error("Please Select a file");
  };

  return (
    <div className="upload-progress">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload MileStone File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileBase64 multiple={false} onDone={getFiles} />
          <select
            name=""
            id=""
            value={milestonePercentage}
            onChange={(e) => setMilestonePercentage(e.target.value)}
          >
            <option value="30">30%</option>
            <option value="60">60%</option>
            <option value="100">100%</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShareFile}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadMilestoneFile;
