import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  cursor: 'pointer',
  height: 'max-content',
  px: 2,
}));

export function MinimizedWindows() {
  const { windows, toggleMinimize } = useWindowContext();

  const minimizedWindows = useMemo(
    () => windows.filter(window => window.minimized),
    [windows],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
      }}
    >
      {minimizedWindows.length === 0 ? null : (
        <>
          <Typography variant="h6">Minimized Windows</Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: '80vw', alignItems: 'center' }}
            useFlexGap
            flexWrap="wrap"
          >
            {minimizedWindows.map(window => (
              <Item
                key={window.id}
                onClick={() => {
                  toggleMinimize(window);
                }}
              >
                <Typography sx={{ flex: 1 }}>{window.title}</Typography>
                &nbsp;
                <OpenInFullIcon sx={{ ml: 3 }} />
              </Item>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
