import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import ErrorHandler from './common/components/ErrorHandler';
import Navigation from './Navigation';
import preloadImages from './map/core/preloadImages';
import NativeInterface from './common/components/NativeInterface';
import ServerProvider from './ServerProvider';
import ErrorBoundary from './ErrorBoundary';
import AppThemeProvider from './AppThemeProvider';
import './index.css'; // فایل CSS که direction: rtl و font-family توشه
import PersianDateProvider from './common/components/PersianDateProvider.jsx';

preloadImages();

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <LocalizationProvider>
        <PersianDateProvider>  {/* اینجا اضافه کن */}
          <StyledEngineProvider injectFirst>
            <AppThemeProvider>
              <CssBaseline />
              <ServerProvider>
                <BrowserRouter>
                  <Navigation />
                </BrowserRouter>
                <ErrorHandler />
                <NativeInterface />
              </ServerProvider>
            </AppThemeProvider>
          </StyledEngineProvider>
        </PersianDateProvider>
      </LocalizationProvider>
    </Provider>
  </ErrorBoundary>,
);
;
