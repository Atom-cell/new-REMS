import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import React from "react";
const Chart = ({ title, data, dataKey, grid }) => {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <LineChart width={800}
        height={400}
        data={data}
        margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
        >
        <XAxis dataKey="name" stroke="#5550bd" />
        <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
        <Tooltip />
        {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
      </LineChart>
    </div>
  );
};

export default Chart;
