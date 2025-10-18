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
import SatellitesChart from "./components/SatellitesChart";

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
    boxShadow: "7px 7px 14px #aeaeaeff, -7px -7px 14px #fffcfcff",
    padding: "0px",
    display: "flex",
    flexDirection: "column",
    fontFamily: "IranSans, sans-serif",
    fontSize: "12px",
    color: "#1b3148ff",
  };

  // گرفتن لیست گروه‌ها با session cookie
  useEffect(() => {
    fetch("/api/groups", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Groups fetch failed:", res.status, res.statusText);
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Groups data:", data);
        setGroups(data);
        console.log(data);
        if (data.length > 0) setSelectedGroup(data[0].id);
      })
      .catch((err) => console.error("Error fetching groups:", err));
  }, []);

  // گرفتن داده‌ها با aggregation برای گروه
  useEffect(() => {
    if (!selectedGroup) return;
    const fetchSummaryData = async () => {
      try {
        const today = new Date();
        const requests = [];
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const fromDate = new Date(date);
          fromDate.setHours(20, 30, 0, 0); // 8:30 PM UTC
          const toDate = new Date(date);
          toDate.setDate(date.getDate() + 1);
          toDate.setHours(20, 29, 59, 999); // 8:29:59.999 PM UTC next day
          const fromStr = fromDate.toISOString();
          const toStr = toDate.toISOString();
          const url = `/api/reports/summary?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
          requests.push(
            fetch(url, {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }).then((res) => {
              if (!res.ok) {
                console.error(
                  `Summary fetch failed for ${fromStr}:`,
                  res.status,
                  res.statusText
                );
                throw new Error(`HTTP ${res.status}`);
              }
              return res.json();
            })
          );
        }

        const summaryResults = await Promise.all(requests);
        console.log("Summary results:", summaryResults);

        const eventsRequests = [];
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const fromDate = new Date(date);
          fromDate.setHours(20, 30, 0, 0); // 8:30 PM UTC
          const toDate = new Date(date);
          toDate.setDate(date.getDate() + 1);
          toDate.setHours(20, 29, 59, 999); // 8:29:59.999 PM UTC next day
          const fromStr = fromDate.toISOString();
          const toStr = toDate.toISOString();
          const url = `/api/reports/events?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}&type=overspeed`;
          eventsRequests.push(
            fetch(url, {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }).then((res) => {
              console.log(`Request URL for ${fromStr}:`, url);
              console.log(
                `Response status for ${fromStr}:`,
                res.status,
                res.statusText
              );
              if (!res.ok) {
                console.error(
                  `Events fetch failed for ${fromStr}:`,
                  res.status,
                  res.statusText
                );
              }
              return res.json().then((data) => {
                console.log(`Raw Events data for ${fromStr}:`, data);
                return data;
              });
            })
          );
        }

        const eventsResults = await Promise.all(eventsRequests);
        console.log("Raw Events results array:", eventsResults);

        const positionsRequests = [];
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const fromDate = new Date(date);
          fromDate.setHours(20, 30, 0, 0); // 8:30 PM UTC
          const toDate = new Date(date);
          toDate.setDate(date.getDate() + 1);
          toDate.setHours(20, 29, 59, 999); // 8:29:59.999 PM UTC next day
          const fromStr = fromDate.toISOString();
          const toStr = toDate.toISOString();
          const url = `/api/positions?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
          positionsRequests.push(
            fetch(url, {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }).then((res) => {
              console.log(`Positions request URL for ${fromStr}:`, url);
              console.log(
                `Positions response status for ${fromStr}:`,
                res.status,
                res.statusText
              );
              if (!res.ok) {
                console.error(
                  `Positions fetch failed for ${fromStr}:`,
                  res.status,
                  res.statusText
                );
              }
              return res.json().then((data) => {
                console.log(`Raw Positions data for ${fromStr}:`, data);
                return data;
              });
            })
          );
        }

        const positionsResults = await Promise.all(positionsRequests);
        console.log("Raw Positions results array:", positionsResults);

        const formattedSpeed = [];
        const formattedDistance = [];
        const formattedFuel = [];
        const formattedEngineHours = [];
        const formattedRiskyBehavior = [];

        summaryResults.forEach((dayReports, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (9 - i) + 1); // اضافه کردن یک روز برای جابجایی تاریخ
          const faDate = new Intl.DateTimeFormat("fa-IR", {
            month: "2-digit",
            day: "2-digit",
          }).format(date);

          let avgSpeed = 0;
          let totalDistance = 0;
          let totalFuel = 0;
          let totalEngineHoursMs = 0;
          let overspeedCount = 0;
          if (dayReports && dayReports.length > 0) {
            // فیلتر کردن سرعت‌های غیرمنطقی (بزرگ‌تر از 300)
            const validSpeeds = dayReports
              .map((r) => r.averageSpeed || 0)
              .filter((speed) => speed <= 300);
            avgSpeed =
              validSpeeds.length > 0
                ? validSpeeds.reduce((sum, s) => sum + s, 0) / validSpeeds.length
                : 0;
            // فیلتر کردن مسافت‌های غیرمنطقی (بزرگ‌تر از 2000 کیلومتر)
            const validDistances = dayReports
              .map((r) => r.distance || 0)
              .filter((distance) => distance <= 2000000); // 2000 کیلومتر = 2,000,000 متر
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

          // Count overspeed events
          const eventsForDay = eventsResults[i] || [];
          overspeedCount = eventsForDay.filter(
            (event) => event.type === "overspeed"
          ).length;

          // Alternative: Check positions for overspeed
          const positionsForDay = positionsResults[i] || [];
          const maxSpeedThreshold = 80;
          const overspeedFromPositions = positionsForDay.filter(
            (pos) => pos.speed > maxSpeedThreshold
          ).length;

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
            overspeedCount: overspeedCount || overspeedFromPositions,
          });
        });

        console.log("Formatted risky behavior data:", formattedRiskyBehavior);
        setSpeedData(formattedSpeed);
        setDistanceData(formattedDistance);
        setFuelData(formattedFuel);
        setEngineHoursData(formattedEngineHours);
        setRiskyBehaviorData(formattedRiskyBehavior);
      } catch (err) {
        console.error(
          "Error fetching summary, events, or positions data:",
          err
        );
      }
    };

    fetchSummaryData();
  }, [selectedGroup]);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={["داشبورد", "Traccar"]}>
      <PersianClock />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            margin: "50px ",
            padding: "15px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            borderRadius: "10px",
          }}
        >
          <GroupSelector groups={groups} onSelect={setSelectedGroup} />
          <SummaryCards selectedGroup={selectedGroup} />
          <div
            style={{
              height: 500,
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
                gridTemplateRows: "repeat(2, auto)",
                height: "100%",
                gap: 15,
                flex: 2,
              }}
            >
              <SpeedChart data={speedData} cardStyle={cardStyle} />
              <DistanceChart data={distanceData} cardStyle={cardStyle} />
              <TemperatureChart cardStyle={cardStyle} />
              {fuelData.length > 0 && (
                <FuelConsumptionChart data={fuelData} cardStyle={cardStyle} />
              )}
              <EngineHoursChart data={engineHoursData} cardStyle={cardStyle} />
              <RiskyBehaviorChart
                data={riskyBehaviorData}
                cardStyle={cardStyle}
              />
            </div>
            <div
              style={{
                width: "500px",
                height: "100%",
                background: "#f5f5f5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <IframeComponent />
            </div>
          </div>
          <GeofenceExitsStandaloneChart
            selectedGroup={selectedGroup}
            cardStyle={cardStyle}
          />
          {selectedGroup && (
            <SatellitesChart
              groupId={selectedGroup}
              email="admin6@gmail.com"
              password="123456"
              serverUrl="http://193.228.90.160:8082"
            />
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;