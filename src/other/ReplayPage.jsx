import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  IconButton, Paper, Slider, Toolbar, Typography, Button, Box,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import { formatTime, formatSpeed, formatAltitude, formatDistance } from '../common/util/formatter';
import ReportFilter from '../reports/components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useCatch } from '../reactHelper';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import StatusCard from '../common/components/StatusCard';
import MapScale from '../map/MapScale';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAttributePreference } from '../common/util/preferences';
import { speedFromKnots, altitudeFromMeters, distanceFromMeters } from '../common/util/converter';

// تابع محاسبه فاصله Haversine (به کیلومتر)
const haversineDistance = (coord1, coord2) => {
  const R = 6371; // شعاع زمین به km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// تابع فیلتر موقعیت‌ها بر اساس حداکثر فاصله
const filterPositionsByMaxDistance = (positions, maxDistanceKm = 10) => {
  if (!positions || positions.length <= 1) return positions;

  // فرض: positions مرتب‌شده بر اساس fixTime
  const filtered = [positions[0]]; // اولین موقعیت رو نگه دار

  for (let i = 1; i < positions.length; i++) {
    const prev = filtered[filtered.length - 1];
    const current = positions[i];
    const dist = haversineDistance(prev, current);

    if (dist <= maxDistanceKm) {
      filtered.push(current);
    }
  }

  return filtered;
};

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    width: `calc(100% + 30px)`, // افزایش عرض به میزان 30 پیکسل
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 3,
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
    width: `calc(${theme.dimensions.drawerWidthDesktop} + 30px)`, // افزایش عرض به میزان 30 پیکسل
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 0,
    },
  },
  title: {
    flexGrow: 1,
  },
  slider: {
    width: '100%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formControlLabel: {
    height: '100%',
    width: '100%',
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
}));

