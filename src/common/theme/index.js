import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

export default (server, darkMode, direction) =>
  useMemo(() => createTheme({
    typography: {
      fontFamily: 'Vazir, Tahoma, sans-serif',
    },
    palette: palette(server, darkMode),
    direction,
    dimensions,
    components,
  }), [server, darkMode, direction]);
