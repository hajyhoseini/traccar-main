import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const DeviceActiveChart = ({ groupId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        const today = new Date();
        const requests = [];

        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];

          const url = `http://193.228.90.160:8082/api/reports/summary?groupId=${groupId}&from=${dateStr}T00:00:00.000Z&to=${dateStr}T23:59:59.999Z`;
          requests.push(
            fetch(url, {
              headers: {
                Authorization: "Basic " + btoa("admin3@local.local:123456"),
                Accept: "application/json",
              },
            }).then((res) => res.json())
          );
        }

        const results = await Promise.all(requests);
        const formatted = results.map((day, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (9 - i));

          const faDate = new Intl.DateTimeFormat("fa-IR", {
            month: "2-digit",
            day: "2-digit",
          }).format(date);

          // مدت زمان روشن بودن (به ساعت)
          const durationSec = day.length > 0 ? day[0].engineHours || day[0].duration || 0 : 0;
          const durationHr = (durationSec / 3600).toFixed(1);

          return { date: faDate, hours: durationHr };
        });

        setData(formatted);
      } catch (err) {
        console.error("Error fetching device active time:", err);
      }
    };

    fetchData();
  }, [groupId]);

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #fff8e1, #fff3e0)",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        height: "350px",
        direction: "rtl",
      }}
    >
      <h3 style={{ textAlign: "center", fontSize: 16, marginBottom: 10 }}>
        مدت زمان روشن بودن دستگاه (۱۰ روز اخیر)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff9800" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#555" />
          <YAxis
            stroke="#555"
            label={{
              value: "ساعت",
              angle: -90,
              position: "insideLeft",
              fill: "#555",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff3e0",
              border: "none",
              borderRadius: 8,
            }}
            formatter={(value) => [`${value} ساعت`, "مدت زمان روشن"]}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#ff9800"
            fill="url(#colorActive)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceActiveChart;
