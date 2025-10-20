import React, { useState, useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  FaCar,
  FaPowerOff,
  FaTachometerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryCards = ({ selectedGroup, cardStyle }) => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    noDataDevices: 0,
  });

  const [animate, setAnimate] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) {
      console.log("No selected group, skipping fetch");
      setStats({
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        noDataDevices: 0,
      });
      setAnimate(true);
      return;
    }

    const fetchStatistics = async () => {
      try {
        console.log("Fetching devices for groupId:", selectedGroup);
        const devicesResponse = await fetch(
          `/api/devices?groupId=${selectedGroup}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        if (!devicesResponse.ok) {
          console.error(
            "Devices fetch failed for group:",
            selectedGroup,
            devicesResponse.status,
            devicesResponse.statusText
          );
          throw new Error(
            `HTTP ${devicesResponse.status} - ${devicesResponse.statusText}`
          );
        }
        const devicesData = await devicesResponse.json();
        console.log("Raw devices data for group:", selectedGroup, devicesData);

        if (!Array.isArray(devicesData)) {
          console.error("Devices data is not an array:", devicesData);
          throw new Error("Invalid devices data format");
        }

        const groupDevices = devicesData.filter(
          (d) => d.groupId === parseInt(selectedGroup)
        );
        console.log("Filtered devices for group:", selectedGroup, groupDevices);

        const totalDevices = groupDevices.length || 0;

        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const noDataDevices =
          groupDevices.filter((d) => {
            const lastUpdate = new Date(d.lastUpdate || 0);
            const isNoStatus =
              !d.status || (d.status !== "online" && d.status !== "offline");
            return lastUpdate < thirtyDaysAgo || !d.lastUpdate || isNoStatus;
          }).length || 0;

        const devicesWithStatus = groupDevices.filter(
          (d) => d.status && d.lastUpdate
        );
        const activeDevices =
          devicesWithStatus.filter((d) => d.status === "online").length || 0;
        const inactiveDevices =
          devicesWithStatus.filter((d) => d.status === "offline").length || 0;

        console.log("Calculated stats:", {
          totalDevices,
          activeDevices,
          inactiveDevices,
          noDataDevices,
        });

        setStats({
          totalDevices,
          activeDevices,
          inactiveDevices,
          noDataDevices,
        });
        setAnimate(true);
      } catch (err) {
        console.error(
          "Error fetching statistics for group:",
          selectedGroup,
          err
        );
        setStats({
          totalDevices: 0,
          activeDevices: 0,
          inactiveDevices: 0,
          noDataDevices: 0,
        });
        setAnimate(true);
      }
    };

    fetchStatistics();

    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedGroup]);

  // داده‌های نمودار با رنگ‌های گرم‌تر و پررنگ‌تر
  const data = {
    labels: ["متحرک با GPS روشن", "GPS های خاموش", "GPS فعال بدون دیتا"],
    datasets: [
      {
        label: "تعداد دستگاه‌ها",
        data: [stats.activeDevices, stats.inactiveDevices, stats.noDataDevices],
        backgroundColor: [
          "#4CAF50", // سبز گرم و پررنگ برای فعال
          "#E53E3E", // قرمز گرم و پررنگ برای خاموش
          "#F6AD55", // نارنجی گرم و پررنگ برای بدون دیتا
        ],
        borderColor: ["#4CAF50", "#E53E3E", "#F6AD55"],
        borderWidth: 0,
        hoverOffset: 6, // جداسازی کمتر در hover
        hoverBorderWidth: 2, // border نازک‌تر در hover
        hoverBorderColor: [
          "#388E3C", // تیره‌تر برای فعال
          "#C53030", // تیره‌تر برای خاموش
          "#ED8936", // تیره‌تر برای بدون دیتا
        ],
      },
    ],
  };

  // گزینه‌های نمودار
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 12,
            family: "'IranSans', sans-serif",
            weight: "normal",
          },
          color: "#555",
          generateLabels: (chart) => {
            const { data } = chart;
            return data.labels.map((label, i) => ({
              text: `${label}: ${data.datasets[0].data[i]} عدد`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].borderColor[i],
              lineWidth: 1,
              pointStyle: "circle",
              fontColor: "#555",
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "'IranSans', sans-serif", size: 14 },
        bodyFont: { family: "'IranSans', sans-serif", size: 12 },
        cornerRadius: 8,
        displayColors: true,
        rtl: true,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed} عدد`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      easing: "easeOutQuart",
      duration: animate ? 1200 : 800,
    },
  };

  // اگر مجموع دستگاه‌ها صفر باشه، پیام خالی نشون بده
  if (stats.totalDevices === 0) {
    return (
      <div style={{ ...cardStyle, height: "100%", minHeight: "200px", maxHeight: "300px", overflow: "hidden", fontFamily: "IranSans, sans-serif" }}>
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            color: "#666",
            fontFamily: "IranSans, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          هیچ داده‌ای برای نمایش وجود ندارد.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        background: "#ebebebff",
        fontFamily: "IranSans, sans-serif",
        borderRadius: "20px",
        padding: "10px",
        margin: "0px",
        height: "100%",
        minHeight: "200px",
        maxHeight: "300px",
        overflow: "hidden",
      }}
    >
      {/* عنوان بالای نمودار */}
      <div
        style={{
          textAlign: "center",
          padding: "10px 0",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            color: "#2C3E50",
            fontFamily: "IranSans, sans-serif",
          }}
        >
          کل دستگاه‌ها: {stats.totalDevices} عدد
        </h3>
      </div>

      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          minHeight: 0,
        }}
      >
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default SummaryCards;