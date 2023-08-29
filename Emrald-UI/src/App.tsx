import './scss/global.scss';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import theme from './theme';
import MainCanvas from './components/layout/MainCanvas';
import EmraldContextWrapper from './contexts/EmraldContextWrapper';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <EmraldContextWrapper>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <CssBaseline />
          <Header />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              position: 'relative',
              height: 'calc(100% - 75px)',
              top: '65px',
            }}
          >
            <MainCanvas />
          </Box>
        </Box>
      </EmraldContextWrapper>
    </ThemeProvider>
  );
}

export default App;
