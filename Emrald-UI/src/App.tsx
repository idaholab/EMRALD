import './scss/global.scss';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import theme from './theme';
import MainCanvas from './components/layout/MainCanvas/MainCanvas';
import EmraldContextWrapper from './contexts/EmraldContextWrapper';
import { useAppData } from './hooks/useAppData';


function App() {
  const { appData, updateAppData } = useAppData();
  return (
    <ThemeProvider theme={theme}>
      <EmraldContextWrapper appData={appData} updateAppData={updateAppData}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <CssBaseline />
          <Header />
          <Sidebar />
          <MainCanvas />
        </Box>
      </EmraldContextWrapper>
    </ThemeProvider>
  );
}

export default App;
