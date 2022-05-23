import React from "react";
import { Avatar } from "@mui/material";
import { Table, Button, Row, Container, Col, Spinner } from "react-bootstrap";

function MoreInfo() {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let a = await JSON.parse(localStorage.getItem("info"));
    // if (a.screenshot && a.appTime && a.totalTime) {
    console.log(a.totalTime);
    // let times = a.totalTime;
    // times.map(function (time) {
    //   return console.log(time.activetime);
    // });
    setLoading(false);
    setData(a);
  };

  return (
    <div className="cnt">
      <h1>{data.username} Information</h1>
      <Avatar
        srs="https://i.stack.imgur.com/34AD2.jpg"
        sx={{ width: 120, height: 120, marginBottom: "10px" }}
      />
      <h5>
        Username: <span> {data.username} </span>{" "}
      </h5>
      <h5>
        Email: <span> {data.email}</span>{" "}
      </h5>
      <h5>
        Role: <span> {data.role} </span>{" "}
      </h5>
      <h5>
        Contact: <span> {data.contact ? data.contact : "-"}</span>{" "}
      </h5>
      <h5>
        Bank Details: <span> {data.bankDetails ? data.bankDetails : "-"} </span>{" "}
      </h5>
      <div>
        <h5>Screen Shots</h5>
        {loading ? (
          <div className="spinner">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row>
            {data.screenshot.map((i, index) => {
              return (
                <Col sm={3} key={index}>
                  <div
                    style={{
                      marginBottom: "15px",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${i}`}
                      width="300"
                      height="150"
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
      <h5>
        Active Time:
        <span>
          {loading ? (
            <div className="spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            data.totalTime.map(function (time, index) {
              return (
                time.date.slice(0, 10) +
                " " +
                time.activetime.Hours +
                " : " +
                time.activetime.Minutes +
                " : " +
                time.activetime.Seconds
              );
            })
          )}
        </span>
      </h5>
      <h5>
        Idle Time:{" "}
        <span>
          {loading ? (
            <div className="spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            data.totalTime.map(function (time, index) {
              return (
                time.date.slice(0, 10) +
                " " +
                time.idletime.Hours +
                " : " +
                time.idletime.Minutes +
                " : " +
                time.idletime.Seconds
              );
            })
          )}
        </span>
      </h5>
      <h5> Apps & Websites</h5>
      {loading ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover bordered className="table">
          <thead>
            <tr>
              <th className="thead">#</th>
              <th className="thead">Window Title</th>
              <th className="thead">Time in S</th>
            </tr>
          </thead>
          <tbody>
            {data.appTime.map(function (time) {
              return Object.entries(time.apps).map(function (
                [key, value],
                index
              ) {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default MoreInfo;
