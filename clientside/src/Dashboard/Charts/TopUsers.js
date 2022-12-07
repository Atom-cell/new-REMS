import React, { PureComponent } from "react";
import axios from "axios";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
const TopUsers = ({ data }) => {
  const [chartArr, setChartArr] = React.useState([]);
  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("/admin/dash/topActive", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // console.log("sssssssss ", response.data.data);
        filterData(response.data.data);
      });
  };

  const filterData = (data) => {
    const day = new Date().getDate();
    let users = [];
    data?.forEach((tt) => {
      let sum = 0;
      tt.totalTime.forEach((t) => {
        if (new Date(t.date).getDate() === day) {
          sum += t.activetime?.Seconds;
        }
      });
      users.push({ username: tt.username, times: (sum / 3600).toFixed(3) });
    });

    // console.log("qqqqqqqqqqqqqqqqqqq, ", users);
    convertDataForChart(users);
  };

  const convertDataForChart = (arr) => {
    let totalEmps = arr.length;
    let sum = 0;

    let chart = [];
    arr?.forEach((a) => {
      sum += parseFloat(a.times);
    });

    let avg = (sum / totalEmps).toFixed(3);
    // console.log("avg: ", avg);
    arr?.forEach((a) => {
      if (parseFloat(a.times) >= avg) chart.push(a);
    });

    // console.log(chart);
    setChartArr([...chart]);
  };
  return (
    <div className="chart">
      <h3 className="chartTitle">Top Active Users</h3>
      <ComposedChart
        layout="vertical"
        width={800}
        height={400}
        data={chartArr}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="username" type="category" scale="band" />
        <Tooltip />
        <Bar dataKey="times" barSize={20} fill="#82cdff" />
      </ComposedChart>
    </div>
  );
};

export default TopUsers;
