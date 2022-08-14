import React from "react";

const ProjectCard = ({ project }) => {
  const {
    projectName,
    projectAssignedBy,
    projectDescription,
    projectAssignedTo,
    hoursWorked,
    dueDate,
    milestones,
    completed,
  } = project;
  return (
    <div className="project-column">
      <div className="featuredItem">
        <span className="featuredTitle">{projectName}</span>
        <div className="assigned-by">
          <span className="featuredSub">Assigned By: </span>
          <span className="featuredTitle">{projectAssignedBy}</span>
        </div>
        <div className="assigned-to">
          <span className="featuredSub">Assigned To: </span>
          <span className="featuredTitle">{projectAssignedTo}</span>
        </div>
        <div className="project-description">
          <span className="featuredSub">Description: </span>
          <span>{projectDescription}</span>
        </div>
        <div className="helping-material">
          <span>PDF File</span>
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
    </div>
  );
};

export default ProjectCard;
