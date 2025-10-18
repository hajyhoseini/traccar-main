import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'processing.copyAttributes': {
    name: "  کپی ویژگیها (EN)  ",
    type: 'string',
  },
  'decoder.timezone': {
    name: t('sharedTimezone'),
    type: 'string',
  },
}), [t]);
