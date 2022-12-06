import React from "react";
import axios from "axios";
import Time from "./Time";
import { Table, Row, Col, Spinner } from "react-bootstrap";

const Coach = () => {
  const [strengthA, setStrengthA] = React.useState([]);
  const [weaknessA, setWeaknessA] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );

  React.useEffect(() => {
    getCoaching();
  }, []);

  const getCoaching = async () => {
    await axios.get(`/emp/dash/getCoaching/${user._id}`).then((response) => {
      setWeaknessA([...response.data.weakness]);
      setStrengthA([...response.data.strength]);
      setLoading(false);
    });
  };

  return (
    <div>
      <Row>
        <Col md={8}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner animation="grow" />
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: "0.5em", marginTop: "1em" }}>
                Strengths & Weaknesses
              </h3>
              <div style={{ height: "13em", overflow: "auto" }}>
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
                            <tr key={i} style={{ width: "50%" }}>
                              <td
                                style={{
                                  background: "#c7fcc0",
                                  width: "50%",
                                }}
                              >
                                {c?.msg}
                              </td>
                              <td
                                style={{
                                  background: "rgb(255, 177, 177)",
                                  width: "50%",
                                  overflowWrapper: "break-word",
                                }}
                              >
                                {weak?.msg}{" "}
                              </td>
                            </tr>
                          );
                        })
                      : weaknessA.map((c, i) => {
                          let strength = strengthA[i];
                          return (
                            <tr key={i} style={{ width: "50%" }}>
                              <td
                                style={{
                                  background: "#c7fcc0",
                                }}
                              >
                                {strength?.msg}
                              </td>
                              <td
                                style={{
                                  background: "rgb(255, 177, 177)",
                                }}
                              >
                                {c?.msg}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Col>
        <Col>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spinner animation="grow" />
            </div>
          ) : (
            <Time />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Coach;
