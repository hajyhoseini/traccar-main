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

// ضریب تبدیل گره به کیلومتر بر ساعت
const KNOTS_TO_KMH = 1.852;

// تابع برای تبدیل داده‌های سرعت به کیلومتر بر ساعت
const convertToKmh = (data) => {
  return data.map(item => ({
    ...item,
    avgSpeed: item.avgSpeed * KNOTS_TO_KMH // تبدیل سرعت
  }));
};

const SpeedChart = ({ data, cardStyle }) => {
  // تبدیل داده‌ها به کیلومتر بر ساعت
  const convertedData = convertToKmh(data);

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden" }}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        میانگین سرعت گروه‌ (۱۰ روز اخیر) - کیلومتر بر ساعت
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={convertedData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#28a745" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#28a745" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#8fdaa0ff" />
            <XAxis 
              dataKey="date" 
              stroke="#555" 
              style={{ fontFamily: "IranSans, sans-serif" }}
              tick={{ fontSize: 12, fill: "#555", textAnchor: "end" }}
            />
            <YAxis 
              stroke="#555" 
              style={{ fontFamily: "IranSans, sans-serif", zIndex: 1 }}
              tick={{ dx: -10, fontSize: 12, fill: "#555" }}
              label={{ value: "km/h", angle: -90, position: "insideLeft", style: { fontFamily: "IranSans, sans-serif", fill: "#555" } }}
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
              formatter={(value, name) => [`${value.toFixed(2)} km/h`, "سرعت میانگین"]} // تغییر نام به "سرعت میانگین"
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
    </div>
  );
};

export default SpeedChart;