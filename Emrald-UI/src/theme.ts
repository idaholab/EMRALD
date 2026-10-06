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

// Dark neutrals are tinted toward the brand green (OKLCH hue ~160, chroma ~0.01).
const dark = {
  canvas: '#111513',
  paper: '#1b1f1d',
  raised: '#222825',
  control: '#2a312d',
  controlHover: '#353d38',
  text: '#e5e9e6',
  textMuted: '#a5ada8',
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
          disabled: 'rgba(229, 233, 230, 0.42)',
        },
        divider: 'rgba(229, 233, 230, 0.12)',
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
