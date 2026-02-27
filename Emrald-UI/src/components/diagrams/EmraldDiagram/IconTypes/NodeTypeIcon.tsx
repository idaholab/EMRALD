import KeyIcon from '@mui/icons-material/Key';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const NodeTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'stKeyState':
      return <KeyIcon sx={{ color: '#E2B84C' }} />;
    case 'stStart':
      return <PlayCircleOutlineIcon color="success" />;
    case 'stTerminal':
      return <HighlightOffIcon color="error" />;
    default:
      return <></>;
  }
};

export default NodeTypeIcon;