const ReplayPage = () => {
  const t = useTranslation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const timerRef = useRef();

  const defaultDeviceId = useSelector((state) => state.devices.selectedId);
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');

  const [positions, setPositions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId);
  const [showCard, setShowCard] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [expanded, setExpanded] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const deviceName = useSelector((state) => {
    if (selectedDeviceId) {
      const device = state.devices.items[selectedDeviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  useEffect(() => {
    if (playing && positions.length > 0) {
      timerRef.current = setInterval(() => {
        setIndex((index) => index + 1);
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [playing, positions]);

  useEffect(() => {
    if (index >= positions.length - 1) {
      clearInterval(timerRef.current);
      setPlaying(false);
    }
  }, [index, positions]);

  const onPointClick = useCallback((_, index) => {
    setIndex(index);
  }, [setIndex]);

  const onMarkerClick = useCallback((positionId) => {
    setShowCard(!!positionId);
  }, [setShowCard]);

  const onShow = useCatch(async ({ deviceIds, from, to }) => {
    const deviceId = deviceIds.find(() => true);
    setLoading(true);
    setSelectedDeviceId(deviceId);
    setFrom(from);
    setTo(to);
    const query = new URLSearchParams({ deviceId, from, to });
    try {
      const response = await fetchOrThrow(`/api/positions?${query.toString()}`);
      setIndex(0);
      let positions = await response.json();
      // مرتب‌سازی بر اساس fixTime (برای اطمینان)
      positions = positions.sort((a, b) => new Date(a.fixTime) - new Date(b.fixTime));
      // اعمال فیلتر فاصله (حداکثر ۲۰۰ کیلومتر)
      const filteredPositions = filterPositionsByMaxDistance(positions, 10);
      setPositions(filteredPositions);
      if (filteredPositions.length) {
        setExpanded(false);
      } else {
        throw Error(t('sharedNoData'));
      }
    } finally {
      setLoading(false);
    }
  });

  const handleDownload = () => {
    const query = new URLSearchParams({ deviceId: selectedDeviceId, from, to });
    window.location.assign(`/api/positions/kml?${query.toString()}`);
  };

  // تابع برای خروجی اکسل
  const exportToExcel = () => {
    const data = positions.map((position) => ({
      [t('positionFixTime')]: formatTime(position.fixTime, 'seconds'),
      [t('positionLatitude')]: position.latitude?.toFixed(6) || '',
      [t('positionLongitude')]: position.longitude?.toFixed(6) || '',
      [t('positionSpeed')]: position.speed ? formatSpeed(speedFromKnots(position.speed, speedUnit), speedUnit, t) : '',
      [t('positionAltitude')]: position.altitude ? formatAltitude(altitudeFromMeters(position.altitude, altitudeUnit), altitudeUnit, t) : '',
      [t('positionDistance')]: position.attributes?.distance ? formatDistance(distanceFromMeters(position.attributes.distance, distanceUnit), distanceUnit, t) : '',
      [t('positionAddress')]: position.address || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReplayReport');
    XLSX.writeFile(workbook, 'ReplayReport.xlsx');
  };

  // تابع برای خروجی PDF
  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();

      // بارگذاری فونت Vazirmatn-Bold
      try {
        const fontUrl = '/fonts/Vazirmatn-Bold.ttf';
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) {
          throw new Error('فونت Vazirmatn-Bold لود نشد');
        }
        const fontData = await fontResponse.arrayBuffer();
        const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontData)));

        doc.addFileToVFS('Vazirmatn-Bold.ttf', fontBase64);
        doc.addFont('Vazirmatn-Bold.ttf', 'Vazirmatn', 'bold');
        doc.setFont('Vazirmatn', 'bold');
      } catch (fontError) {
        console.warn('خطا در لود فونت، استفاده از فونت پیش‌فرض:', fontError);
        doc.setFont('Helvetica', 'normal');
      }

      doc.setFontSize(12);

      // اضافه کردن عنوان گزارش
      doc.text(t('reportReplay'), 14, 10);

      // آماده‌سازی داده‌های جدول
      const tableData = positions.map((position) => [
        formatTime(position.fixTime, 'seconds'),
        position.latitude?.toFixed(6) || '',
        position.longitude?.toFixed(6) || '',
        position.speed ? formatSpeed(speedFromKnots(position.speed, speedUnit), speedUnit, t) : '',
        position.altitude ? formatAltitude(altitudeFromMeters(position.altitude, altitudeUnit), altitudeUnit, t) : '',
        position.attributes?.distance ? formatDistance(distanceFromMeters(position.attributes.distance, distanceUnit), distanceUnit, t) : '',
        position.address || '',
      ]);

      // ایجاد جدول در PDF
      autoTable(doc, {
        head: [[
          t('positionFixTime'),
          t('positionLatitude'),
          t('positionLongitude'),
          t('positionSpeed'),
          t('positionAltitude'),
          t('positionDistance'),
          t('positionAddress'),
        ]],
        body: tableData,
        styles: { font: doc.getFont().fontName, halign: 'right', fontStyle: 'bold' },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('ReplayReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <div className={classes.root}>
      <MapView>
        <MapGeofence />
        <MapRoutePath positions={positions} />
        <MapRoutePoints positions={positions} onClick={onPointClick} showSpeedControl />
        {index < positions.length && (
          <MapPositions positions={[positions[index]]} onMarkerClick={onMarkerClick} titleField="fixTime" />
        )}
      </MapView>
      <MapScale />
      <MapCamera positions={positions} />
      <div className={classes.sidebar}>
        <Paper elevation={3} square>
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{t('reportReplay')}</Typography>
            {!expanded && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={handleDownload} title={t('reportExportKML') || 'Download KML'}>
                  <DownloadIcon />
                </IconButton>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={exportToExcel}
                  disabled={!positions.length}
                >
                  {t('reportExportExcel') || 'Excel'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={exportToPDF}
                  disabled={!positions.length}
                >
                  {t('reportExportPDF') || 'PDF'}
                </Button>
                <IconButton edge="end" onClick={() => setExpanded(true)}>
                  <TuneIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Paper>
        <Paper className={classes.content} square>
          {!expanded ? (
            <>
              <Typography variant="subtitle1" align="center">{deviceName}</Typography>
              <Slider
                className={classes.slider}
                max={positions.length - 1}
                step={null}
                marks={positions.map((_, index) => ({ value: index }))}
                value={index}
                onChange={(_, index) => setIndex(index)}
              />
              <div className={classes.controls}>
                {`${index + 1}/${positions.length}`}
                <IconButton onClick={() => setIndex((index) => index - 1)} disabled={playing || index <= 0}>
                  <FastRewindIcon />
                </IconButton>
                <IconButton onClick={() => setPlaying(!playing)} disabled={index >= positions.length - 1}>
                  {playing ? <PauseIcon /> : <PlayArrowIcon /> }
                </IconButton>
                <IconButton onClick={() => setIndex((index) => index + 1)} disabled={playing || index >= positions.length - 1}>
                  <FastForwardIcon />
                </IconButton>
                {formatTime(positions[index]?.fixTime, 'seconds')}
              </div>
            </>
          ) : (
            <ReportFilter onShow={onShow} deviceType="single" loading={loading} />
          )}
        </Paper>
      </div>
      {showCard && index < positions.length && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={positions[index]}
          onClose={() => setShowCard(false)}
          disableActions
        />
      )}
    </div>
  );
};

export default ReplayPage;