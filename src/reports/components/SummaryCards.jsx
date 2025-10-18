import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaPowerOff,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

const SummaryCards = ({ selectedGroup }) => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    noDataDevices: 0,
    totalEngineHours: "00:00",
  });

  const [animate, setAnimate] = useState(false); // State برای کنترل انیمیشن

  useEffect(() => {
    if (!selectedGroup) {
      console.log("No selected group, skipping fetch");
      setStats({
        totalDevices: 0,
        activeDevices: 0,
        inactiveDevices: 0,
        noDataDevices: 0,
        totalEngineHours: "00:00",
      });
      setAnimate(true); // فعال کردن انیمیشن برای حالت خالی
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

        const fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 30);
        const fromStr = fromDate.toISOString();
        const toStr = now.toISOString();
        const summaryUrl = `/api/reports/summary?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
        const summaryResponse = await fetch(summaryUrl, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });
        if (!summaryResponse.ok) {
          console.error(
            "Summary fetch failed for engine hours:",
            summaryResponse.status,
            summaryResponse.statusText
          );
          throw new Error(`HTTP ${summaryResponse.status}`);
        }
        const summaryData = await summaryResponse.json();
        console.log("Summary data for engine hours:", summaryData);

        let totalEngineHoursMs = 0;
        if (summaryData && summaryData.length > 0) {
          totalEngineHoursMs = summaryData.reduce(
            (sum, r) => sum + (r.engineHours || 0),
            0
          );
        }

        const totalHours = Math.floor(totalEngineHoursMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(
          (totalEngineHoursMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const formattedEngineHours = `${String(totalHours).padStart(
          2,
          "0"
        )}:${String(totalMinutes).padStart(2, "0")}`;

        console.log("Calculated stats:", {
          totalDevices,
          activeDevices,
          inactiveDevices,
          noDataDevices,
          totalEngineHours: formattedEngineHours,
        });

        setStats({
          totalDevices,
          activeDevices,
          inactiveDevices,
          noDataDevices,
          totalEngineHours: formattedEngineHours,
        });
        setAnimate(true); // فعال کردن انیمیشن هنگام تغییر داده‌ها
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
          totalEngineHours: "00:00",
        });
        setAnimate(true); // فعال کردن انیمیشن برای حالت خطا
      }
    };

    fetchStatistics();

    // ریست انیمیشن بعد از ۱ ثانیه
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedGroup]);


  return (
    <div className="summary-cards-container">
      <div className={`summary-card  ${animate ? "update-animation" : ""}`}>
        
        <div className="card-label"><FaCar className="card-icon" />   تعداد کل دستگاه‌ها</div>
        <div className="card-value">{stats.totalDevices} عدد</div>
      </div>

      <div className={`summary-card ${animate ? "update-animation" : ""}`}>
        
        <div className="card-label"><FaTachometerAlt className="card-icon" />  تعداد متحرک  با GPS روشن   </div>
        <div className="card-value">{stats.activeDevices} عدد</div>
      </div>

      <div className={`summary-card  ${animate ? "update-animation" : ""}`}>
        
        <div className="card-label"><FaPowerOff className="card-icon" />    تعداد GPS های خاموش   </div>
        <div className="card-value">{stats.inactiveDevices} عدد</div>
      </div>

      <div className={`summary-card ${animate ? "update-animation" : ""}`}>
        
        <div className="card-label"><FaExclamationTriangle className="card-icon" />    تعداد  GPS فعال بدون دیتا    </div>
        <div className="card-value">{stats.noDataDevices} عدد</div>
      </div>

      <div className={`summary-card ${animate ? "update-animation" : ""}`}>
        
        <div className="card-label"><FaClock className="card-icon" />   ساعات کار موتور در ۳۰ روز اخیر</div>
        <div className="card-value">{stats.totalEngineHours} ساعت</div>
      </div>
    </div>
  );
};

export default SummaryCards;
