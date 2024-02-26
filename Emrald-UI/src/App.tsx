import './scss/global.scss';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import theme from './theme';
import MainCanvas from './components/layout/MainCanvas/MainCanvas';
import EmraldContextWrapper from './contexts/EmraldContextWrapper';
import { useAppData } from './hooks/useAppData';
import { useEffect, useState } from 'react';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleWindowError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  if (hasError) {
    // You can render a custom error UI here
    return <h1>Something went wrong.</h1>;
  }

  return <>{children}</>;
}

function App() {
  const { appData, updateAppData } = useAppData();
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <EmraldContextWrapper appData={appData} updateAppData={updateAppData}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <CssBaseline />
            <Header />
            <Sidebar />
            <MainCanvas appData={appData} updateAppData={updateAppData}/>
          </Box>
        </EmraldContextWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
