import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { Divider, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Coach = () => {
  let navigate = useNavigate();
  const {
    state: { emp },
  } = useLocation();

  const [strength, setStrength] = React.useState();
  const [weakness, setWeakness] = React.useState();
  const [strengthA, setStrengthA] = React.useState([
    { msg: "very good ddddddddddddddddddddddddddddd", id: 1 },
    { msg: "A++", id: 2 },
    { msg: "GREAT" },
  ]);
  const [weaknessA, setWeaknessA] = React.useState([
    { msg: "Very bad", id: 3 },
    { msg: "F--", id: 4 },
  ]);

  React.useEffect(() => {
    getCoaching();
  }, []);

  const getCoaching = async () => {
    await axios.get(`/admin/getCoaching/${emp._id}`).then((response) => {
      setWeaknessA([...response.data.weakness]);
      setStrengthA([...response.data.strength]);
    });
  };

  const addWeakness = () => {
    axios
      .post(`/admin/coachWeakness/${emp._id}`, { msg: weakness })
      .then((response) => {
        getCoaching();
      });

    setWeakness("");
  };

  const addStrength = () => {
    axios
      .post(`/admin/coachStrength/${emp._id}`, { msg: strength })
      .then((response) => {
        getCoaching();
      });

    setStrength("");
  };

  const deleteStrength = (id) => {
    axios
      .post(`/admin/deleteStrength/${emp._id}/${id}`)
      .then((response) => {
        getCoaching();
      })
      .catch((err) => {});
  };

  const deleteWeakness = (id) => {
    axios
      .post(`/admin/deleteWeakness/${emp._id}/${id}`)
      .then((response) => {
        getCoaching();
      })
      .catch((err) => {});
  };
  return (
    <div>
      <h3 style={{ marginBottom: "1em", marginTop: "1em" }}>
        Strengths & Weaknesses of {emp.username}
      </h3>
      <Divider />

      <Table className="table">
        <thead>
          <tr>
            <th className="thead" style={{ textAlign: "center" }}>
              STRENGTHS
            </th>
            <th className="thead" style={{ textAlign: "center" }}>
              WEAKNESSS
            </th>
          </tr>
        </thead>
        <tbody>
          {strengthA.length > weaknessA.length
            ? strengthA.map((c, i) => {
                let weak = weaknessA[i];
                return (
                  <tr key={i}>
                    <td
                      style={{
                        background: "#89f97a",
                        width: "50%",
                      }}
                    >
                      {c?.msg}
                      {c?.msg ? (
                        <IconButton onClick={() => deleteStrength(c._id)}>
                          <DeleteIcon sx={{ fill: "black" }} />
                        </IconButton>
                      ) : null}
                    </td>
                    <td
                      style={{
                        background: "rgb(252 104 104)",
                        width: "50%",
                        overflowWrapper: "break-word",
                      }}
                    >
                      {weak?.msg}{" "}
                      {weak?.msg ? (
                        <IconButton onClick={() => deleteWeakness(weak._id)}>
                          <DeleteIcon sx={{ fill: "black" }} />
                        </IconButton>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            : weaknessA.map((c, i) => {
                let strength = strengthA[i];
                return (
                  <tr key={i}>
                    <td
                      style={{
                        background: "#89f97a",
                      }}
                    >
                      {strength?.msg}
                      {strength?.msg ? (
                        <IconButton
                          onClick={() => deleteStrength(strength._id)}
                        >
                          <DeleteIcon sx={{ fill: "black" }} />
                        </IconButton>
                      ) : null}
                    </td>
                    <td
                      style={{
                        background: "rgb(252 104 104)",
                      }}
                    >
                      {c?.msg}
                      {c?.msg ? (
                        <IconButton onClick={() => deleteWeakness(c._id)}>
                          <DeleteIcon sx={{ fill: "black" }} />
                        </IconButton>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
          <tr>
            <td style={{ background: "#89f97a" }}>
              <TextField
                sx={{ width: "93%" }}
                id="outlined-basic"
                placeholder="Enter Strength"
                onChange={(e) => setStrength(e.target.value)}
              />
              <IconButton
                sx={{ marginTop: "0.3em" }}
                onClick={() => strength && addStrength()}
              >
                <AddIcon sx={{ fill: "black" }} />
              </IconButton>
            </td>
            <td style={{ background: "rgb(252 104 104)" }}>
              <TextField
                sx={{ width: "93%" }}
                id="standard-basic"
                placeholder="Enter Weakness"
                onChange={(e) => setWeakness(e.target.value)}
              />
              <IconButton
                sx={{ marginTop: "0.3em" }}
                onClick={() => weakness && addWeakness()}
              >
                <AddIcon sx={{ fill: "black" }} />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Coach;
