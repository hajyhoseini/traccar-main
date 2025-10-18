import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const TemperatureChart = ({ cardStyle }) => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=35.6892&longitude=51.3890&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Tehran'
        );
        const data = await response.json();
        const formatted = data.daily.time.map((t, i) => ({
          date: new Intl.DateTimeFormat('fa-IR', {
            month: '2-digit',
            day: '2-digit'
          }).format(new Date(t)),
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
        }));
        setTemperatureData(formatted.slice(-10));
      } catch (err) {
        console.error('Error fetching temperature data:', err);
      }
    };

    fetchTemperatureData();
  }, []);

  return (
    <div style={cardStyle}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
        دمای هوا در تهران (در هفته پیش رو)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={temperatureData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#69b1ff" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"  stroke="#aaa5a5ff" />
          <XAxis dataKey="date" stroke="#555" />
          <YAxis stroke="#555" tick={{ dx: -15 }} />
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
          <Line
            type="monotone"
            dataKey="max"
            stroke="#ff4d4f"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#69b1ff"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;