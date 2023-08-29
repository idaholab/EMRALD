// theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme using the createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Customize your primary color
    },
    secondary: {
      main: '#FFFFFF', // Customize your secondary color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Customize the default font family
  },
});

export default theme;
