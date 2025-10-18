import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const SpeedChart = ({ data, cardStyle }) => {
  return (
    <div style={cardStyle}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
        میانگین سرعت گروه‌  (۱۰ روز اخیر)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#28a745" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#28a745" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#555" />
          <YAxis stroke="#555" style={{ zIndex: 1 }} tick={{ dx: -30 }} />
          <CartesianGrid strokeDasharray="3 3"  stroke="#8fdaa0ff"/>
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
            dataKey="avgSpeed"
            stroke="#28a745"
            fill="url(#colorSpeed)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedChart;