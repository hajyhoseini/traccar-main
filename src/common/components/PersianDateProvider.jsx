import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import jalaliday from 'jalaliday';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// فعال‌سازی افزونه‌ها
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(jalaliday);

// تنظیم منطقه زمانی پیش‌فرض به تهران
dayjs.tz.setDefault('Asia/Tehran');

// تنظیم زبان و تقویم به فارسی (شمسی)
dayjs.locale('fa');
dayjs.calendar('jalali');

// تابع برای تبدیل تاریخ به فرمت iCal با کم کردن یک روز
export const formatCalendarTime = (time) => {
  // تبدیل به میلادی و کم کردن یک روز برای جبران آفست
  const gregorianDate = time.calendar('gregory').tz('Asia/Tehran').subtract(1, 'day');
  return `TZID=Asia/Tehran:${gregorianDate.format('YYYYMMDDTHHmmss')}`;
};

// تابع برای پارsing تاریخ از iCal به شمسی با اضافه کردن یک روز
export const parseDateLine = (line) => {
  if (!line) {
    // تاریخ پیش‌فرض: امروز با کم کردن آفست
    return dayjs().tz('Asia/Tehran').calendar('jalali').subtract(1, 'day');
  }
  const dateStr = line.split(':')[1]; // مثلا "20250915T090000"
  // پارس تاریخ و اضافه کردن یک روز برای جبران آفست
  return dayjs.tz(dateStr, 'YYYYMMDDTHHmmss', 'Asia/Tehran').add(1, 'day').calendar('jalali');
};

const PersianDateProvider = ({ children }) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="fa"
      dateLibInstance={dayjs.tz}
    >
      {children}
    </LocalizationProvider>
  );
};

export default PersianDateProvider;