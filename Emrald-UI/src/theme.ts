import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true;
  }
}

// Attribute set on <html> for the active scheme. Keep in sync with index.html and global.scss.
export const COLOR_SCHEME_ATTRIBUTE = 'data-emrald-theme';
export const MODE_STORAGE_KEY = 'emrald-theme-mode';

// Brand colors constant between light & dark mode
const brand = {
  primary: {
    main: '#2FA770',
  },
  warning: {
    main: '#e5b81a',
  },
};

// Dark neutrals are plain grays; green is reserved for brand, selection and status colors.
const dark = {
  canvas: '#131313',
  paper: '#1d1d1d',
  raised: '#252525',
  control: '#2d2d2d',
  controlHover: '#383838',
  text: '#e8e8e8',
  textMuted: '#aaaaaa',
};

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE,
  },
  colorSchemes: {
    light: {
      palette: {
        ...brand,
        secondary: {
          main: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        ...brand,
        // "secondary" is the neutral surface color used for the header and cancel-style buttons
        secondary: {
          main: dark.control,
          light: dark.controlHover,
          dark: dark.raised,
          contrastText: dark.text,
        },
        background: {
          default: dark.canvas,
          paper: dark.paper,
        },
        text: {
          primary: dark.text,
          secondary: dark.textMuted,
          disabled: 'rgba(232, 232, 232, 0.42)',
        },
        divider: 'rgba(232, 232, 232, 0.12)',
      },
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        // Flat surfaces in dark mode so paper matches the --emrald-surface token
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
