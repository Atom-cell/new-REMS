import React from "react";
import axios from "axios";
import Payments from "./Payments";
import { Table, Spinner, Row, Col } from "react-bootstrap";
import { Chip } from "@mui/material";

const TodayTasks = () => {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [projects, setProjects] = React.useState();
  const [boards, setBoards] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const fetchData = async () => {
    if (user.role === "Employee") {
      const res = await axios.get("/myProjects/employeeprojects", {
        params: { userId: user._id },
      });
      // console.log("Projects:  ", res.data);
      setProjects(
        res.data.filter((r) => r.status === "atrisk" || r.status === "offtrack")
      );
      getBoards(
        res.data.filter((r) => r.status === "atrisk" || r.status === "offtrack")
      );
    }
  };

  const getBoards = async (projects) => {
    // let filterBoards = [];
    await axios
      .get("http://localhost:5000/report/onlymyboards", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("BOARDS:  ", response.data);
        console.log("Projects: ", projects);

        let projectID = projects?.map((p) => p._id);
        let newBoards = [];

        let boards = [...response.data];
        boards?.forEach((b) => {
          if (projectID?.includes(b.projectId)) {
            newBoards.push(b);
          }
        });

        console.log("new boards: ", newBoards);
        setBoards([...newBoards]);
        setLoading(false);
        // filterBoards = [...newBoards];
      });

    // let newProjects = [];
    // projects.forEach((p) => {
    //   filterBoards.forEach((b) => {
    //     if (p._id === b.projectId) newProjects.push({ ...p, ...b });
    //   });
    // });
    // console.log("NEW PROEJCTS: ", newProjects);
  };

  //kitne tasks complete hue kitne assigned they
  const getProjectProgress = (id, name) => {
    let completed = 0;
    let assinged = 0;

    boards.forEach((b) => {
      if (b.projectId === id) {
        b.boards?.forEach((cards) => {
          cards.cards?.forEach((a) => {
            if (a.assignedTo === user?._id) assinged += a.tasks.length;
            a.tasks.forEach((tasks) => {
              if (tasks.completed) completed++;
            });
          });
        });
      }
    });

    // newBoards.forEach((b) => {
    //   b?.forEach((cards) => {
    //     cards.cards?.forEach((a) => {
    //       if (a.assignedTo === name) {
    //         empcards.push(a.tasks);
    //         assigned += a.tasks.length;
    //         a.tasks.forEach((tasks) => {
    //           if (tasks.completed) completed++;
    //         });
    //       }
    //     });
    //   });
    // });

    let progress = completed / assinged;
    if (isNaN(progress)) return `${0}/${0}`;
    else if (progress === 0) return `${0}/${0}`;
    else return `${completed}/${assinged}`;
  };
  return (
    <div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner animation="grow" />
        </div>
      ) : (
        <Row>
          <Col md={5}>
            <h3 style={{ marginTop: "1em" }}>Tasks & Projects</h3>
            <div className="table all-meetings-table-container">
              <Table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map((p, i) => {
                    return (
                      <tr key={i}>
                        <td>{p.projectName}</td>
                        <td>
                          {p.status === "atrisk" ? (
                            <Chip
                              sx={{ backgroundColor: "#f1bd6c" }}
                              label={p.status}
                            />
                          ) : p.status === "offtrack" ? (
                            <Chip
                              sx={{ backgroundColor: "#de5f73" }}
                              label={p.status}
                            />
                          ) : null}
                        </td>
                        <td>{getProjectProgress(p._id, p.projectName)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={7}>
            <Payments />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TodayTasks;
