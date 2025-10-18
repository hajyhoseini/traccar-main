import {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow, Button, Box,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import PositionValue from '../common/components/PositionValue';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import { useRestriction } from '../common/util/permissions';
import CollectionActions from '../settings/components/CollectionActions';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatTime } from '../common/util/formatter'; // اضافه کردن formatTime

const PositionsReportPage = () => {
  const navigate = useNavigate();
  const { classes } = useReportStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const readonly = useRestriction('readonly');

  const [available, setAvailable] = useState([]);
  const [columns, setColumns] = useState(['fixTime', 'latitude', 'longitude', 'speed', 'address']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const selectedIcon = useRef();

  useEffect(() => {
    if (selectedIcon.current) {
      selectedIcon.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [selectedIcon.current]);

  const onMapPointClick = useCallback((positionId) => {
    setSelectedItem(items.find((it) => it.id === positionId));
  }, [items, setSelectedItem]);

  const onShow = useCatch(async ({ deviceIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    setLoading(true);
    try {
      const response = await fetchOrThrow(`/api/reports/route?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      const keySet = new Set();
      const keyList = [];
      data.forEach((position) => {
        Object.keys(position).forEach((it) => keySet.add(it));
        Object.keys(position.attributes).forEach((it) => keySet.add(it));
      });
      ['id', 'deviceId', 'outdated', 'network', 'attributes'].forEach((key) => keySet.delete(key));
      Object.keys(positionAttributes).forEach((key) => {
        if (keySet.has(key)) {
          keyList.push(key);
          keySet.delete(key);
        }
      });
      setAvailable([...keyList, ...keySet].map((key) => [key, positionAttributes[key]?.name || key]));
      setItems(data);
    } finally {
      setLoading(false);
    }
  });

  const onExport = useCatch(async ({ deviceIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    window.location.assign(`/api/positions/csv?${query.toString()}`);
  });

  const onSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'route';
    await scheduleReport(deviceIds, groupIds, report);
    navigate('/reports/scheduled');
  });

  // تابع برای فرمت‌دهی مقادیر برای اکسل و PDF
  const formatValue = (position, key) => {
    const value = position.hasOwnProperty(key) ? position[key] : position.attributes[key];
    if (value == null) return '';
    if (key === 'fixTime') return formatTime(value, 'seconds');
    if (key === 'latitude' || key === 'longitude') return value.toFixed(6);
    if (positionAttributes[key]?.dataType === 'speed') return value.toFixed(2);
    if (positionAttributes[key]?.dataType === 'altitude') return value.toFixed(2);
    if (positionAttributes[key]?.dataType === 'distance') return value.toFixed(2);
    if (positionAttributes[key]?.dataType === 'volume') return value.toFixed(2);
    if (positionAttributes[key]?.dataType === 'hours') return (value / 1000).toFixed(2);
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  };

  // تابع برای خروجی اکسل
  const exportToExcel = () => {
    const data = items.slice(0, 4000).map((item) => {
      const row = {};
      columns.forEach((key) => {
        row[positionAttributes[key]?.name || key] = formatValue(item, key);
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PositionsReport');
    XLSX.writeFile(workbook, 'PositionsReport.xlsx');
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
      doc.text(t('reportPositions'), 14, 10);

      // آماده‌سازی داده‌های جدول
      const tableData = items.slice(0, 4000).map((item) => (
        columns.map((key) => formatValue(item, key))
      ));

      // ایجاد جدول در PDF
      autoTable(doc, {
        head: [columns.map((key) => positionAttributes[key]?.name || key)],
        body: tableData,
        styles: { font: doc.getFont().fontName, halign: 'right', fontStyle: 'bold' },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('PositionsReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportPositions']}>
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {[...new Set(items.map((it) => it.deviceId))].map((deviceId) => {
                const positions = items.filter((position) => position.deviceId === deviceId);
                return (
                  <Fragment key={deviceId}>
                    <MapRoutePath positions={positions} />
                    <MapRoutePoints positions={positions} onClick={onMapPointClick} />
                  </Fragment>
                );
              })}
              <MapPositions positions={[selectedItem]} titleField="fixTime" />
            </MapView>
            <MapScale />
            <MapCamera positions={items} />
          </div>
        )}
        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter onShow={onShow} onExport={onExport} onSchedule={onSchedule} deviceType="single" loading={loading}>
              <ColumnSelect
                columns={columns}
                setColumns={setColumns}
                columnsArray={available}
                rawValues
                disabled={!items.length}
              />
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
                {columns.map((key) => (<TableCell key={key}>{positionAttributes[key]?.name || key}</TableCell>))}
                <TableCell className={classes.columnAction} />
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? items.slice(0, 4000).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.columnAction} padding="none">
                    {selectedItem === item ? (
                      <IconButton size="small" onClick={() => setSelectedItem(null)} ref={selectedIcon}>
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => setSelectedItem(item)}>
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                  {columns.map((key) => (
                    <TableCell key={key}>
                      <PositionValue
                        position={item}
                        property={item.hasOwnProperty(key) ? key : null}
                        attribute={item.hasOwnProperty(key) ? null : key}
                      />
                    </TableCell>
                  ))}
                  <TableCell className={classes.actionCellPadding}>
                    <CollectionActions
                      itemId={item.id}
                      endpoint="positions"
                      readonly={readonly}
                      setTimestamp={() => {
                        setItems(items.filter((position) => position.id !== item.id));
                      }}
                    />
                  </TableCell>
                </TableRow>
              )) : (<TableShimmer columns={columns.length + 1} startAction />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default PositionsReportPage;