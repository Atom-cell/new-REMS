import React from "react";
import { useNavigate } from "react-router-dom";
import AdminTeam from "./AdminTeam";
import EmpTeam from "./EmpTeam";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./Team.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import { baseURL } from "../Request";
import { toast } from "react-toastify";
import { SocketContext } from "../Helper/Context";

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
  const { sock, setSocket } = React.useContext(SocketContext);

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

  //for admin, his created teams will be shown
  const getAdminData = () => {
    axios
      .get(`${baseURL}/team/getTeams`, {
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

  //for emp when he logs, his teams will be shown
  const getEmpData = (id) => {
    axios
      .get(`${baseURL}/team/getMyTeam/${id}`, {
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
      message: "Do you want to delete this team?",
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
    axios.delete(`${baseURL}/team/deleteTeam/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    axios.post(`${baseURL}/notif/deleteTeamNotif/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const Team = teams.filter((t) => t._id === id);

    sock.emit("TeamDelete", {
      teamName: Team[0].teamName,
      members: Team[0].members,
    });

    //toast.info("Team deleted!");
    getAdminData();
  };
  return (
    <div style={{ margin: "1em 3em 1em 3em" }}>
      {role !== "Employee" ? (
        loading ? (
          <Spinner animation="border" style={{ margin: "auto" }} />
        ) : (
          <AdminTeam teams={teams} confirm={confirm} />
        )
      ) : loading ? (
        <Spinner animation="border" style={{ margin: "auto" }} />
      ) : (
        <EmpTeam teams={teams} />
      )}
    </div>
  );
};

export default Teams;
