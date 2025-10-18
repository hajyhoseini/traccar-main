import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                console.error(`Geofence fetch failed for ${fromStr}:`, res.status, res.statusText);
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
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center', color: '#1b3148ff', margin: '10px 0' }}>
          خروج از حصار جغرافیایی
        </h3>
        <p style={{ textAlign: 'center', color: '#666' }}>در حال بارگیری...</p>
      </div>
    );
  }

  // اگر داده‌ای نباشه
  if (!data || data.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center', color: '#1b3148ff', margin: '10px 0' }}>
          خروج از حصار جغرافیایی
        </h3>
        <p style={{ textAlign: 'center', color: '#666' }}>داده‌ای موجود نیست</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ textAlign: 'center', color: '#1b3148ff', margin: '10px 0' }}>
        خروج از حصار جغرافیایی (۱۰ روز اخیر)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="date" 
            tick={{ fontFamily: 'IranSans, sans-serif', fontSize: 12 }}
            stroke="#1b3148ff"
          />
          <YAxis 
            tick={{ fontFamily: 'IranSans, sans-serif', fontSize: 12 }}
            stroke="#1b3148ff"
          />
          <Tooltip 
            contentStyle={{ 
              fontFamily: 'IranSans, sans-serif', 
              textAlign: 'right', 
              direction: 'rtl' 
            }}
          />
          <Bar 
            dataKey="geofenceExits" 
            fill="#8884d8" 
            name="تعداد خروج" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeofenceExitsStandaloneChart;