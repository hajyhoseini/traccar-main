import { useState } from 'react';
import {
  Table, TableRow, TableCell, TableHead, TableBody, Button, Box,
} from '@mui/material';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const columnsArray = [
  ['captureTime', 'statisticsCaptureTime'],
  ['activeUsers', 'statisticsActiveUsers'],
  ['activeDevices', 'statisticsActiveDevices'],
  ['requests', 'statisticsRequests'],
  ['messagesReceived', 'statisticsMessagesReceived'],
  ['messagesStored', 'statisticsMessagesStored'],
  ['mailSent', 'notificatorMail'],
  ['smsSent', 'notificatorSms'],
  ['geocoderRequests', 'statisticsGeocoder'],
  ['geolocationRequests', 'statisticsGeolocation'],
];
const columnsMap = new Map(columnsArray);

const StatisticsPage = () => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const [columns, setColumns] = usePersistedState('statisticsColumns', ['captureTime', 'activeUsers', 'activeDevices', 'messagesStored']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const onShow = useCatch(async ({ from, to }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ from, to });
      const response = await fetchOrThrow(`/api/statistics?${query.toString()}`);
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  });

  // تابع برای فرمت‌دهی مقادیر برای اکسل و PDF
  const formatValue = (item, key) => {
    if (item[key] == null) return '';
    return key === 'captureTime' ? formatTime(item[key], 'date') : item[key];
  };

  // تابع برای خروجی اکسل
  const exportToExcel = () => {
    const data = items.map((item) => {
      const row = {};
      columns.forEach((key) => {
        row[t(columnsMap.get(key))] = formatValue(item, key);
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StatisticsReport');
    XLSX.writeFile(workbook, 'StatisticsReport.xlsx');
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
      doc.text(t('statisticsTitle'), 14, 10);

      // آماده‌سازی داده‌های جدول
      const tableData = items.map((item) => (
        columns.map((key) => formatValue(item, key))
      ));

      // ایجاد جدول در PDF
      autoTable(doc, {
        head: [columns.map((key) => t(columnsMap.get(key)))],
        body: tableData,
        styles: { font: doc.getFont().fontName, halign: 'right', fontStyle: 'bold' },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('StatisticsReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} deviceType="none" loading={loading}>
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
            {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item) => (
            <TableRow key={item.id}>
              {columns.map((key) => (
                <TableCell key={key}>
                  {key === 'captureTime' ? formatTime(item[key], 'date') : item[key]}
                </TableCell>
              ))}
            </TableRow>
          )) : (<TableShimmer columns={columns.length} />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default StatisticsPage;