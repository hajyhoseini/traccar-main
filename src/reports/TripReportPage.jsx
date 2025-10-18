import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow, Button, Box,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import {
  formatDistance, formatSpeed, formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch, useEffectAsync } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import AddressValue from '../common/components/AddressValue';
import TableShimmer from '../common/components/TableShimmer';
import MapMarkers from '../map/MapMarkers';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const columnsArray = [
  ['startTime', 'reportStartTime'],
  ['startOdometer', 'reportStartOdometer'],
  ['startAddress', 'reportStartAddress'],
  ['endTime', 'reportEndTime'],
  ['endOdometer', 'reportEndOdometer'],
  ['endAddress', 'reportEndAddress'],
  ['distance', 'sharedDistance'],
  ['averageSpeed', 'reportAverageSpeed'],
  ['maxSpeed', 'reportMaximumSpeed'],
  ['duration', 'reportDuration'],
  ['spentFuel', 'reportSpentFuel'],
  ['driverName', 'sharedDriver'],
];
const columnsMap = new Map(columnsArray);

const TripReportPage = () => {
  const navigate = useNavigate();
  const { classes } = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('tripColumns', ['startTime', 'endTime', 'distance', 'averageSpeed']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [route, setRoute] = useState(null);

  const createMarkers = () => ([
    {
      latitude: selectedItem.startLat,
      longitude: selectedItem.startLon,
      image: 'start-success',
    },
    {
      latitude: selectedItem.endLat,
      longitude: selectedItem.endLon,
      image: 'finish-error',
    },
  ]);

  useEffectAsync(async () => {
    if (selectedItem) {
      const query = new URLSearchParams({
        deviceId: selectedItem.deviceId,
        from: selectedItem.startTime,
        to: selectedItem.endTime,
      });
      const response = await fetchOrThrow(`/api/reports/route?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      setRoute(await response.json());
    } else {
      setRoute(null);
    }
  }, [selectedItem]);

  const onShow = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    setLoading(true);
    try {
      const response = await fetchOrThrow(`/api/reports/trips?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  });

  const onExport = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    window.location.assign(`/api/reports/trips/xlsx?${query.toString()}`);
  });

  const onSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'trips';
    await scheduleReport(deviceIds, groupIds, report);
    navigate('/reports/scheduled');
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'deviceId':
        return devices[value].name;
      case 'startTime':
      case 'endTime':
        return formatTime(value, 'minutes');
      case 'startOdometer':
      case 'endOdometer':
      case 'distance':
        return formatDistance(value, distanceUnit, t);
      case 'averageSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : null;
      case 'duration':
        return formatNumericHours(value, t);
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
      case 'startAddress':
        return (<AddressValue latitude={item.startLat} longitude={item.startLon} originalAddress={value} />);
      case 'endAddress':
        return (<AddressValue latitude={item.endLat} longitude={item.endLon} originalAddress={value} />);
      default:
        return value;
    }
  };

  // تابع برای خروجی اکسل
  const exportToExcel = () => {
    const data = items.map((item) => {
      const row = { [t('sharedDevice')]: devices[item.deviceId].name };
      columns.forEach((key) => {
        const value = formatValue(item, key);
        row[t(columnsMap.get(key))] = typeof value === 'string' ? value : '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TripReport');
    XLSX.writeFile(workbook, 'TripReport.xlsx');
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
      doc.text(t('reportTrips'), 14, 10);

      // آماده‌سازی داده‌های جدول
      const tableData = items.map((item) => {
        const row = [devices[item.deviceId].name];
        columns.forEach((key) => {
          const value = formatValue(item, key);
          row.push(typeof value === 'string' ? value : '');
        });
        return row;
      });

      // ایجاد جدول در PDF
      autoTable(doc, {
        head: [[t('sharedDevice'), ...columns.map((key) => t(columnsMap.get(key)))]],
        body: tableData,
        styles: { font: doc.getFont().fontName, halign: 'right', fontStyle: 'bold' },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('TripReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportTrips']}>
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {route && (
                <>
                  <MapRoutePath positions={route} />
                  <MapMarkers markers={createMarkers()} />
                  <MapCamera positions={route} />
                </>
              )}
            </MapView>
            <MapScale />
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter onShow={onShow} onExport={onExport} onSchedule={onSchedule} deviceType="multiple" loading={loading}>
              <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
            </ReportFilter>
 <Box sx={{ display: 'flex', gap: 2, ml: 2, justifyContent: 'flex-start' }}>
                <Button
                variant="contained"
                color="primary"
                onClick={exportToExcel}
                disabled={loading || !items.length}
              >
                {t('reportExportExcel') || 'خروجی اکسل'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportToPDF}
                disabled={loading || !items.length}
              >
                {t('reportExportPDF') || 'خروجی PDF'}
              </Button>
            </Box>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                <TableCell>{t('sharedDevice')}</TableCell>
                {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? items.map((item) => (
                <TableRow key={item.startPositionId}>
                  <TableCell className={classes.columnAction} padding="none">
                    {selectedItem === item ? (
                      <IconButton size="small" onClick={() => setSelectedItem(null)}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => setSelectedItem(item)}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{devices[item.deviceId].name}</TableCell>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      {formatValue(item, key)}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 2} startAction />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default TripReportPage;