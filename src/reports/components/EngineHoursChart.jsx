import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const EngineHoursChart = ({ data, cardStyle }) => {
  const chartData = data.map(item => ({
    date: item.date,
    engineHours: parseFloat(item.engineHours) / (1000 * 60 * 60), // Convert ms to hours
  }));

  return (
    <div style={cardStyle}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
        ساعات فعالیت موتور گروه‌  (۱۰ روز اخیر)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorEngineHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"  stroke="#f88c8cff"/>
          <XAxis dataKey="date" stroke="#555" />
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
            dataKey="engineHours"
            stroke="#e74c3c"
            fill="url(#colorEngineHours)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngineHoursChart;