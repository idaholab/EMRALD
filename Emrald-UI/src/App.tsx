import './scss/global.scss';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import theme from './theme';
import MainCanvas from './components/layout/MainCanvas/MainCanvas';
import EmraldContextWrapper from './contexts/EmraldContextWrapper';
import { ReactNode } from 'react';
import useErrorBoundary from './hooks/useErrorBoundary';

function ErrorBoundary({ children }: { children: ReactNode }) {
  const { hasError, errorMessage } = useErrorBoundary();

  if (hasError) {
    return (
      <>
        <h1>Something went wrong.</h1>
        <h2>Please reload the page.</h2>
        {errorMessage && <p>Error: {errorMessage}</p>}
      </>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <EmraldContextWrapper>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <CssBaseline />
            <Header />
            <Sidebar />
            <MainCanvas />
          </Box>
        </EmraldContextWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
