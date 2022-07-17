import React, { useEffect } from "react";
import Chart from "./Charts/Chart";
import FeaturedInfo from "./FeaturedInfo/FeaturedInfo";
import { userData, productivityData } from "./dummyData";
import WidgetSmall from "./Widgets/WidgetSmall";
import WidgetLarge from "./Widgets/WidgetLarge";
import "./dashboard.css";
import TopUsers from "./Charts/TopUsers";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  let navigate = useNavigate();

  // useEffect(() => {
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   let role = localStorage.getItem("role");
  //   if (role === "Employee" && !user.desktop) {
  //     alert("Please Login from desktop first.");
  //     localStorage.clear();
  //     navigate("/");
  //   }
  // }, []);
  
  return (
    <div className="home">
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
