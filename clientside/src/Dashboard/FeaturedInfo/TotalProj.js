import React from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
const TotalProj = () => {
  const [completed, setCompleted] = React.useState();
  const [ontrack, setOnTrack] = React.useState();
  const [atrisk, setAtRisk] = React.useState();
  const [offtrack, setOffTrack] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = localStorage.getItem("id");

    await axios
      .get(`/admin/dash/projects/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        let c = 0;

        let ot = 0;
        let off = 0;
        let a = 0;
        response.data?.forEach((r) => {
          if (r.status === "completed") c++;
          else if (r.status === "ontrack") ot++;
          else if (r.status === "offtrack") off++;
          else if (r.status === "atrisk") a++;
        });

        setCompleted(c);
        setOnTrack(ot);
        setOffTrack(off);
        setAtRisk(a);
        setLoading(false);
      });
  };
  return (
    <div>
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <>
          <div className="featuredMoneyContainer">
            <span className="featuredMoney">{ontrack + offtrack + atrisk}</span>
          </div>
          <span className="featuredSub" style={{ color: "#2be92b" }}>
            Completed
          </span>
          <span
            style={{
              marginRight: "0.2em",
              fontSize: "1.3rem",
              color: "#2be92b",
            }}
          >
            {" "}
            {completed}
          </span>
          <span className="featuredSub" style={{ color: "#f1bd6c" }}>
            At Risk
          </span>
          <span
            style={{
              marginRight: "0.2em",
              fontSize: "1.3rem",
              color: "#f1bd6c",
            }}
          >
            {" "}
            {atrisk}
          </span>
          <span className="featuredSub" style={{ color: "#58a182" }}>
            On Track
          </span>
          <span
            style={{
              marginRight: "0.2em",
              fontSize: "1.3rem",
              color: "#58a182",
            }}
          >
            {" "}
            {ontrack}
          </span>
          <span className="featuredSub" style={{ color: "#de5f73" }}>
            Off Track
          </span>
          <span style={{ fontSize: "1.3rem", color: "#de5f73" }}>
            {" "}
            {offtrack}
          </span>
        </>
      )}
    </div>
  );
};

export default TotalProj;
