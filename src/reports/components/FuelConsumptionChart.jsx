import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FuelConsumptionChart = ({ data, cardStyle }) => {
  const chartData = data.map((d) => ({
    date: d.date,
    fuelConsumption: d.fuelConsumption || 0,
  }));

  return (
    <div style={cardStyle}>
         <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
       مصرف سوخت (لیتر)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
          direction="rtl"
        >
          <CartesianGrid strokeDasharray="3 3"  stroke="#f88c8cff" />
          <XAxis
            dataKey="date"
            stroke="#555"
            interval="preserveStartEnd"
            style={{
              fontSize: "12px",
              direction: "rtl",
              fontFamily: "IranSans",
            }}
            tick={{ fill: "#555" }}
          />
          <YAxis
            stroke="#555"
            style={{
              fontFamily: "IranSans",
            }}
            tick={{ dx: -10 }}
          />
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

          {/* <Legend
            // verticalAlign="none"
            height={36}
            wrapperStyle={{
              fontSize: "14px",
              fontFamily: "IranSans",
              color: "#34495e",
            }}
          /> */}
          <Line
            type="monotone"
            dataKey="fuelConsumption"
            stroke="#e74c3c" // رنگ قرمز زنده
            activeDot={{
              r: 6,
              // fill: "#e74c3c",
              // stroke: "#fff",
              strokeWidth: 2,
            }}
            strokeWidth={2}
            dot={{ r: 1.75, fill: "#e74c3c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelConsumptionChart;
