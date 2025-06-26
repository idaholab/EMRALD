// theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme using the createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: '#2FA770', // Customize your primary color
    },
    secondary: {
      main: '#FFFFFF', // Customize your secondary color,
    },
    warning: {
      main: '#e5b81a', // Customize your warning color,
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Customize the default font family
  },
});

export default theme;
