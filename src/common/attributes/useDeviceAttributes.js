import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'command.sender': {
    name: "  کانال دستورات (نوع کانال)",
    type: 'string',
  },
  'web.reportColor': {
    name: t('attributeWebReportColor'),
    type: 'string',
    subtype: 'color',
  },
  devicePassword: {
    name: t('attributeDevicePassword'),
    type: 'string',
  },
  deviceImage: {
    name: t('attributeDeviceImage'),
    type: 'string',
  },
  'processing.copyAttributes': {
    name: "  کپی ویژگیها (EN)  ",
    type: 'string',
  },
  'decoder.timezone': {
    name: t('sharedTimezone'),
    type: 'string',
  },
  'forward.url': {
    name: " آدرس ارسال داده‌ها (URL)",
    type: 'string',
  },
}), [t]);
