import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { Button } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import "./Team.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { confirmAlert } from "react-confirm-alert"; // Import

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      margin: "auto",
      width: 65,
      height: 65,
      marginBottom: "1em",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const Teams = () => {
  let navigate = useNavigate();

  const [projects, setProjects] = React.useState();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:5000/team/getTeams", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("PROJECSTS DATA: ", response.data.data);
        setProjects([...response.data.data]);
      });
  };
  const confirm = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Do you want to delete this employee?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteTeam(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const deleteTeam = (id) => {
    axios.delete(`http://localhost:5000/team/deleteTeam/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    getData();
  };
  return (
    <div style={{ margin: "1em 3em 1em 3em" }}>
      <div className="team_create">
        <h1>Teams</h1>
        <Button className="submitbtn" onClick={() => navigate("/createTeam")}>
          <GroupAddOutlinedIcon
            style={{ marginRight: "0.5em", fill: "white" }}
          />
          Create a Team
        </Button>
      </div>
      <div className="team_wrapper">
        {projects?.map((p, index) => {
          if (p.active) {
            return (
              <div
                key={index}
                className="team_container"
                onClick={() => navigate("/teamInfo", { state: { project: p } })}
              >
                <div
                  style={{
                    width: "100%",
                    marginLeft: "-3em",
                    marginTop: "-1em",
                  }}
                >
                  <IconButton onClick={() => confirm(p._id)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </div>
                <Avatar {...stringAvatar(p.teamName)} />
                <h2>{p.teamName}</h2>
                <p style={{ color: "grey", marginTop: "1em" }}>{p.teamDesp}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Teams;
