import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useRestriction } from '../../common/util/permissions';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns-jalali';

const ReportFilter = ({
  children,
  onShow,
  onExport,
  onSchedule,
  deviceType,
  loading,
}) => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const readonly = useRestriction('readonly');

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);

  const deviceIds = useMemo(() => searchParams.getAll('deviceId').map(Number), [searchParams]);
  const groupIds = useMemo(() => searchParams.getAll('groupId').map(Number), [searchParams]);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [period, setPeriod] = useState('today');

  const [customFrom, setCustomFrom] = useState(null);
  const [customTo, setCustomTo] = useState(null);
  const [selectedOption, setSelectedOption] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const evaluateDisabled = () => {
    if (deviceType !== 'none' && !deviceIds.length && !groupIds.length) return true;
    if (selectedOption === 'schedule' && (!description || !calendarId)) return true;
    return loading;
  };
  const disabled = evaluateDisabled();
  const loaded = from && to && !loading;

  const evaluateOptions = () => {
    const result = { json: t('reportShow') };
    if (onExport && loaded) {
      result.export = t('reportExport');
      result.print = t('reportPrint');
    }
    if (onSchedule && !readonly) {
      result.schedule = t('reportSchedule');
    }
    return result;
  };
  const options = evaluateOptions();

  useEffect(() => {
    if (from && to) onShow({ deviceIds, groupIds, from, to });
  }, [deviceIds, groupIds, from, to]);

  const showReport = () => {
    let selectedFrom, selectedTo;

    switch (period) {
      case 'today':
        selectedFrom = startOfDay(new Date());
        selectedTo = endOfDay(new Date());
        break;
      case 'yesterday':
        selectedFrom = startOfDay(subDays(new Date(), 1));
        selectedTo = endOfDay(subDays(new Date(), 1));
        break;
      case 'thisWeek':
        selectedFrom = startOfWeek(new Date(), { weekStartsOn: 6 }); // هفته از شنبه شروع شود
        selectedTo = endOfWeek(new Date(), { weekStartsOn: 6 });
        break;
      case 'previousWeek':
        selectedFrom = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 6 });
        selectedTo = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 6 });
        break;
      case 'thisMonth':
        selectedFrom = startOfMonth(new Date());
        selectedTo = endOfMonth(new Date());
        break;
      case 'previousMonth':
        selectedFrom = startOfMonth(subMonths(new Date(), 1));
        selectedTo = endOfMonth(subMonths(new Date(), 1));
        break;
      case 'custom':
      default:
        selectedFrom = customFrom;
        selectedTo = customTo;
        break;
    }

    if (selectedFrom && selectedTo) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('from', selectedFrom.toISOString());
      newParams.set('to', selectedTo.toISOString());
      setSearchParams(newParams, { replace: true });
    }
  };

  const updateParams = (key, values) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.delete('from');
    newParams.delete('to');
    values.forEach((id) => newParams.append(key, id));
    setSearchParams(newParams, { replace: true });
  };

  const onSelected = (type) => {
    switch (type) {
      case 'export': onExport({ deviceIds, groupIds, from, to }); break;
      case 'print': window.print(); break;
      default: setSelectedOption(type); break;
    }
  };

  const onClick = (type) => {
    switch (type) {
      case 'schedule':
        onSchedule(deviceIds, groupIds, { description, calendarId, attributes: {} });
        break;
      case 'json':
      default:
        showReport();
        break;
    }
  };

  return (
    <div className={classes.filter}>
      {deviceType !== 'none' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t(deviceType === 'multiple' ? 'deviceTitle' : 'reportDevice')}
            data={Object.values(devices).sort((a, b) => a.name.localeCompare(b.name))}
            value={deviceType === 'multiple' ? deviceIds : deviceIds.find(() => true)}
            onChange={(e) =>
              updateParams(
                'deviceId',
                deviceType === 'multiple'
                  ? e.target.value
                  : [e.target.value].filter((id) => id),
              )
            }
            multiple={deviceType === 'multiple'}
            fullWidth
          />
        </div>
      )}

      {deviceType === 'multiple' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t('settingsGroups')}
            data={Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))}
            value={groupIds}
            onChange={(e) => updateParams('groupId', e.target.value)}
            multiple
            fullWidth
          />
        </div>
      )}

      {selectedOption !== 'schedule' && (
        <>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportPeriod')}</InputLabel>
              <Select label={t('reportPeriod')} value={period} onChange={(e) => setPeriod(e.target.value)}>
                <MenuItem value="today">{t('reportToday')}</MenuItem>
                <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
                <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
                <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
                <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
                <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
                <MenuItem value="custom">{t('reportCustom')}</MenuItem>
              </Select>
            </FormControl>
          </div>

          {period === 'custom' && (
            <>
              <div className={classes.filterItem}>
                <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                  <DatePicker
                    label={t('reportFrom')}
                    value={customFrom}
                    onChange={(newValue) => setCustomFrom(newValue)}
                    format="yyyy-MM-dd"
                  />
                </LocalizationProvider>
              </div>
              <div className={classes.filterItem}>
                <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                  <DatePicker
                    label={t('reportTo')}
                    value={customTo}
                    onChange={(newValue) => setCustomTo(newValue)}
                    format="yyyy-MM-dd"
                  />
                </LocalizationProvider>
              </div>
            </>
          )}
        </>
      )}

      {children}

      <div className={classes.filterItem}>
        {Object.keys(options).length === 1 ? (
          <Button fullWidth variant="outlined" color="secondary" disabled={disabled} onClick={onClick}>
            <Typography variant="button" noWrap>
              {t(loading ? 'sharedLoading' : 'reportShow')}
            </Typography>
          </Button>
        ) : (
          <SplitButton fullWidth variant="outlined" color="secondary" disabled={disabled} onClick={onClick} selected={selectedOption} setSelected={onSelected} options={options} />
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
