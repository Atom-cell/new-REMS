import React from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import { Button } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import "./Team.css";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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

const AdminTeam = ({ teams, confirm }) => {
  let navigate = useNavigate();

  return (
    <div>
      <>
        <div className="team_create">
          <h1>Teams</h1>
          <Button
            className="submitbtn"
            onClick={() => navigate("/createTeam", { state: { team: null } })}
          >
            <GroupAddOutlinedIcon
              style={{ marginRight: "0.5em", fill: "white" }}
            />
            Create a Team
          </Button>
        </div>
        <div className="team_wrapper">
          {teams?.map((p, index) => {
            // console.log("team: ", p);
            if (p.teamLead !== null) {
              return (
                <div key={index} className="team_show_div">
                  <div className="delete_div">
                    <IconButton
                      sx={{ margin: 0, padding: 0 }}
                      onClick={() => confirm(p._id)}
                    >
                      <DeleteOutlineOutlinedIcon sx={{ marginLeft: "-1em" }} />
                    </IconButton>
                    <span style={{ marginRight: "-1em" }}>
                      <GroupOutlinedIcon />
                      {p.members.length}
                    </span>
                  </div>
                  <Avatar {...stringAvatar(p.teamName)} />
                  <h2>{p.teamName}</h2>
                  <p style={{ color: "grey", marginTop: "1em" }}>
                    {p.teamDesp}
                  </p>
                  <span>
                    <IconButton
                      sx={{ margin: 0, padding: 0 }}
                      onClick={() =>
                        navigate("/teamInfo", { state: { team: p } })
                      }
                    >
                      <ArrowForwardIcon sx={{ marginLeft: "-1em" }} />
                    </IconButton>
                  </span>
                </div>
              );
            }
          })}
        </div>
      </>
    </div>
  );
};

export default AdminTeam;
