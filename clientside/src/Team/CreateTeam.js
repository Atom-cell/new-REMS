import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { SocketContext } from "../Helper/Context";

import "./Team.css";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Button, Breadcrumb, Table, Spinner } from "react-bootstrap";

// function BPCheckbox({ pro, id }) {
//   if (pro !== null) {
//     const { members } = pro;
//     console.log(members, id);
//     let a = false;
//     members.forEach((m) => {
//       if (m._id === id) a = true;
//       else {
//       }
//     });
//     if (a) return <Checkbox defaultChecked />;
//     else return <Checkbox />;
//   } else return <Checkbox />;
// }
const CreateTeam = () => {
  let navigate = useNavigate();
  const {
    state: { team },
  } = useLocation();
  //   console.log(team);

  const { sock, setSocket } = React.useContext(SocketContext);
  const [teamName, setTeamName] = React.useState("");
  const [teamDesp, setTeamDesp] = React.useState("");
  const [teamLead, setTeamLead] = React.useState("");
  const [oldteamName, setOldTeamName] = React.useState("");
  const [oldteamLead, setOldTeamLead] = React.useState("");
  const [oldmembers, setOldMembers] = React.useState([]);

  const [members, setMembers] = React.useState([]);
  const [error, setError] = React.useState([false, false]);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getEmps();
    if (team) {
      autoFillData();
    }
  }, []);

  const getEmps = async () => {
    await axios
      .get("http://localhost:5000/team/getEmps", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("response from server ", response.data.data);
        setData([...response.data.data]);
        setLoading(false);
      });
  };

  const autoFillData = () => {
    setTeamName(team.teamName);
    setTeamDesp(team.teamDesp);
    setTeamLead(team.teamLead._id);
    setOldTeamName(team.teamName);
    setOldTeamLead(team.teamLead._id);

    const { members } = team;
    const array = members.map((x) => x._id);

    setMembers([...array]);
    setOldMembers([...array]);
  };

  const handleChange = (e) => {
    // Destructuring

    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);
    // Case 1 : The user checks the box
    if (checked) {
      setMembers([...members, value]);
    }

    // Case 2  : The user unchecks the box
    else {
      setMembers(members.filter((e) => e !== value));
    }
  };

  const handleSubmit = async (e) => {
    if (teamName === "" && teamDesp === "") {
      let a = [...error];
      a[0] = true;
      a[1] = true;
      setError(a);
    } else if (teamName === "") {
      let a = [...error];
      a[0] = true;
      a[1] = false;
      setError(a);
    } else if (teamDesp === "") {
      let a = [...error];
      a[0] = false;
      a[1] = true;
      setError(a);
    } else {
      let a = [...error];
      a[0] = false;
      a[1] = false;
      setError(a);
      if (team) {
        uploadEditData();
      } else {
        uploadData();
      }
    }
    e.preventDefault();
  };

  const uploadData = () => {
    members.push(teamLead);
    if (
      error[0] === false &&
      error[1] === false &&
      teamLead !== "" &&
      members.length !== 0
    ) {
      axios
        .post(
          "http://localhost:5000/team/createTeam",
          {
            teamName: teamName,
            teamDesp: teamDesp,
            teamLead,
            members: members,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });

      axios
        .post(
          "http://localhost:5000/notif/teamNotif",
          {
            teamName: teamName,
            teamLead,
            members: members,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });

      sock.emit("TeamAdded", {
        teamName: teamName,
        members: members,
      });
      // toast.info("Team Created Successfully")
      navigate("/team");
    } else {
      alert("Fill all the fields");
    }
  };

  const uploadEditData = () => {
    members.push(teamLead);
    console.log("EDITE: ", {
      id: team._id,
      teamName: teamName,
      teamDesp: teamDesp,
      teamLead,
      members: members,
    });

    if (
      error[0] === false &&
      error[1] === false &&
      teamLead !== "" &&
      members.length !== 0
    ) {
      axios
        .put(
          "http://localhost:5000/team/updateTeam",
          {
            id: team._id,
            teamName: teamName,
            teamDesp: teamDesp,
            teamLead,
            members: members,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });

      axios
        .post(
          "http://localhost:5000/notif/updateTeamNotif",
          {
            teamName: teamName,
            teamLead,
            members: members,
            oldteamName: oldteamName,
            oldteamLead,
            oldmembers: oldmembers,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });

      navigate("/team");
    } else {
      alert("Fill all the fields");
    }
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "2em 0em 1em 2em" }}>
        <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/team">Teams</Breadcrumb.Item>
        <Breadcrumb.Item active>Create New Team</Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_container">
        <div className="name_wrapper">
          <h3>Create a new Team</h3>
          <form action="" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              id="standard-basic"
              error={error[0]}
              label="Team name"
              variant="standard"
              value={teamName}
              helperText={error[0] ? "This can't be blank" : null}
              margin="dense"
              type="text"
              className="ip"
              placeholder="Enter Team Name"
              onChange={(e) => {
                //ResetError();
                setTeamName(e.target.value);
              }}
            />
            <TextField
              id="standard-multiline-static"
              multiline
              rows={4}
              error={error[1]}
              label="Team Description"
              variant="standard"
              value={teamDesp}
              helperText={
                error[1]
                  ? "This can't be blank"
                  : "Tell what this team is about?"
              }
              margin="dense"
              type="text"
              className="ip"
              placeholder="Enter Team Description"
              onChange={(e) => {
                //ResetError();
                setTeamDesp(e.target.value);
              }}
            />

            <FormControl sx={{ width: "50%", marginTop: "2em" }}>
              <InputLabel id="demo-simple-select-label">Team Lead</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={teamLead}
                onChange={(e) => {
                  setTeamLead(e.target.value);
                  handleChange(e);
                }}
              >
                {data.map((data, index) => {
                  return (
                    <MenuItem value={data._id} key={index}>
                      {data.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <div style={{ width: "100%" }}>
              {team ? (
                <Button
                  type="submit"
                  variant="contained"
                  className="submitbtn"
                  style={{ color: "white" }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  className="submitbtn"
                  style={{ color: "white" }}
                >
                  Create
                </Button>
              )}
            </div>
          </form>
        </div>
        <div className="members_wrapper">
          {loading ? (
            <div className="spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table className="table">
              <thead>
                <tr>
                  <th className="thead">#</th>
                  <th className="thead">Name</th>
                  <th className="thead">Email</th>
                </tr>
              </thead>
              <tbody>
                {/* <FormGroup> */}
                {data.map((data, index) => {
                  if (team !== null) {
                    // FOR WHEN EDITING
                    const { members } = team;
                    const array = members.map((x) => x._id);

                    if (array.includes(data._id)) {
                      if (teamLead === data._id) {
                      } else {
                        return (
                          <tr>
                            <td>
                              {
                                <FormControlLabel
                                  key={index}
                                  //control={<BPCheckbox pro={team} id={data._id} />}
                                  control={<Checkbox defaultChecked />}
                                  value={data._id}
                                  onChange={(e) => handleChange(e)}
                                />
                              }
                            </td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                          </tr>
                        );
                      }
                    } else {
                      if (teamLead === data._id) {
                      } else {
                        return (
                          <tr>
                            <td>
                              {
                                <FormControlLabel
                                  key={index}
                                  //control={<BPCheckbox pro={team} id={data._id} />}
                                  control={<Checkbox />}
                                  value={data._id}
                                  onChange={(e) => handleChange(e)}
                                />
                              }
                            </td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                          </tr>
                        );
                      }
                    }
                  } else {
                    //WHEN NEW CREATING
                    if (teamLead === data._id) {
                    } else {
                      return (
                        <tr>
                          <td>
                            {
                              <FormControlLabel
                                key={index}
                                //control={<BPCheckbox pro={team} id={data._id} />}
                                control={<Checkbox />}
                                value={data._id}
                                onChange={(e) => handleChange(e)}
                              />
                            }
                          </td>
                          <td>{data.username}</td>
                          <td>{data.email}</td>
                        </tr>
                      );
                    }
                  }
                })}

                {/* </FormGroup> */}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
