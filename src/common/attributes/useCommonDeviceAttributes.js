import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'number',
    subtype: 'speed',
  },
  fuelDropThreshold: {
    name: "   حد اتمام سوخت (لیتر)  ",
    type: 'number',
  },
  fuelIncreaseThreshold: {
    name: "   حد تکمیل سوخت (لیتر)  ",
    type: 'number',
  },
  'report.ignoreOdometer': {
    name: t('attributeReportIgnoreOdometer'),
    type: 'boolean',
  },
  deviceInactivityStart: {
    name: "  غیرفعال شدن دستگاه پس از (ثانیه) ",
    type: 'number',
  },
  deviceInactivityPeriod: {
    name: " بازه غیر فعال بودن دستگاه (ثانیه)",
    type: 'number',
  },
  notificationTokens: {
    name: "  اخطار انقظاء توکن (ثانیه)  ",
    type: 'string',
  },
}), [t]);
