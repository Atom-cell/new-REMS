import React from "react";
import Chart from "./Charts/Chart";
import FeaturedInfo from "./FeaturedInfo/FeaturedInfo";
import { userData, productivityData } from "./dummyData";
import WidgetSmall from "./Widgets/WidgetSmall";
import WidgetLarge from "./Widgets/WidgetLarge";
import "./dashboard.css";
import TopUsers from "./Charts/TopUsers";
const Dashboard = () => {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userData}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
      <TopUsers data={productivityData} />
      <div className="homeWidgets">
        <WidgetSmall />
        <WidgetLarge />
      </div>
    </div>
  );
};

export default Dashboard;
