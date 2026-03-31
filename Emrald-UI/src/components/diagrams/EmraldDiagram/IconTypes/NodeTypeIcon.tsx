import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyIcon from '@mui/icons-material/Key';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export const NodeTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'stKeyState': {
      return <KeyIcon sx={{ color: '#E2B84C' }} />;
    }
    case 'stStart': {
      return <PlayCircleOutlineIcon color="success" />;
    }
    case 'stTerminal': {
      return <HighlightOffIcon color="error" />;
    }
    default: {
      return <></>;
    }
  }
};
