import React, { PureComponent } from "react";
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
  return (
    <div className="chart">
      <h3 className="chartTitle">Top Users</h3>
      <ComposedChart
        layout="vertical"
        width={800}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" scale="band" />
        <Tooltip />
        <Legend />
        {/* <Area dataKey="amt" fill="#8884d8" stroke="#8884d8" /> */}
        <Bar dataKey="productivity" barSize={20} fill="#413ea0" />
        {/* <Line dataKey="Active User" stroke="#ff7300" /> */}
      </ComposedChart>
    </div>
  );
};

export default TopUsers;
