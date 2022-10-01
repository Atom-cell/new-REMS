import React from "react";
import { useNavigate } from "react-router-dom";
import AdminTeam from "./AdminTeam";
import EmpTeam from "./EmpTeam";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { Spinner } from "react-bootstrap";
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

const Teams = () => {
  let navigate = useNavigate();

  const [teams, setTeams] = React.useState();
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (localStorage.getItem("role")) {
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("id");
      if (role !== "Employee") {
        getAdminData();
      } else {
        getEmpData(id);
      }
      setRole(role);
    }
  }, []);

  const getAdminData = () => {
    axios
      .get("http://localhost:5000/team/getTeams", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Team DATA: ", response.data.data);
        setTeams([...response.data.data]);
        setLoading(false);
      });
  };

  const getEmpData = (id) => {
    axios
      .get(`http://localhost:5000/team/getMyTeam/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("PROJECSTS DATA: ", response.data.data);
        setTeams([...response.data.data]);
        setLoading(false);
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

    getAdminData();
  };
  return (
    <div style={{ margin: "1em 3em 1em 3em" }}>
      {role !== "Employee" ? (
        loading ? (
          <Spinner animation="border" />
        ) : (
          <AdminTeam teams={teams} confirm={confirm} />
        )
      ) : loading ? (
        <Spinner animation="border" />
      ) : (
        <EmpTeam teams={teams} />
      )}
    </div>
  );
};

export default Teams;
