import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Breadcrumb, Table, Spinner } from "react-bootstrap";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

const TeamInfo = () => {
  const navigate = useNavigate();
  const {
    state: { project },
  } = useLocation();
  console.log(project);
  return (
    <div style={{ margin: "2em" }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/team">Teams</Breadcrumb.Item>
        <Breadcrumb.Item active>{project.teamName}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_create">
        <h1>{project.teamName}</h1>
        <IconButton
          onClick={() =>
            navigate("/createTeam", { state: { project: project } })
          }
        >
          <EditIcon />
        </IconButton>
      </div>
      <p>{project.teamDesp}</p>

      <h3>Team Lead </h3>
      <p>{project.teamLead.username}</p>
      <p>{project.teamLead.email}</p>
      <h3>Members</h3>
      <Table className="table">
        <thead>
          <tr>
            <th className="thead">#</th>
            <th className="thead">Picture</th>
            <th className="thead">Name</th>
            <th className="thead">Email</th>
          </tr>
        </thead>
        <tbody>
          {project.members.map((m, index) => {
            return (
              <tr>
                <td>{index}</td>
                <td>
                  <Avatar src={m.profilePicture} />
                </td>
                <td>{m.username}</td>
                <td>{m.email}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h3>Projects</h3>
    </div>
  );
};

export default TeamInfo;
