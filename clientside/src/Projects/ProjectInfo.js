import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FileBase64 from "react-file-base64";
import ProjectCard from "./ProjectCard";
import { Button } from "@material-ui/core";
import { Table } from "react-bootstrap";
import axios from "axios";
import UploadMilestoneFile from "./UploadMilestoneFile";
import ShareWork from "./ShareWork";

const ProjectInfo = ({ user, project, setProjects, width, setWidth }) => {
  const [projectFiles, setProjectFiles] = useState();

  const [show, setShow] = useState(false);
  const [showw, setShoww] = useState(false);

  const handleClosee = () => setShoww(false);
  const handleShoww = () => setShoww(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckBoxChange = (e, pf) => {
    axios
      .post("/myprojects/markprojectcompletion", {
        projectId: project._id,
        projectFileId: pf._id,
        completed: e.target.checked,
      })
      .then((rec) => {
        findMax(rec.data.projectFiles);
        if (e.target.checked) {
          toast.info(`${pf.completionPercentage} marked completed`);
        } else toast.info(`${pf.completionPercentage} marked Incompleted`);
      })
      .catch((err) => console.log(err));
    // }
  };

  const findMax = (pf) => {
    const completeTrue = pf.filter((pf) => pf.completed == true);
    const cp = completeTrue.map((ct) => ct.completionPercentage);
    const max = Math.max(...cp);
    if (Number.isFinite(max)) setWidth(`${max}%`);
    // else setWidth("0");
  };

  useEffect(() => {
    const order = ["30", "60", "100"];
    setProjectFiles(
      project?.projectFiles.sort(
        (x, y) =>
          order.indexOf(x.completionPercentage) -
          order.indexOf(y.completionPercentage)
      )
    );
  }, []);

  return (
    <div>
      {/* Display all project details */}
      {/* Display pdf as well */}
      {/* update The project */}
      {/* share work regarding milestones */}
      {/* If Employer accepts the file then milestone reached and update progress */}
      <div style={{ width: "30%", float: "left" }}>
        <ProjectCard
          project={project}
          setProjects={setProjects}
          check={true}
          widthh={width}
        />
      </div>
      <div
        style={{
          width: "70%",
          float: "right",
        }}
      >
        <div className="header">
          <h2>{project?.projectName}</h2>
        </div>
        {/* <div className="description">
          <p>{project.projectDescription}</p>
        </div> */}
        {user?.role == "Employee" && (
          <>
            <Button
              variant="contained"
              color="secondary"
              style={{ float: "right", margin: "10px" }}
              onClick={handleShow}
            >
              Upload MileStone
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ float: "right", margin: "10px" }}
              onClick={handleShoww}
            >
              Email
            </Button>
            {show && (
              <UploadMilestoneFile
                project={project}
                show={show}
                handleClose={handleClose}
              />
            )}
            {showw && (
              <ShareWork
                handleClose={handleClosee}
                show={showw}
                project={project}
                userEmail={user.email}
              />
            )}
          </>
        )}
        {/* Show all the pdf uploaded for the given project */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File Name</th>
              <th>File</th>
              <th>Milestone</th>
              {user?.role == "admin" && <th>Mark</th>}
              {user?.role == "Employee" && <th>Completed</th>}
            </tr>
          </thead>
          <tbody>
            {projectFiles?.map((pf) => {
              return (
                <tr>
                  <td>{pf.fileName}</td>
                  <td>
                    <a href={pf.file} download={pf.fileName}>
                      Download
                    </a>
                  </td>
                  <td>{pf.completionPercentage}</td>
                  {user?.role == "admin" && (
                    <td>
                      {pf.completed ? (
                        <input
                          type="checkbox"
                          name="checkbox"
                          defaultChecked={true}
                          onChange={(e) => handleCheckBoxChange(e, pf)}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name="checkbox"
                          defaultChecked={false}
                          onChange={(e) => handleCheckBoxChange(e, pf)}
                        />
                      )}
                      {/* <label for="checkbox">Completed?</label> */}
                    </td>
                  )}
                  {user.role == "Employee" && (
                    <td>{pf.completed == true ? "true" : "false"}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectInfo;
