import React, { useState } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import ShareWork from "./ShareWork";

const ProjectCard = ({
  project,
  volunteer,
  handleVolunteerClick,
  role,
  userEmail,
}) => {
  var {
    projectName,
    projectAssignedBy,
    projectDescription,
    projectCost,
    projectAssignedTo,
    hoursWorked,
    dueDate,
    milestones,
    completed,
    helpingMaterial,
    fileName,
  } = project;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const downloadPDF = (pdf) => {
    const linkSource = pdf;
    const downloadLink = document.createElement("a");
    if (!fileName) fileName = "vct_illustration.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <div className="project-column">
      {volunteer == false && (
        <Button
          variant="contained"
          color="secondary"
          style={{ float: "right", marginTop: "25px", marginRight: "50px" }}
          onClick={() => handleVolunteerClick(project)}
        >
          Volunteer
        </Button>
      )}
      <div className="featuredItem">
        <span className="featuredTitle">{projectName}</span>
        <div className="assigned-by">
          <span className="featuredSub">Assigned By: </span>
          <span className="featuredTitle">{projectAssignedBy}</span>
        </div>
        {projectAssignedTo && (
          <div className="assigned-to">
            <span className="featuredSub">Assigned To: </span>
            <span className="featuredTitle">{projectAssignedTo}</span>
          </div>
        )}
        <div className="project-description">
          <span className="featuredSub">Description: </span>
          <span>{projectDescription}</span>
        </div>
        <div className="project-description">
          <span className="featuredSub">Cost: </span>
          <span>$ {projectCost}</span>
        </div>
        <div className="helping-material">
          <div
            className="menu"
            style={{
              backgroundImage: `url(https://w7.pngwing.com/pngs/415/881/png-transparent-computer-icons-pdf-others-text-rectangle-logo.png)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100px",
              float: "right",
            }}
            onClick={() => downloadPDF(helpingMaterial)}
          ></div>
        </div>
        <div className="hours-worked">
          <span className="featuredSub">Hours Worked: </span>
          <span>{hoursWorked}</span>
        </div>
        <div className="due-date">
          <span className="featuredSub">Due Date: </span>
          {typeof dueDate == "string" ? (
            <span>{dueDate.slice(0, 10)}</span>
          ) : (
            <span>{dueDate.toString().slice(3, 15)}</span>
          )}
        </div>
        {role == "Employee" && (
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "10px" }}
            onClick={handleShow}
          >
            Share Work
          </Button>
        )}
        <div className="progress">
          {completed == "Completed" ? (
            <div
              className="progress-done"
              style={{ opacity: "1", width: "100%" }}
            >
              100%
              {/* {milestones} */}
            </div>
          ) : (
            <div
              className="progress-done"
              style={{ opacity: "1", width: "30%" }}
            >
              30%
              {/* {milestones} */}
            </div>
          )}
        </div>
      </div>
      {show && (
        <ShareWork
          handleClose={handleClose}
          show={show}
          project={project}
          userEmail={userEmail}
        />
      )}
    </div>
  );
};

export default ProjectCard;
