import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MuiFileInput } from 'mui-file-input';
import EditItemView from './components/EditItemView';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import { prefixString } from '../common/util/stringUtils';
import { calendarsActions } from '../store';
import { useCatch } from '../reactHelper';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.locale('fa');
dayjs.extend(jalaliday);

// تبدیل تاریخ به فرمت مناسب برای فایل iCal (میلادی)
const formatCalendarTime = (time) => {
  const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `TZID=${tzid}:${time.calendar('gregory').format('YYYYMMDDTHHmmss')}`;
};

// تبدیل خط تاریخ iCal به dayjs (شمسی)
const parseDateLine = (line) => {
  if (!line) return dayjs().calendar('jalali');
  const dateStr = line.split(':')[1]; // مثلا "20250915T090000"
  return dayjs(dateStr, 'YYYYMMDDTHHmmss').calendar('jalali');
};

const parseRule = (rule) => {
  if (rule.endsWith('COUNT=1')) {
    return { frequency: 'ONCE' };
  }
  const fragments = rule.split(';');
  const frequency = fragments[0].substring(11);
  const by = fragments.length > 1 ? fragments[1].split('=')[1].split(',') : null;
  return { frequency, by };
};

const formatRule = (rule) => {
  const by = rule.by && rule.by.join(',');
  switch (rule.frequency) {
    case 'DAILY':
      return `RRULE:FREQ=${rule.frequency}`;
    case 'WEEKLY':
      return `RRULE:FREQ=${rule.frequency};BYDAY=${by || 'SU'}`;
    case 'MONTHLY':
      return `RRULE:FREQ=${rule.frequency};BYMONTHDAY=${by || 1}`;
    default:
      return 'RRULE:FREQ=DAILY;COUNT=1';
  }
};

const updateCalendar = (lines, index, element) =>
  window.btoa(lines.map((e, i) => (i !== index ? e : element)).join('\n'));

const simpleCalendar = () => {
  const startDate = dayjs();
  const endDate = startDate.add(1, 'hour');
  return window.btoa(
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Traccar//NONSGML Traccar//EN',
      'BEGIN:VEVENT',
      'UID:00000000-0000-0000-0000-000000000000',
      `DTSTART;${formatCalendarTime(startDate)}`,
      `DTEND;${formatCalendarTime(endDate)}`,
      'RRULE:FREQ=DAILY',
      'SUMMARY:Event',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n'),
  );
};

const CalendarPage = () => {
  const { classes } = useSettingsStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const [item, setItem] = useState();
  const [file, setFile] = useState(null);

  const decoded = item && item.data && window.atob(item.data);
  const simple = decoded && decoded.indexOf('//Traccar//') > 0;
  const lines = decoded && decoded.split('\n');
  const rule = simple && parseRule(lines[7]);

  const handleFileChange = (newFile) => {
    setFile(newFile);
    if (newFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const { result } = event.target;
        setItem({ ...item, data: result.substr(result.indexOf(',') + 1) });
      };
      reader.readAsDataURL(newFile);
    }
  };

  const onItemSaved = useCatch(async () => {
    const response = await fetchOrThrow('/api/calendars');
    dispatch(calendarsActions.refresh(await response.json()));
  });

  const validate = () => item && item.name && item.data;

  return (
    <EditItemView
      endpoint="calendars"
      item={item}
      setItem={setItem}
      defaultItem={{ data: simpleCalendar() }}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedCalendar']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(event) =>
                  setItem({ ...item, name: event.target.value })
                }
                label={t('sharedName')}
              />
              <FormControl>
                <InputLabel>{t('sharedType')}</InputLabel>
                <Select
                  label={t('sharedType')}
                  value={simple ? 'simple' : 'custom'}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      data:
                        e.target.value === 'simple' ? simpleCalendar() : null,
                    })
                  }
                >
                  <MenuItem value="simple">{t('calendarSimple')}</MenuItem>
                  <MenuItem value="custom">{t('reportCustom')}</MenuItem>
                </Select>
              </FormControl>

              {simple ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa">
                    <DateTimePicker
                      label={t('reportFrom')}
                      value={lines && lines[5] ? parseDateLine(lines[5]) : dayjs().calendar('jalali')}
                      onChange={(newValue) => {
                        if (newValue?.isValid()) {
                          const gregorianDate = newValue.calendar('gregory');
                          const time = formatCalendarTime(gregorianDate);
                          setItem({
                            ...item,
                            data: updateCalendar(
                              lines,
                              5,
                              `DTSTART;${time}`,
                            ),
                          });
                        }
                      }}
                      format="YYYY/MM/DD HH:mm"
                      calendar="jalali"
                      minDate={dayjs()}
                      maxDate={dayjs('2030-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss')}
                      slotProps={{ textField: { dir: 'rtl' } }}
                    />
                    <DateTimePicker
                      label={t('reportTo')}
                      value={lines && lines[6] ? parseDateLine(lines[6]) : dayjs().add(1, 'hour').calendar('jalali')}
                      onChange={(newValue) => {
                        if (newValue?.isValid()) {
                          const gregorianDate = newValue.calendar('gregory');
                          const time = formatCalendarTime(gregorianDate);
                          setItem({
                            ...item,
                            data: updateCalendar(
                              lines,
                              6,
                              `DTEND;${time}`,
                            ),
                          });
                        }
                      }}
                      format="YYYY/MM/DD HH:mm"
                      calendar="jalali"
                      minDate={dayjs()}
                      maxDate={dayjs('2030-12-31 23:59:59', 'YYYY-MM-DD HH:mm:ss')}
                      slotProps={{ textField: { dir: 'rtl' } }}
                    />
                  </LocalizationProvider>

                  <FormControl>
                    <InputLabel>{t('calendarRecurrence')}</InputLabel>
                    <Select
                      label={t('calendarRecurrence')}
                      value={rule.frequency}
                      onChange={(e) =>
                        setItem({
                          ...item,
                          data: updateCalendar(
                            lines,
                            7,
                            formatRule({ frequency: e.target.value }),
                          ),
                        })
                      }
                    >
                      {['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'].map((it) => (
                        <MenuItem key={it} value={it}>
                          {t(prefixString('calendar', it.toLowerCase()))}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {['WEEKLY', 'MONTHLY'].includes(rule.frequency) && (
                    <FormControl>
                      <InputLabel>{t('calendarDays')}</InputLabel>
                      <Select
                        multiple
                        label={t('calendarDays')}
                        value={rule.by}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            data: updateCalendar(
                              lines,
                              7,
                              formatRule({
                                ...rule,
                                by: e.target.value,
                              }),
                            ),
                          })
                        }
                      >
                        {rule.frequency === 'WEEKLY'
                          ? [
                              'sunday',
                              'monday',
                              'tuesday',
                              'wednesday',
                              'thursday',
                              'friday',
                              'saturday',
                            ].map((it) => (
                              <MenuItem
                                key={it}
                                value={it.substring(0, 2).toUpperCase()}
                              >
                                {t(prefixString('calendar', it))}
                              </MenuItem>
                            ))
                          : Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (it) => (
                                <MenuItem key={it} value={String(it)}>
                                  {it}
                                </MenuItem>
                              ),
                            )}
                      </Select>
                    </FormControl>
                  )}
                </>
              ) : (
                <MuiFileInput
                  placeholder={t('sharedSelectFile')}
                  value={file}
                  onChange={handleFileChange}
                />
              )}
            </AccordionDetails>
          </Accordion>

          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) =>
              setItem({ ...item, attributes })
            }
            definitions={{}}
          />
        </>
      )}
    </EditItemView>
  );
};

export default CalendarPage;