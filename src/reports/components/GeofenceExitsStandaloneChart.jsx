import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GeofenceExitsStandaloneChart = ({ selectedGroup, cardStyle }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedGroup) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchGeofenceData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const requests = [];

        // فراخوانی برای ۱۰ روز اخیر
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const fromDate = new Date(date);
          fromDate.setHours(20, 30, 0, 0); // 8:30 PM UTC (مثل کد داشبوردت)
          const toDate = new Date(date);
          toDate.setDate(date.getDate() + 1);
          toDate.setHours(20, 29, 59, 999); // 8:29:59.999 PM UTC next day
          const fromStr = fromDate.toISOString();
          const toStr = toDate.toISOString();
          const url = `/api/reports/events?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}&type=geofenceExit`;

          requests.push(
            fetch(url, {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }).then((res) => {
              if (!res.ok) {
                console.error(
                  `Geofence fetch failed for ${fromStr}:`,
                  res.status,
                  res.statusText
                );
                return [];
              }
              return res.json();
            })
          );
        }

        const results = await Promise.all(requests);
        console.log("Geofence results:", results);

        // فرمت داده‌ها
        const formattedData = [];
        results.forEach((dayEvents, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (9 - i));
          const faDate = new Intl.DateTimeFormat("fa-IR", {
            month: "2-digit",
            day: "2-digit",
          }).format(date);

          const exitCount = dayEvents.length; // همه رویدادها geofenceExit هستن
          formattedData.push({
            date: faDate,
            geofenceExits: exitCount,
          });
        });

        setData(formattedData);
      } catch (err) {
        console.error("Error fetching geofence data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGeofenceData();
  }, [selectedGroup]);

  // اگر در حال لود باشه
  if (loading) {
    return (
      <div
        style={{
          ...cardStyle,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "200px",
          maxHeight: "300px",
          overflow: "hidden",
          fontFamily: "IranSans, sans-serif",
        }}
      >
        <h3
          style={{ textAlign: "center", color: "#1b3148ff", margin: "10px 0", fontFamily: "IranSans, sans-serif", flexShrink: 0 }}
        >
          خروج از حصار جغرافیایی
        </h3>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontFamily: "IranSans, sans-serif" }}>
          در حال بارگیری...
        </div>
      </div>
    );
  }

  // اگر داده‌ای نباشه
  if (!data || data.length === 0) {
    return (
      <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
        <h3
          style={{ textAlign: "center", color: "#1b3148ff", margin: "10px 0", fontFamily: "IranSans, sans-serif", flexShrink: 0 }}
        >
          خروج از حصار جغرافیایی
        </h3>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontFamily: "IranSans, sans-serif" }}>
          داده‌ای موجود نیست
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...cardStyle,
        flex: 1,
        height: "100%",
        minHeight: "200px",
        maxHeight: "300px",
        overflow: "hidden",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "IranSans, sans-serif",
      }}
    >
      <h3 style={{ textAlign: "center", color: "#1b3148ff", marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        خروج از حصار جغرافیایی (۱۰ روز اخیر)
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="7 7" stroke="#ccc" />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "IranSans, sans-serif", fontSize: 12 }}
              stroke="#1b3148ff"
            />
            <YAxis
              tick={{ fontFamily: "IranSans, sans-serif", fontSize: 12 }}
              stroke="#1b3148ff"
            />
            <Tooltip
              contentStyle={{
                fontFamily: "IranSans, sans-serif",
                textAlign: "center",
                direction: "rtl",
                backgroundColor: "#F9FAFB",
                border: "1px solid #99acd2ff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
              itemStyle={{ color: "#1E293B", fontSize: "12px" }}
              labelStyle={{ fontWeight: "bold", color: "#4F46E5" }}
            />
            <Bar dataKey="geofenceExits" fill="#8884d8" name="تعداد خروج" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeofenceExitsStandaloneChart;