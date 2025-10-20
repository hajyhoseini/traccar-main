import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClock } from "react-icons/fa";
import PersianClock from "./components/PersianClock";  // مسیر اصلاح‌شده به components/PersianClock (بر اساس ساختار فولدرت تنظیم کن)

const GroupSelector = ({ onSelect }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [totalEngineHours, setTotalEngineHours] = useState("00:00");

  useEffect(() => {
    // تشخیص حالت شب/روز سیستم
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener("change", (e) =>
      setIsDarkMode(e.matches)
    );

    return () => {
      darkModeMediaQuery.removeEventListener("change", (e) =>
        setIsDarkMode(e.matches)
      );
    };
  }, []);

  useEffect(() => {
    axios
      .get("/api/groups")
      .then((res) => {
        setGroups(res.data);

        if (res.data.length > 0) {
          const firstGroupId = String(res.data[0].id);
          setSelectedGroup(firstGroupId);
          if (onSelect) onSelect(firstGroupId);
        }
      })
      .catch((err) => console.error("Error fetching groups:", err));
  }, [onSelect]);

  // Fetch engine hours based on selectedGroup
  useEffect(() => {
    if (!selectedGroup) {
      setTotalEngineHours("00:00");
      return;
    }

    const fetchEngineHours = async () => {
      try {
        const now = new Date();
        const fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 30);
        const fromStr = fromDate.toISOString();
        const toStr = now.toISOString();
        const summaryUrl = `/api/reports/summary?groupId=${selectedGroup}&from=${fromStr}&to=${toStr}`;
        const summaryResponse = await axios.get(summaryUrl, {
          withCredentials: true,
        });
        const summaryData = summaryResponse.data;
        console.log("Summary data for engine hours:", summaryData);

        let totalEngineHoursMs = 0;
        if (
          summaryData &&
          Array.isArray(summaryData) &&
          summaryData.length > 0
        ) {
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

        setTotalEngineHours(formattedEngineHours);
      } catch (err) {
        console.error("Error fetching engine hours:", err);
        setTotalEngineHours("00:00");
      }
    };

    fetchEngineHours();
  }, [selectedGroup]);

  const handleSelectGroup = (groupId) => {
    setSelectedGroup(groupId);
    if (onSelect) onSelect(groupId);
    setIsModalOpen(false);
  };

  const getBackground = () => (isDarkMode ? "#1f2937" : "#fff"); // dark gray or white
  const getTextColor = () => (isDarkMode ? "#f9fafb" : "#333"); // light text or dark text
  const getBorderColor = () => (isDarkMode ? "#374151" : "#ddd"); // dark or light border
  const getHoverBg = () => (isDarkMode ? "#374151" : "#e8f0fe"); // hover bg

  return (
    <div style={{ ...containerStyle, color: getTextColor() }}>
      {/* سمت چپ: label و button با بوردر قرمز */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "10px",
          
        }}
      >
        <label style={{ ...labelStyle, color: getTextColor() }}>
          انتخاب گروه:
        </label>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            ...buttonStyle,
            backgroundColor: isDarkMode ? "#374151" : "#f9f9f9",
            color: getTextColor(),
            border: `1px solid ${getBorderColor()}`,
          }}
        >
          {selectedGroup
            ? groups.find((g) => String(g.id) === selectedGroup)?.name
            : "انتخاب کنید"}
        </button>
      </div>

      {/* وسط: کامپوننت PersianClock */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PersianClock />
      </div>

      {/* سمت راست: باکس ساعت و تاریخ با بوردر سبز */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div
          className="engine-hours-card"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: isDarkMode ? "#374151" : "#f8f9fa",
            borderRadius: "10px",
            border: `1px solid #d8dadbff`,
            color: getTextColor(),
          }}
        >
          <FaClock style={{ margin: "0px 8px", color: "#2c3f30ff", verticalAlign:"-3px"}} />
          ساعات کار موتور های گروه در ۳۰ روز اخیر: {totalEngineHours}
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
          <div
            style={{
              ...modalStyle,
              backgroundColor: getBackground(),
              color: getTextColor(),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeaderStyle}>
              <h3 style={{ ...modalTitleStyle, color: getTextColor() }}>
                لیست گروه‌ها
              </h3>
              <span
                style={{
                  ...closeIconStyle,
                  color: isDarkMode ? "#bbb" : "#888",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </span>
            </div>

            <ul style={listStyle}>
              {groups.map((group) => (
                <li
                  key={group.id}
                  style={{
                    ...listItemStyle,
                    background: getBackground(),
                    border: `1px solid ${getBorderColor()}`,
                    color: getTextColor(),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = getHoverBg();
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = getBackground();
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onClick={() => handleSelectGroup(String(group.id))}
                >
                  {group.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 استایل‌ها
const containerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px",
  gap: "15px",
  fontFamily: "Vazir, sans-serif",
  // border:"1px solid red"
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "15px",
};

const buttonStyle = {
  padding: "5px 15px",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: "Vazir, sans-serif",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  fontFamily: "Vazir, sans-serif",
};

const modalStyle = {
  borderRadius: "15px",
  padding: "20px",
  width: "380px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  animation: "fadeInScale 0.3s ease",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "600",
};

const closeIconStyle = {
  cursor: "pointer",
  fontSize: "18px",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const listItemStyle = {
  width: "85%",
  textAlign: "center",
  padding: "12px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  cursor: "pointer",
  transition: "all 0.25s ease",
  fontFamily: "Vazir, sans-serif",
  fontSize: "15px",
  fontWeight: "500",
};

const modalAnimation = `
@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("modalAnimStyle")
) {
  const styleEl = document.createElement("style");
  styleEl.id = "modalAnimStyle";
  styleEl.innerHTML = modalAnimation;
  document.head.appendChild(styleEl);
}

export default GroupSelector;