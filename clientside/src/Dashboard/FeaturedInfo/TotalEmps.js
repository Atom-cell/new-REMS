import React from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
const TotalEmps = () => {
  const [total, setTotal] = React.useState();
  const [active, setActive] = React.useState(); //online who
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = localStorage.getItem("id");

    await axios
      .get(`/admin/dash/totalEmps/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTotal(response.data.length);
        let online = 0;
        response.data?.forEach((r) => {
          if (r.desktop) online++;
        });
        setActive(online);
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
            <span className="featuredMoney">{total}</span>
          </div>
          <span className="featuredSub">Currently Working</span>
          <span style={{ fontSize: "1.3rem" }}>{active}</span>
        </>
      )}
    </div>
  );
};

export default TotalEmps;
