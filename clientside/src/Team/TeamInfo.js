import { MoreInfoContext } from "../Helper/Context";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Table } from "react-bootstrap";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { baseURL } from "../Request";

import EditIcon from "@mui/icons-material/Edit";
import TeamCalendar from "../Calendar/TeamCalendar";
import ProjectCard from "../Projects/ProjectCard";

const TeamInfo = ({ user }) => {
  const navigate = useNavigate();
  const {
    state: { team },
  } = useLocation();

  const [role, setRole] = React.useState("");
  const [teamProjects, setTeamProjects] = React.useState();
  const { moreInfo, setMoreInfo } = React.useContext(MoreInfoContext);

  const handleClickOnProject = (project) => {
    navigate(`/myproject/${project._id}`, {
      state: {
        project: project,
      },
    });
  };

  React.useEffect(() => {
    if (localStorage.getItem("role")) {
      const role = localStorage.getItem("role");

      setRole(role);
    }
  }, []);

  React.useEffect(() => {
    console.log(team.projects);
    // get team.projects array project information
    axios
      .get("/myProjects/teamprojects", {
        params: { teamProjects: team.projects },
      })
      .then((rec) => {
        console.log(rec.data);
        setTeamProjects(rec.data);
      })
      .catch((err) => console.log(err + "at 40 in Team Info"));
  }, []);

  const getEmpData = (id) => {
    if (role === "admin") {
      axios
        .get(`${baseURL}/emp/getEmp/${id}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("Emp DATA: ", response.data);
          if (response.data) {
            setMoreInfo(response.data);
            navigate("/moreInfo");
          }
        });
    }
  };
  return (
    <div style={{ margin: "2em" }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/team">Teams</Breadcrumb.Item>
        <Breadcrumb.Item active>{team.teamName}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_create">
        <h1 style={{ borderBottom: "1px solid black" }}>{team.teamName}</h1>
        {role !== "Employee" ? (
          <IconButton
            onClick={() => navigate("/createTeam", { state: { team: team } })}
          >
            <EditIcon />
          </IconButton>
        ) : null}
      </div>
      <p>{team.teamDesp}</p>

      <h3>Team Lead </h3>

      <Table className="table">
        <thead>
          <tr>
            <th className="thead">Picture</th>
            <th className="thead">Name</th>
            <th className="thead">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{ cursor: "pointer" }}
              onClick={() => getEmpData(team.teamLead._id)}
            >
              <Avatar src={team.teamLead.profilePicture} />
            </td>
            <td
              style={{ cursor: "pointer" }}
              onClick={() => getEmpData(team.teamLead._id)}
            >
              {team.teamLead.username}
            </td>
            <td
              style={{ cursor: "pointer" }}
              onClick={() => getEmpData(team.teamLead._id)}
            >
              {team.teamLead.email}
            </td>
          </tr>
        </tbody>
      </Table>
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
          {team.members.map((m, index) => {
            return (
              <tr>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => getEmpData(m._id)}
                >
                  {index}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => getEmpData(m._id)}
                >
                  <Avatar src={m.profilePicture} />
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => getEmpData(m._id)}
                >
                  {m.username}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => getEmpData(m._id)}
                >
                  {m.email}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h3>Projects</h3>
      <div className="allProjects">
        {teamProjects?.map((project, index) => {
          return (
            <ProjectCard project={project} setProjects={handleClickOnProject} />
          );
        })}
      </div>
      <div className="team-calendar">
        <h3>Team Calendar</h3>
        <TeamCalendar user={user} teamId={team._id} />
      </div>
    </div>
  );
};

export default TeamInfo;
