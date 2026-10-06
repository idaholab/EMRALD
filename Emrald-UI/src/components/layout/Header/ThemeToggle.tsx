import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

type Scheme = 'light' | 'dark';

// @mui/system 7.0.2 omits useCurrentColorScheme.d.ts, so the hook's result type is partially unresolved
interface ColorSchemeApi {
  mode?: Scheme | 'system';
  systemMode?: Scheme;
  setMode: (mode: Scheme | 'system' | null) => void;
}

export const ThemeToggle: React.FC = () => {
  const { mode, systemMode, setMode }
    = useColorScheme() as unknown as ColorSchemeApi;
  // mode is undefined until the provider hydrates
  if (!mode) {
    return null;
  }
  const resolved = mode === 'system' ? systemMode : mode;
  const isDark = resolved === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={() => {
          setMode(isDark ? 'light' : 'dark');
        }}
        sx={{ ml: 2, color: 'text.secondary' }}
      >
        {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  );
};
