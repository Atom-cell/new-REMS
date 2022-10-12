import React from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import { Button } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import "./Team.css";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
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

const EmpTeam = ({ teams }) => {
  let navigate = useNavigate();
  const [id, setId] = React.useState("");

  React.useEffect(() => {
    if (localStorage.getItem("id")) {
      const id = localStorage.getItem("id");

      setId(id);
    }
  }, []);

  return (
    <div>
      <>
        <div className="team_create">
          <h1>Teams</h1>
        </div>
        <div className="team_wrapper">
          {teams?.map((p, index) => {
            if (p.active) {
              return (
                <div
                  key={index}
                  className="team_show_div"
                  id={id === p.teamLead._id ? "lead_div" : ""}
                  onClick={() => navigate("/teamInfo", { state: { team: p } })}
                >
                  <div className="delete_div">
                    <IconButton sx={{ margin: 0, padding: 0 }}></IconButton>
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
                </div>
              );
            }
          })}
        </div>
      </>
    </div>
  );
};

export default EmpTeam;
