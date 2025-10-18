import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RiskyBehaviorChart = ({ data, cardStyle }) => {
  return (
    <div style={cardStyle}>
      <h3 style={{ textAlign: "center", fontSize: 16, marginBottom: 10 }}>
        سرعت بیش از حد (10 روز اخیر){" "}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorRisky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f39c12" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e8bf7bff" />
          <XAxis dataKey="date" stroke="#555" style={{ fontSize: "14px" }} />
          <YAxis stroke="#555" tick={{ dx: -10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #99acd2ff",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
            itemStyle={{ color: "#1E293B", fontSize: "12px" }}
            labelStyle={{ fontWeight: "bold", color: "#4F46E5" }}
          />
          <Area
            type="monotone"
            dataKey="overspeedCount"
            stroke="#f39c12"
            fill="url(#colorRisky)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskyBehaviorChart;
