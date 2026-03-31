import type { PropsWithChildren } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Header } from './components/layout/Header/Header';
import { MainCanvas } from './components/layout/MainCanvas/MainCanvas';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { EmraldContextWrapper } from './contexts/EmraldContextWrapper';
import { useErrorBoundary } from './hooks/useErrorBoundary';
import { theme } from './theme';
import './scss/global.scss';

function ErrorBoundary({ children }: PropsWithChildren) {
  const { hasError, errorMessage } = useErrorBoundary();

  return hasError ? (
    <>
      <h1>Something went wrong.</h1>
      <h2>Please reload the page.</h2>
      {errorMessage && <p>Error: {errorMessage}</p>}
    </>
  ) : (
    <>{children}</>
  );
}

export const App: React.FC = () => (
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
