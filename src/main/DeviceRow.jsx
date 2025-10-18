import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import Battery60Icon from "@mui/icons-material/Battery60";
import BatteryCharging60Icon from "@mui/icons-material/BatteryCharging60";
import Battery20Icon from "@mui/icons-material/Battery20";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SpeedIcon from "@mui/icons-material/Speed";
import ErrorIcon from "@mui/icons-material/Error";
import EngineIcon from "../resources/images/data/engine.svg?react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { makeStyles } from "tss-react/mui";
import { devicesActions } from "../store";
import {
  formatAlarm,
  formatBoolean,
  formatStatus,
  getStatusColor,
} from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import { mapIconKey, mapIcons } from "../map/core/preloadImages";
import { useAdministrator } from "../common/util/permissions";
import { useAttributePreference } from "../common/util/preferences";

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  icon: { width: 25, height: 25, filter: "brightness(0) invert(1)" },
  batteryText: { fontSize: "0.75rem", fontWeight: "normal", lineHeight: "0.875rem" },
  success: { color: theme.palette.success.main },
  warning: { color: theme.palette.warning.main },
  error: { color: theme.palette.error.main },
  neutral: { color: theme.palette.text.secondary },
  listItem: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    marginBottom: theme.spacing(1),
    overflow: "hidden",
  },
  headerBox: { display: "flex", alignItems: "center", gap: theme.spacing(1.5) },
  nameText: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  iconContainer: { display: "flex", flexWrap: "wrap", gap: theme.spacing(1.5), justifyContent: "flex-start", width: "100%" },
  iconItem: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 55 },
  movementLight: { width: 16, height: 16, borderRadius: "50%", marginTop: 2 },
  runningIcon: {
    animation: "runningAnim 0.5s infinite alternate",
  },
  "@keyframes runningAnim": {
    "0%": { transform: "translateY(0) rotate(0deg)" },
    "50%": { transform: "translateY(-4px) rotate(-10deg)" },
    "100%": { transform: "translateY(0) rotate(0deg)" },
  },
}));

const DeviceRow = ({ data, index, expanded, onAccordionChange }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  const admin = useAdministrator();

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);
  const devicePrimary = useAttributePreference("devicePrimary", "name");
  const deviceSecondary = useAttributePreference("deviceSecondary", "");

  const handleSelect = () => {
    if (admin || !item.disabled) dispatch(devicesActions.selectId(item.id));
  };

  const secondaryText = () => {
    const status =
      item.status === "online" || !item.lastUpdate
        ? formatStatus(item.status, t)
        : dayjs(item.lastUpdate).fromNow();

    return (
      <Typography
        variant="caption"
        color={
          getStatusColor(item.status) === "success"
            ? "green"
            : getStatusColor(item.status) === "warning"
            ? "orange"
            : "gray"
        }
      >
        {deviceSecondary && item[deviceSecondary]
          ? `${item[deviceSecondary]} • ${status}`
          : status}
      </Typography>
    );
  };

  const rawBattery =
    position?.attributes?.battery ?? position?.attributes?.batteryLevel ?? null;
  const battery = typeof rawBattery === "number" ? rawBattery.toFixed(2) : "N/A";
  const batteryPercent =
    typeof rawBattery === "number"
      ? Math.min(100, Math.round((rawBattery / 12.6) * 100))
      : "N/A";

  const rssi = position?.attributes?.rssi ?? "N/A";
  const speed = position?.speed ? position.speed.toFixed(1) : 0;
  const isMoving = speed > 0;
  const motionText = isMoving ? "در حال حرکت" : "ایستاده";

  const renderBatteryIcon = () => {
    if (!position) return null;
    if (battery > 12)
      return position.attributes.charge ? (
        <BatteryChargingFullIcon className={classes.success} />
      ) : (
        <BatteryFullIcon className={classes.success} />
      );
    if (battery > 6)
      return position.attributes.charge ? (
        <BatteryCharging60Icon className={classes.warning} />
      ) : (
        <Battery60Icon className={classes.warning} />
      );
    return position.attributes.charge ? (
      <BatteryCharging20Icon className={classes.error} />
    ) : (
      <Battery20Icon className={classes.error} />
    );
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={onAccordionChange}
      onClick={handleSelect}
      className={classes.listItem}
      sx={{
        border:
          selectedDeviceId === item.id
            ? "2px solid #1976d2"
            : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box className={classes.headerBox}>
          <Avatar>
            <img
              className={classes.icon}
              src={mapIcons[mapIconKey(item.category)]}
              alt=""
            />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" className={classes.nameText}>
              {item[devicePrimary]}
            </Typography>
            {secondaryText()}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box className={classes.iconContainer}>
          {/* Battery */}
          {rawBattery !== null && (
            <Tooltip
              title={`${t("positionBattery")}: ${battery}V (${batteryPercent}%)`}
            >
              <div className={classes.iconItem}>
                {renderBatteryIcon()}
                <Typography variant="caption" className={classes.batteryText}>
                  {battery}V
                </Typography>
                <Typography variant="caption" className={classes.batteryText}>
                  {batteryPercent}%
                </Typography>
              </div>
            </Tooltip>
          )}

          {/* RSSI */}
          {position?.attributes?.rssi && (
            <Tooltip title={`${t("positionRssi")}: ${rssi}dBm`}>
              <div className={classes.iconItem}>
                <SignalCellularAltIcon
                  fontSize="small"
                  className={
                    rssi > -60
                      ? classes.success
                      : rssi > -80
                      ? classes.warning
                      : classes.error
                  }
                />
                <Typography variant="caption" className={classes.batteryText}>
                  {rssi} dBm
                </Typography>
              </div>
            </Tooltip>
          )}

          {/* Moving */}
          {position && (
            <Tooltip title={motionText}>
              <div className={classes.iconItem}>
                <DirectionsRunIcon
                  fontSize="small"
                  className={isMoving ? classes.runningIcon : classes.neutral}
                />
                <div
                  className={classes.movementLight}
                  style={{
                    backgroundColor: isMoving ? "#4caf50" : "#f44336",
                  }}
                />
              </div>
            </Tooltip>
          )}

          {/* Speed */}
          {position && (
            <Tooltip title={`${t("positionSpeed")}: ${speed} km/h`}>
              <div className={classes.iconItem}>
                <SpeedIcon fontSize="small" className={classes.success} />
                <Typography variant="caption" className={classes.batteryText}>
                  {speed} km/h
                </Typography>
              </div>
            </Tooltip>
          )}

          {/* Alarm */}
          {position?.attributes?.alarm && (
            <Tooltip
              title={`${t("eventAlarm")}: ${formatAlarm(position.attributes.alarm, t)}`}
            >
              <div className={classes.iconItem}>
                <ErrorIcon fontSize="small" className={classes.error} />
                <Typography variant="caption" className={classes.batteryText}>
                  Alarm
                </Typography>
              </div>
            </Tooltip>
          )}

          {/* Ignition */}
          {position?.attributes?.ignition !== undefined && (
            <Tooltip
              title={`${t("positionIgnition")}: ${formatBoolean(
                position.attributes.ignition,
                t
              )}`}
            >
              <div className={classes.iconItem}>
                <EngineIcon
                  width={20}
                  height={20}
                  className={
                    position.attributes.ignition ? classes.success : classes.neutral
                  }
                />
                <Typography variant="caption" className={classes.batteryText}>
                  {formatBoolean(position.attributes.ignition, t)}
                </Typography>
              </div>
            </Tooltip>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default DeviceRow;
