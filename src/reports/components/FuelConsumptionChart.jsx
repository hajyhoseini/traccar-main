import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FuelConsumptionChart = ({ data, cardStyle }) => {
  const chartData = data.map((d) => ({
    date: d.date,
    fuelConsumption: d.fuelConsumption || 0,
  }));

  // تابع سفارشی برای فرمت کردن تولتیپ
  const customTooltipFormatter = (value, name) => {
    if (name === 'fuelConsumption') {
      return [`${value} لیتر`, 'مصرف سوخت'];
    }
    return [value, name];
  };

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden" }}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        مصرف سوخت (لیتر)
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f88c8cff" />
            <XAxis
              dataKey="date"
              stroke="#555"
              interval="preserveStartEnd"
              style={{
                fontSize: "12px",
                fontFamily: "IranSans, sans-serif",
              }}
              tick={{ 
                fill: "#555",
                fontSize: 12,
                textAnchor: "end",
                dx: 5 // جابجایی برای RTL
              }}
            />
            <YAxis
              stroke="#555"
              style={{
                fontFamily: "IranSans, sans-serif",
              }}
              tick={{ dx: -10, fontSize: 12, fill: "#555" }}
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
            <Line
              type="monotone"
              dataKey="fuelConsumption"
              stroke="#e74c3c" // رنگ قرمز زنده
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
              strokeWidth={2}
              dot={{ r: 1.75, fill: "#e74c3c" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelConsumptionChart;