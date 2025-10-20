import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const SatelliteGroupChart = ({ selectedGroup, cardStyle }) => {
  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalSatellites, setTotalSatellites] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedGroup || selectedGroup === "0" || selectedGroup === "all") {
      setLoading(false);
      setError("لطفاً یک گروه خاص انتخاب کنید.");
      return;
    }

    const groupId = parseInt(selectedGroup); // numeric کردن ID
    if (isNaN(groupId)) {
      setError("ID گروه نامعتبر است.");
      setLoading(false);
      return;
    }

    const fetchSatelliteData = async () => {
      try {
        setLoading(true);
        setError("");

        let devices = [];

        // گام ۱: سعی برای گرفتن group و devices از group.devices
        console.log("=== شروع fetch برای فقط گروه ID:", groupId, "===");
        const groupRes = await fetch(`/api/groups/${groupId}`, {
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        console.log("Status fetch group", groupId, ":", groupRes.status);
        if (groupRes.ok) {
          const group = await groupRes.json();
          console.log("Group object:", group);
          const deviceIds = group.devices || []; // IDهای فقط این گروه
          console.log("تعداد IDهای از group.devices:", deviceIds.length);

          if (deviceIds.length > 0) {
            // جزئیات deviceها از IDها
            for (const deviceId of deviceIds) {
              const deviceRes = await fetch(`/api/devices/${deviceId}`, {
                headers: { Accept: "application/json" },
                credentials: "include",
              });
              if (deviceRes.ok) {
                const device = await deviceRes.json();
                devices.push(device);
              }
            }
          }
        }

        // fallback: اگر خالی بود، همه deviceها رو بگیر و فیلتر کن با groupId
        if (devices.length === 0) {
          console.log(
            "Fallback: گرفتن همه deviceها و فیلتر با groupId =",
            groupId
          );
          const allDevicesRes = await fetch(`/api/devices`, {
            headers: { Accept: "application/json" },
            credentials: "include",
          });
          if (allDevicesRes.ok) {
            const allDevices = await allDevicesRes.json();
            console.log("اولین device برای دیباگ:", allDevices[0]); // فیلد groupId رو چک کن
            devices = allDevices.filter(
              (device) => Number(device.groupId) === groupId
            ); // فقط این گروه
            console.log("تعداد بعد از فیلتر دستی:", devices.length);
          }
        }

        console.log(
          "لیست نهایی ماشین‌های فقط این گروه:",
          devices.map((d) => ({ id: d.id, name: d.name, groupId: d.groupId }))
        );

        if (devices.length === 0) {
          
          setLoading(false);
          return;
        }

        setDeviceCount(devices.length); // فقط تعداد این گروه

        const deviceNames = devices.map(
          (device) => device.name || `ماشین ${device.id}`
        );
        const satellitesPerDevice = [];

        // گام ۲: max sat از positions اخیر (۲۴ ساعت) برای هر ماشین فقط این گروه
        const fromDate = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString(); // ۲۴ ساعت اخیر
        for (const device of devices) {
          console.log(
            "--- Fetch positions برای ماشین",
            device.id,
            "در گروه",
            groupId,
            "(از",
            fromDate,
            ")"
          );
          const positionsRes = await fetch(
            `/api/positions?deviceId=${device.id}&from=${fromDate}`,
            {
              headers: { Accept: "application/json" },
              credentials: "include",
            }
          );
          console.log(
            "Status positions برای ماشین",
            device.id,
            ":",
            positionsRes.status
          );
          if (positionsRes.ok) {
            const positions = await positionsRes.json();
            console.log(
              "تعداد positions برای ماشین",
              device.id,
              ":",
              positions.length
            );
            let maxSat = 0;
            positions.forEach((pos, index) => {
              const attributes = pos.attributes || {};
              const sat =
                attributes.sat ||
                attributes.satellites ||
                pos.sat ||
                pos.satellites ||
                0;
              if (sat > maxSat) maxSat = sat;
              console.log(
                "Position",
                index + 1,
                "برای ماشین",
                device.id,
                ": sat =",
                sat
              );
            });
            satellitesPerDevice.push(maxSat);
            console.log(
              "Max sat برای ماشین",
              device.id,
              "در گروه",
              groupId,
              ":",
              maxSat
            );
          } else {
            satellitesPerDevice.push(0);
            console.log("No positions برای ماشین", device.id, ", sat = 0");
          }
        }

        // گام ۳: مجموع و تنظیم state
        const total = satellitesPerDevice.reduce((sum, sat) => sum + sat, 0);
        setLabels([...deviceNames, "مجموع "]);
        setChartData([...satellitesPerDevice, total]);
        setTotalSatellites(total);
        console.log("=== Final data فقط برای گروه", groupId, "===");
        console.log("Labels (ماشین‌ها + مجموع):", [
          ...deviceNames,
          "مجموع ",
        ]);
        console.log("Data (sat هر ماشین + مجموع):", [
          ...satellitesPerDevice,
          total,
        ]);
        console.log("مجموع کل:", total);
      } catch (err) {
        setError(err.message);
        console.error("خطا در SatelliteGroupChart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSatelliteData();
  }, [selectedGroup]);

  const getColors = (count) => {
    const colors = [
      "#36A2EB",
      "#FF6384",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF6384",
      "#36A2EB",
      "#9966FF",
    ];
    return colors.slice(0, count);
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
        <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
          در حال بارگیری ماهواره‌های گروه...
        </h3>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "IranSans, sans-serif" }}>
          در حال بارگیری...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
        <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
          خطا: {error}
        </h3>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "IranSans, sans-serif" }}>
          خطا در بارگیری داده‌ها
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
        <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
          هیچ ماشینی در گروه انتخابی وجود ندارد.
        </h3>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "IranSans, sans-serif" }}>
          بدون داده
        </div>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: "تعداد ماهواره‌های ست‌شده (حداکثر ۲۴ ساعت اخیر)",
        data: chartData,
        backgroundColor: getColors(labels.length),
        borderColor: getColors(labels.length).map((color) =>
          color.replace(
            /([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/,
            (m, r, g, b) => {
              const darken = (col) =>
                Math.floor(parseInt(col, 16) * 0.8)
                  .toString(16)
                  .padStart(2, "0");
              return `#${darken(r)}${darken(g)}${darken(b)}`;
            }
          )
        ),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: "تعداد ماهواره‌ها",
          font: { family: "'IranSans', sans-serif", size: 12 }
        },
        ticks: { font: { family: "'IranSans', sans-serif", size: 12 } }
      },
      x: {
        title: { 
          display: true, 
          font: { family: "'IranSans', sans-serif", size: 12 }
        },
        ticks: { 
          font: { family: "'IranSans', sans-serif", size: 12 },
          maxRotation: 45,
          minRotation: 0
        }
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: false, // عنوان رو در h3 گذاشتیم
      },
      tooltip: {
        backgroundColor: "#F9FAFB",
        titleColor: "#4F46E5",
        titleFont: { family: "'IranSans', sans-serif", size: 14, weight: "bold" },
        bodyColor: "#1E293B",
        bodyFont: { family: "'IranSans', sans-serif", size: 12 },
        borderColor: "#99acd2ff",
        borderWidth: 1,
        cornerRadius: 10,
        displayColors: true,
        rtl: true,
        boxPadding: 8,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        right: 20,
        left: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
      <h3 style={{ textAlign: 'center', fontSize: 14, marginBottom: 10, fontFamily: "IranSans, sans-serif", flexShrink: 0 }}>
        GPSهای گروه {selectedGroup} ({deviceCount} ماشین) - همه: {totalSatellites}
      </h3>
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default SatelliteGroupChart;