import dayjs from 'dayjs';
import { useState, useRef } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, useTheme, Button, Box,
} from '@mui/material';
import {
  Brush, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import ReportFilter from './components/ReportFilter';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import { useAttributePreference } from '../common/util/preferences';
import {
  altitudeFromMeters, distanceFromMeters, speedFromKnots, speedToKnots, volumeFromLiters,
} from '../common/util/converter';
import useReportStyles from './common/useReportStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChartReportPage = () => {
  const { classes } = useReportStyles();
  const theme = useTheme();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [items, setItems] = useState([]);
  const [types, setTypes] = useState(['speed']);
  const [selectedTypes, setSelectedTypes] = useState(['speed']);
  const [timeType, setTimeType] = useState('fixTime');
  const chartRef = useRef(null);

  const values = items.map((it) => selectedTypes.map((type) => it[type]).filter((value) => value != null));
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 100;
  const valueRange = maxValue - minValue;

  const onShow = useCatch(async ({ deviceIds, from, to }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    const response = await fetchOrThrow(`/api/reports/route?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    const positions = await response.json();
    const keySet = new Set();
    const keyList = [];
    const formattedPositions = positions.map((position) => {
      const data = { ...position, ...position.attributes };
      const formatted = {};
      formatted.fixTime = dayjs(position.fixTime).valueOf();
      formatted.deviceTime = dayjs(position.deviceTime).valueOf();
      formatted.serverTime = dayjs(position.serverTime).valueOf();
      Object.keys(data).filter((key) => !['id', 'deviceId'].includes(key)).forEach((key) => {
        const value = data[key];
        if (typeof value === 'number') {
          keySet.add(key);
          const definition = positionAttributes[key] || {};
          switch (definition.dataType) {
            case 'speed':
              if (key === 'obdSpeed') {
                formatted[key] = speedFromKnots(speedToKnots(value, 'kmh'), speedUnit).toFixed(2);
              } else {
                formatted[key] = speedFromKnots(value, speedUnit).toFixed(2);
              }
              break;
            case 'altitude':
              formatted[key] = altitudeFromMeters(value, altitudeUnit).toFixed(2);
              break;
            case 'distance':
              formatted[key] = distanceFromMeters(value, distanceUnit).toFixed(2);
              break;
            case 'volume':
              formatted[key] = volumeFromLiters(value, volumeUnit).toFixed(2);
              break;
            case 'hours':
              formatted[key] = (value / 1000).toFixed(2);
              break;
            default:
              formatted[key] = value;
              break;
          }
        }
      });
      return formatted;
    });
    Object.keys(positionAttributes).forEach((key) => {
      if (keySet.has(key)) {
        keyList.push(key);
        keySet.delete(key);
      }
    });
    setTypes([...keyList, ...keySet]);
    setItems(formattedPositions);
  });

  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.text.secondary,
  ];

  // تابع برای خروجی اکسل
  const exportToExcel = () => {
    const data = items.map((item) => {
      const row = { [t('reportTimeType')]: formatTime(item[timeType], 'seconds') };
      selectedTypes.forEach((type) => {
        row[positionAttributes[type]?.name || type] = item[type] || '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ChartReport');
    XLSX.writeFile(workbook, 'ChartReport.xlsx');
  };

  // تابع برای خروجی PDF با نمودار
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
      doc.text(t('reportChart'), 14, 10);

      // گرفتن تصویر از نمودار
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2, // برای کیفیت بهتر
          backgroundColor: theme.palette.background.default,
        });
        const imgData = canvas.toDataURL('image/png');

        // محاسبه ابعاد تصویر
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 28; // حاشیه 14 از هر طرف
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // اضافه کردن تصویر نمودار به PDF
        doc.addImage(imgData, 'PNG', 14, 20, pdfWidth, pdfHeight);
      } else {
        throw new Error('نمودار پیدا نشد');
      }

      doc.save('ChartReport.pdf');
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      alert('مشکلی در تولید فایل PDF پیش آمد. لطفا کنسول مرورگر را چک کنید.');
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportChart']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} deviceType="single">
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportChartType')}</InputLabel>
              <Select
                label={t('reportChartType')}
                value={selectedTypes}
                onChange={(e) => setSelectedTypes(e.target.value)}
                multiple
                disabled={!items.length}
              >
                {types.map((key) => (
                  <MenuItem key={key} value={key}>{positionAttributes[key]?.name || key}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportTimeType')}</InputLabel>
              <Select
                label={t('reportTimeType')}
                value={timeType}
                onChange={(e) => setTimeType(e.target.value)}
                disabled={!items.length}
              >
                <MenuItem value="fixTime">{t('positionFixTime')}</MenuItem>
                <MenuItem value="deviceTime">{t('positionDeviceTime')}</MenuItem>
                <MenuItem value="serverTime">{t('positionServerTime')}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </ReportFilter>
        <Box sx={{ display: 'flex', gap: 2, ml: 2, justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            disabled={!items.length}
          >
            {t('reportExportExcel') || 'خروجی اکسل'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToPDF}
            disabled={!items.length}
          >
            {t('reportExportPDF') || 'خروجی PDF'}
          </Button>
        </Box>
      </div>
      {items.length > 0 && (
        <div className={classes.chart} ref={chartRef}>
          <ResponsiveContainer>
            <LineChart
              data={items}
              margin={{
                top: 10, right: 40, left: 0, bottom: 10,
              }}
            >
              <XAxis
                stroke={theme.palette.text.primary}
                dataKey={timeType}
                type="number"
                tickFormatter={(value) => formatTime(value, 'time')}
                domain={['dataMin', 'dataMax']}
                scale="time"
              />
              <YAxis
                stroke={theme.palette.text.primary}
                type="number"
                tickFormatter={(value) => value.toFixed(2)}
                domain={[minValue - valueRange / 5, maxValue + valueRange / 5]}
              />
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
              <Tooltip
                wrapperStyle={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
                formatter={(value, key) => [value, positionAttributes[key]?.name || key]}
                labelFormatter={(value) => formatTime(value, 'seconds')}
              />
              <Brush
                dataKey={timeType}
                height={30}
                stroke={theme.palette.primary.main}
                tickFormatter={() => ''}
              />
              {selectedTypes.map((type, index) => (
                <Line
                  type="monotone"
                  dataKey={type}
                  stroke={colorPalette[index % colorPalette.length]}
                  dot={false}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
};

export default ChartReportPage;