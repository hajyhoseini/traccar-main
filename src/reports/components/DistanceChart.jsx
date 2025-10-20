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

const DistanceChart = ({ data, cardStyle }) => {
  // تابع سفارشی برای فرمت کردن تولتیپ
  const customTooltipFormatter = (value, name) => {
    if (name === 'distance') {
      return [`${value} کیلومتر`, 'فاصله طی شده'];
    }
    return [value, name];
  };

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden" }}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        فاصله طی‌شده گروه‌  (۱۰ روز اخیر)
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#007bff" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#96beeaff" />
            <XAxis 
              dataKey="date" 
              stroke="#555" 
              style={{ fontFamily: "IranSans, sans-serif" }}
              tick={{ fontSize: 12, fill: "#555", textAnchor: "end" }}
            />
            <YAxis 
              stroke="#555" 
              tick={{ dx: -10, fontSize: 12, fill: "#555" }}
              style={{ fontFamily: "IranSans, sans-serif" }}
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
              formatter={customTooltipFormatter} // اضافه کردن فرمت‌کننده سفارشی
            />
            <Area
              type="monotone"
              dataKey="distance"
              stroke="#007bff"
              fill="url(#colorDist)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistanceChart;