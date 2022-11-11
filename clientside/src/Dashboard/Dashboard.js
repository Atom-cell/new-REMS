import React, { useEffect } from "react";
import { ProjectNameContext } from "../Helper/Context";
import Chart from "./Charts/Chart";
import FeaturedInfo from "./FeaturedInfo/FeaturedInfo";
import { userData, productivityData } from "./dummyData";
import WidgetSmall from "./Widgets/WidgetSmall";
import WidgetLarge from "./Widgets/WidgetLarge";
import "./dashboard.css";
import TopUsers from "./Charts/TopUsers";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../Helper/Context";
import io from "socket.io-client";

const Dashboard = () => {
  const { name, setName } = React.useContext(ProjectNameContext);
  const { sock, setSocket } = React.useContext(SocketContext);

  // useEffect(() => {
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   let role = localStorage.getItem("role");
  //   if (role === "Employee" && !user.desktop) {
  //     alert("Please Login from desktop first.");
  //     localStorage.clear();
  //     navigate("/");
  //   }
  // }, []);
  const ab = async () => {
    let id = localStorage.getItem("id");
    await axios
      .get(`/notif/getNotif/${id}`)
      .then((resp) => console.log(resp.data));
  };

  const realTime = () => {
    const id = "628600c5bfaa78c7d2eb29d4";

    sock.emit("test", { data: "hello", id: id });
  };
  return (
    <div className="home">
      <button onClick={() => ab()}>Socket</button>
      <button onClick={() => realTime()}>LIVE Notification</button>
      <FeaturedInfo />
      {/* <Chart
        data={userData}
        title="User Analytics"
        grid
        dataKey="Active User"
      /> */}
      <TopUsers data={productivityData} />
      <div className="homeWidgets">
        <WidgetSmall />
        <WidgetLarge />
      </div>
    </div>
  );
};

export default Dashboard;
