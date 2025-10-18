import { forwardRef, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTheme } from '@mui/material/styles';
import { devicesActions } from '../store';
import { useEffectAsync } from '../reactHelper';
import DeviceRow from './DeviceRow';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  list: {
    maxHeight: '100%',
  },
  listInner: {
    position: 'relative',
    margin: theme.spacing(1.5, 0),
  },
}));

const OuterElement = forwardRef(function OuterElement(props, ref) {
  const theme = useTheme();
  const { className, style, ...rest } = props;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        direction: theme.direction,
      }}
      {...rest}
    />
  );
});

const DeviceList = ({ devices, closeAllTrigger, expandAllTrigger }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const listRef = useRef(null); // Ref برای VariableSizeList
  const [expandedDeviceIds, setExpandedDeviceIds] = useState([]);
  const [, setTime] = useState(Date.now());

  // به‌روزرسانی دوره‌ای برای رفرش زمان
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // بارگذاری اولیه دستگاه‌ها
  useEffectAsync(async () => {
    const response = await fetchOrThrow('/api/devices');
    dispatch(devicesActions.refresh(await response.json()));
  }, []);

  // بستن همه آکاردیون‌ها وقتی closeAllTrigger تغییر می‌کند
  useEffect(() => {
    if (closeAllTrigger > 0) {
      setExpandedDeviceIds([]);
      if (listRef.current) {
        listRef.current.resetAfterIndex(0); // بازسازی اندازه‌ها
      }
    }
  }, [closeAllTrigger]);

  // باز کردن همه آکاردیون‌ها وقتی expandAllTrigger تغییر می‌کند
  useEffect(() => {
    if (expandAllTrigger > 0) {
      setExpandedDeviceIds(devices.map((device) => device.id));
      if (listRef.current) {
        listRef.current.resetAfterIndex(0); // بازسازی اندازه‌ها
      }
    }
  }, [expandAllTrigger, devices]);

  // به‌روزرسانی اندازه ردیف‌ها وقتی expandedDeviceIds تغییر می‌کند
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0); // بازسازی اندازه‌ها
    }
  }, [expandedDeviceIds]);

  // تابع برای مدیریت تغییر آکاردیون
  const handleAccordionChange = (deviceId) => {
    setExpandedDeviceIds((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId) // بستن آکاردیون
        : [...prev, deviceId] // باز کردن آکاردیون
    );
  };

  // محاسبه اندازه ردیف بر اساس وضعیت باز یا بسته بودن
  const getItemSize = (index) => {
    return expandedDeviceIds.includes(devices[index].id) ? 200 : 72; // 200 برای باز، 72 برای بسته
  };

  // رندر ردیف دستگاه با propهای اضافی
  const Row = ({ index, style, data }) => (
    <div style={style}>
      <DeviceRow
        data={data}
        index={index}
        expanded={expandedDeviceIds.includes(data[index].id)}
        onAccordionChange={() => handleAccordionChange(data[index].id)}
      />
    </div>
  );

  return (
    <AutoSizer className={classes.list}>
      {({ height, width }) => (
        <VariableSizeList
          ref={listRef}
          width={width}
          height={height}
          itemCount={devices.length}
          itemData={devices}
          itemSize={getItemSize}
          overscanCount={10}
          outerElementType={OuterElement}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
};

export default DeviceList;