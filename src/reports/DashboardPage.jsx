import React, { useState, useEffect } from "react";
import PageLayout from "../common/components/PageLayout";
import ReportsMenu from "./components/ReportsMenu";
import useReportStyles from "./common/useReportStyles";
import GroupSelector from "./GroupSelector";
import SpeedChart from "./components/SpeedChart";
import DistanceChart from "./components/DistanceChart";
import TemperatureChart from "./components/TemperatureChart";
import SummaryCards from "./components/SummaryCards";
import FuelConsumptionChart from "./components/FuelConsumptionChart";
import IframeComponent from "./components/IframeComponent";
import EngineHoursChart from "./components/EngineHoursChart";
import RiskyBehaviorChart from "./components/RiskyBehaviorChart";
import { Box } from "@mui/material";
import GeofenceExitsStandaloneChart from "./components/GeofenceExitsStandaloneChart";
import PersianClock from "./components/PersianClock";
import SatelliteGroupChart from "./components/SatelliteGroupChart";

const DashboardPage = () => {
  const { classes } = useReportStyles();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [speedData, setSpeedData] = useState([]);
  const [distanceData, setDistanceData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [engineHoursData, setEngineHoursData] = useState([]);
  const [riskyBehaviorData, setRiskyBehaviorData] = useState([]);

  const cardStyle = {
    position: "relative",
    borderRadius: "23px",
    background: "#ebebebff",
    padding: "0px",
    display: "flex",
    flexDirection: "column",
    fontFamily: "IranSans, sans-serif",
    fontSize: "12px",
    color: "#1b3148ff",
  };

  // گرفتن لیست گروه‌ها
  useEffect(() => {
    fetch("/api/groups", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setGroups(data);
        if (data.length > 0) setSelectedGroup(data[0].id);
      })
      .catch((err) => console.error("Error fetching groups:", err));
  }, []);

  // گرفتن داده‌ها با aggregation برای گروه
useEffect(() => {
  if (!selectedGroup) return;
  const fetchSummaryData = async () => {
    try {
      const today = new Date("2025-10-22"); // تنظیم به 1404/07/30 برای پوشش 1404/07/29
      const requests = [];
      const eventsRequests = [];
      const positionsRequests = [];

      // درخواست‌ها برای 10 روز (2025/10/13 تا 2025/10/22)
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const fromDate = new Date(date);
        fromDate.setHours(0, 0, 0, 0); // شروع روز
        const toDate = new Date(date);
        toDate.setHours(23, 59, 59, 999); // پایان روز
        const fromStr = fromDate.toISOString();
        const toStr = toDate.toISOString();

        // درخواست Summary
        const summaryUrl = `/api/reports/summary?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
        requests.push(
          fetch(summaryUrl, {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }).then((res) => {
            if (!res.ok) {
              return [];
            }
            return res.json();
          }).catch(() => {
            return [];
          })
        );

        // درخواست Events (تغییر به deviceOverspeed)
        const eventsUrl = `/api/reports/events?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}&type=deviceOverspeed`;
        console.log(`Events URL for ${fromStr}:`, eventsUrl);
        eventsRequests.push(
          fetch(eventsUrl, {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }).then((res) => {
            if (!res.ok) {
              console.log(`Events fetch failed for ${fromStr}: HTTP ${res.status}`);
              return [];
            }
            return res.json().then((data) => {
              console.log(`Events data for ${fromStr}:`, data);
              console.log(
                `DeviceOverspeed values for ${fromStr}:`,
                data
                  .filter((event) => event.type === "deviceOverspeed")
                  .map((event) => event.attributes?.speed || 0)
              );
              return data;
            });
          }).catch((err) => {
            console.error(`Events fetch error for ${fromStr}:`, err);
            return [];
          })
        );

        // درخواست Positions (فال‌بک)
        const positionsUrl = `/api/positions?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
        positionsRequests.push(
          fetch(positionsUrl, {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }).then((res) => {
            if (!res.ok) {
              console.log(`Positions fetch failed for ${fromStr}: HTTP ${res.status}`);
              return [];
            }
            return res.json().then((data) => {
              console.log(`Positions data for ${fromStr}:`, data);
              console.log(
                `Speeds for ${fromStr}:`,
                data.map((pos) => pos.speed || 0)
              );
              return data;
            });
          }).catch((err) => {
            console.error(`Positions fetch error for ${fromStr}:`, err);
            return [];
          })
        );
      }

      const [summaryResults, eventsResults, positionsResults] = await Promise.all([
        Promise.all(requests),
        Promise.all(eventsRequests),
        Promise.all(positionsRequests),
      ]);

      const formattedSpeed = [];
      const formattedDistance = [];
      const formattedFuel = [];
      const formattedEngineHours = [];
      const formattedRiskyBehavior = [];

      summaryResults.forEach((dayReports, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (9 - i));
        const faDate = new Intl.DateTimeFormat("fa-IR", {
          month: "2-digit",
          day: "2-digit",
        }).format(date);

        let avgSpeed = 0;
        let totalDistance = 0;
        let totalFuel = 0;
        let totalEngineHoursMs = 0;
        let deviceOverspeedCount = 0;

        if (dayReports && dayReports.length > 0) {
          const validSpeeds = dayReports
            .map((r) => r.averageSpeed || 0)
            .filter((speed) => speed <= 300);
          avgSpeed =
            validSpeeds.length > 0
              ? validSpeeds.reduce((sum, s) => sum + s, 0) /
                validSpeeds.length
              : 0;
          const validDistances = dayReports
            .map((r) => r.distance || 0)
            .filter((distance) => distance <= 2000000);
          totalDistance =
            validDistances.length > 0
              ? validDistances.reduce((sum, d) => sum + d, 0)
              : 0;
          totalFuel = dayReports.reduce(
            (sum, r) => sum + (r.fuelConsumption || 0),
            0
          );
          totalEngineHoursMs = dayReports.reduce(
            (sum, r) => sum + (r.engineHours || 0),
            0
          );
        }

        // شمارش رویدادهای deviceOverspeed
        const eventsForDay = eventsResults[i] || [];
        deviceOverspeedCount = eventsForDay.filter(
          (event) => event.type === "deviceOverspeed"
        ).length;

        // فال‌بک: اگه رویدادها خالی بود، از positions استفاده کن
        if (deviceOverspeedCount === 0) {
          const positionsForDay = positionsResults[i] || [];
          const maxSpeedThreshold = 13.5; // 25 km/h ≈ 13.5 knots
          deviceOverspeedCount = positionsForDay.filter(
            (pos) => (pos.speed || 0) > maxSpeedThreshold
          ).length;
        }

        formattedSpeed.push({ date: faDate, avgSpeed: avgSpeed.toFixed(2) });
        formattedDistance.push({
          date: faDate,
          distance: (totalDistance / 1000).toFixed(2),
        });
        formattedFuel.push({
          date: faDate,
          fuelConsumption: totalFuel.toFixed(2),
        });
        formattedEngineHours.push({
          date: faDate,
          engineHours: totalEngineHoursMs,
        });
        formattedRiskyBehavior.push({
          date: faDate,
          deviceOverspeedCount: deviceOverspeedCount,
        });
      });

      console.log("Formatted risky behavior data:", formattedRiskyBehavior);
      setSpeedData(formattedSpeed);
      setDistanceData(formattedDistance);
      setFuelData(formattedFuel);
      setEngineHoursData(formattedEngineHours);
      setRiskyBehaviorData(formattedRiskyBehavior);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchSummaryData();
}, [selectedGroup]);

  // شماره‌گذاری کامپوننت‌ها
  const components = [
    {
      id: 1,
      name: "SummaryCards",
      component: (
        <SummaryCards selectedGroup={selectedGroup} cardStyle={cardStyle} />
      ),
    },
    {
      id: 2,
      name: "GeofenceExitsStandaloneChart",
      component: (
        <GeofenceExitsStandaloneChart
          selectedGroup={selectedGroup}
          cardStyle={cardStyle}
        />
      ),
    },
    {
      id: 3,
      name: "SatelliteGroupChart",
      component: selectedGroup && (
        <SatelliteGroupChart
          selectedGroup={selectedGroup}
          cardStyle={cardStyle}
        />
      ),
    },
    {
      id: 4,
      name: "SpeedChart",
      component: <SpeedChart data={speedData} cardStyle={cardStyle} />,
    },
    {
      id: 5,
      name: "DistanceChart",
      component: <DistanceChart data={distanceData} cardStyle={cardStyle} />,
    },
    {
      id: 6,
      name: "TemperatureChart",
      component: <TemperatureChart cardStyle={cardStyle} />,
    },
    {
      id: 7,
      name: "FuelConsumptionChart",
      component: fuelData.length > 0 && (
        <FuelConsumptionChart data={fuelData} cardStyle={cardStyle} />
      ),
    },
    {
      id: 8,
      name: "EngineHoursChart",
      component: (
        <EngineHoursChart data={engineHoursData} cardStyle={cardStyle} />
      ),
    },
    {
      id: 9,
      name: "RiskyBehaviorChart",
      component: (
        <RiskyBehaviorChart data={riskyBehaviorData} cardStyle={cardStyle} />
      ),
    },
  ];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={["داشبورد", "Traccar"]}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            margin: "50px",
            padding: "15px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            borderRadius: "20px",
          }}
        >
          <GroupSelector groups={groups} onSelect={setSelectedGroup} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              padding: "0px 15px",
              direction: "rtl",
              fontFamily: "'Vazir', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "15px",
                height: "auto",
                width: "100%",
                boxSizing: "border-box",
              }}
            ></div>
          </div>

          <div
            style={{
              height: "75vh",
              display: "flex",
              gap: 15,
              alignItems: "flex-start",
              direction: "rtl",
              padding: "15px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                height: "100%",
                gap: 15,
                flex: 2,
                fontFamily: "IranSans, sans-serif",
              }}
            >
              {components.map((comp) => (
                <div
                  key={comp.id}
                  style={{
                    display: "grid",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                    minHeight: "200px",
                    maxHeight: "300px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    gap: "15px",
                    boxSizing: "border-box",
                  }}
                >
                  {comp.component || (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      بدون داده
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                width: "500px",
                height: "100%",
                background: "#f5f5f5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              <IframeComponent />
            </div>
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;