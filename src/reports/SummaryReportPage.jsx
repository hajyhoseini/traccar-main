import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FormControl, InputLabel, Select, MenuItem, Table, TableHead, TableRow, TableBody, TableCell, Button, Box,
} from '@mui/material';
import {
  formatDistance, formatSpeed, formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import scheduleReport from './common/scheduleReport';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const columnsArray = [
  ['startTime', 'reportStartDate'],
  ['distance', 'sharedDistance'],
  ['startOdometer', 'reportStartOdometer'],
  ['endOdometer', 'reportEndOdometer'],
  ['averageSpeed', 'reportAverageSpeed'],
  ['maxSpeed', 'reportMaximumSpeed'],
  ['engineHours', 'reportEngineHours'],
  ['startHours', 'reportStartEngineHours'],
  ['endHours', 'reportEndEngineHours'],
  ['spentFuel', 'reportSpentFuel'],
];
const columnsMap = new Map(columnsArray);

const SummaryReportPage = () => {
  const navigate = useNavigate();
  const { classes } = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('summaryColumns', ['startTime', 'distance', 'averageSpeed']);
  const [daily, setDaily] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const onShow = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to, daily });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    setLoading(true);
    try {
      const response = await fetchOrThrow(`/api/reports/summary?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  });

  const onExport = useCatch(async ({ deviceIds, groupIds, from, to }) => {
    const query = new URLSearchParams({ from, to, daily });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));
    window.location.assign(`/api/reports/summary/xlsx?${query.toString()}`);
  });

  const onSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'summary';
    report.attributes.daily = daily;
    await scheduleReport(deviceIds, groupIds, report);
    navigate('/reports/scheduled');
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'deviceId':
        return devices[value].name;
      case 'startTime':
        return formatTime(value, 'date');
      case 'startOdometer':
      case 'endOdometer':
      case 'distance':
        return formatDistance(value, distanceUnit, t);
      case 'averageSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : null;
      case 'engineHours':
      case 'startHours':
      case 'endHours':
        return value > 0 ? formatNumericHours(value, t) : null;
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SummaryReport');
    XLSX.writeFile(workbook, 'SummaryReport.xlsx');
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
      doc.text(t('reportSummary'), 14, 10);

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

      doc.save('SummaryReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportSummary']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} onExport={onExport} onSchedule={onSchedule} deviceType="multiple" loading={loading}>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select label={t('sharedType')} value={daily} onChange={(e) => setDaily(e.target.value)}>
                <MenuItem value={false}>{t('reportSummary')}</MenuItem>
                <MenuItem value>{t('reportDaily')}</MenuItem>
              </Select>
            </FormControl>
          </div>
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
            <TableCell>{t('sharedDevice')}</TableCell>
            {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item) => (
            <TableRow key={(`${item.deviceId}_${Date.parse(item.startTime)}`)}>
              <TableCell>{devices[item.deviceId].name}</TableCell>
              {columns.map((key) => (
                <TableCell key={key}>
                  {formatValue(item, key)}
                </TableCell>
              ))}
            </TableRow>
          )) : (<TableShimmer columns={columns.length + 1} />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default SummaryReportPage;