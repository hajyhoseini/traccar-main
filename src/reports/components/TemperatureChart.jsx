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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.daily || !data.daily.time) {
          throw new Error('Invalid API response');
        }
        const formatted = data.daily.time.map((t, i) => {
          const date = new Date(t + 'T00:00:00'); // Ensure full date
          const faDate = new Intl.DateTimeFormat('fa-IR', {
            month: '2-digit',
            day: '2-digit'
          }).format(date);
          return {
            date: faDate,
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
          };
        });
        // 7 روز آینده (API معمولاً 7-16 روز می‌دهد، اول 7 تا را بگیریم)
        setTemperatureData(formatted.slice(0, 7));
      } catch (err) {
        console.error('Error fetching temperature data:', err);
        // داده‌های نمونه داینامیک بر اساس تاریخ فعلی
        const now = new Date();
        const sampleData = [];
        for (let i = 0; i < 7; i++) {
          const futureDate = new Date(now);
          futureDate.setDate(now.getDate() + i);
          const faDate = new Intl.DateTimeFormat('fa-IR', {
            month: '2-digit',
            day: '2-digit'
          }).format(futureDate);
          // مقادیر نمونه تصادفی برای تنوع
          const baseTemp = 25 + (i % 2 === 0 ? 5 : -3); // نوسان ساده
          sampleData.push({
            date: faDate,
            max: baseTemp + Math.floor(Math.random() * 5) + 3,
            min: baseTemp - Math.floor(Math.random() * 5) - 2,
          });
        }
        setTemperatureData(sampleData);
      }
    };

    fetchTemperatureData();
  }, []);

  // تابع سفارشی برای فرمت کردن تولتیپ
  const customTooltipFormatter = (value, name) => {
    switch (name) {
      case 'max':
        return [`${value} °C`, 'حداکثر دما'];
      case 'min':
        return [`${value} °C`, 'حداقل دما'];
      default:
        return [value, name];
    }
  };

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
      <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        دمای هوا در تهران (در هفته پیش رو)
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={temperatureData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#69b1ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f88c8cff" />
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
              formatter={customTooltipFormatter}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke="#ff4d4f"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ff4d4f" }}
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="#69b1ff"
              strokeWidth={2}
              dot={{ r: 3, fill: "#69b1ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;