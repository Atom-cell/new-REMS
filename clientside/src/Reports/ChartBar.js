import React from "react";
import {
  BarChart,
  Bar,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartBar = ({ chartData, xaxis, yaxis }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xaxis} />
        <YAxis>
          <Label
            style={{
              textAnchor: "middle",
              fontSize: "130%",
              fill: "grey",
            }}
            dx={-15}
            angle={270}
            value={"Time (Hrs)"}
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey={yaxis} fill="#82cdff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBar;
