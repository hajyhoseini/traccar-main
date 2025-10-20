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
  // تابع سفارشی برای فرمت کردن تولتیپ
  const customTooltipFormatter = (value, name) => {
    if (name === "deviceOverspeedCount") {
      return [`${Math.floor(value)} بار`, "تعداد سرعت غیرمجاز"];
    }
    return [value, name];
  };

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden" }}>
      <h3 style={{ textAlign: "center", fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        سرعت بیش از حد (10 روز اخیر)
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#f88c8cff" />
            <XAxis 
              dataKey="date" 
              stroke="#555" 
              style={{ fontSize: "14px", fontFamily: "IranSans, sans-serif" }}
              tick={{ fontSize: 12, fill: "#555", textAnchor: "end" }}
            />
            <YAxis 
              stroke="#555" 
              tick={{ dx: -10, fontSize: 12, fill: "#555" }}
              style={{ fontFamily: "IranSans, sans-serif" }}
              tickFormatter={(value) => Math.floor(value)} // نمایش اعداد صحیح در محور Y
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F9FAFB",
                border: "1px solid #99acd2ff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                fontFamily: "IranSans, sans-serif",
                direction: "rtl",
              }}
              itemStyle={{ color: "#1E293B", fontSize: "12px" }}
              labelStyle={{ fontWeight: "bold", color: "#4F46E5" }}
              formatter={customTooltipFormatter}
            />
            <Area
              type="monotone"
              dataKey="deviceOverspeedCount"
              stroke="#f39c12"
              fill="url(#colorRisky)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskyBehaviorChart;