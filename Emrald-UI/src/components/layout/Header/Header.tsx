import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Logo from '../../../assets/EMRALD-logo.png';
import { useModelDetailsContext } from '../../../contexts/ModelDetailsContext';
import DialogComponent from '../../common/DialogComponent/DialogComponent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { projectOptions, downloadOptions } from './menuOptions';
import MenuButton from './MenuButton';
import SearchField from './SearchBar/SearchField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { appData, updateAppData } from '../../../hooks/useAppData';

const url: string = window.location.href;
let emraldDocsUrl: string = 'https://emrald3-docs.inl.gov/'; // Default URL

const urlEnvMappings: { [key: string]: string } = {
  dev: 'https://emrald3-docs.dev.inl.gov/',
  acc: 'https://emrald3-docs.acc.inl.gov/',
  scan: 'https://emrald3-docs.scan.inl.gov/',
};

// Loop through the mappings and set the URL if a match is found
Object.keys(urlEnvMappings).forEach((key: string) => {
  if (url.includes(key)) {
    emraldDocsUrl = urlEnvMappings[key];
  }
});

const EmraldLogo = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(2),
  height: '65px',
}));

export default function Header() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const {
    name,
    desc,
    fileName,
    version,
    updateVersion,
    updateFileName,
    updateName,
    updateDescription,
  } = useModelDetailsContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedName, setUpdatedName] = useState<string>('');
  const [updatedDesc, setUpdatedDesc] = useState('');
  const [updatedVersion, setUpdatedVersion] = useState<string>('');

  useEffect(() => {
    setUpdatedName(name);
    setUpdatedDesc(desc);
    setUpdatedVersion(String(version) || '1');
  }, [name, desc, version]);

  const handleSave = () => {
    updateName(updatedName);
    updateDescription(updatedDesc);
    updateVersion(Number(updatedVersion));
    updateAppData({
      ...appData.value,
      name: updatedName,
      desc: updatedDesc,
      version: Number(updatedVersion),
    });
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setUpdatedName('');
    setUpdatedDesc('');
  };

  const handleChange = (value: string) => {
    const re = /^[0-9]+(\.[0-9]*)?$/;

    if (value === '' || re.test(value)) {
      setUpdatedVersion(value);
    }
  };

  return (
    <AppBar
      color="secondary"
      position="fixed"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: `1px 3px 1px ${theme.palette.primary.main}`,
      }}
    >
      <Toolbar>
        <EmraldLogo src={Logo} alt="Logo" sx={{ height: isMediumScreen ? '45px' : '65px' }} />
        <Typography
          variant="h4"
          noWrap
          color="primary"
          fontSize="2em"
          fontWeight="bold"
          sx={{ fontSize: isMediumScreen ? '1.2em' : '1.4em' }}
        >
          Model Editor
        </Typography>
        <Box display="flex" alignItems="center" flexGrow={1} ml={5}>
          <MenuButton id={1} title="Project" options={projectOptions(updateFileName)} />
          <MenuButton id={2} title="Download" options={downloadOptions} />
          <MenuButton id={3} title="Help" handleClick={() => window.open(emraldDocsUrl)} />
          <MenuButton
            id={4}
            title="About"
            handleClick={() => window.open('https://emrald.inl.gov/SitePages/Overview.aspx')}
            sx={{ mr: 3 }}
          />
        </Box>
        <SearchField />
        <Box>
          <Typography
            variant="h5"
            noWrap
            color="primary"
            fontWeight="bold"
            sx={{ cursor: 'pointer', fontSize: isMediumScreen ? '1em' : '1.2em' }}
            onClick={() => setOpenDialog(true)}
          >
            {name ? name : 'Click Here to Name Project'}
          </Typography>
          <Typography sx={{ fontSize: isMediumScreen ? '0.625em' : '0.75em' }}>
            {fileName ? fileName : ''}
          </Typography>
        </Box>
      </Toolbar>

      {/* Dialog for project updating name and description */}
      <DialogComponent
        open={openDialog}
        title="Enter new project name and description"
        disabled={updatedName === ''}
        onSubmit={handleSave}
        onClose={handleClose}
      >
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="desc"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          value={updatedDesc}
          onChange={(e) => setUpdatedDesc(e.target.value)}
        />
        <TextField
          margin="dense"
          id="version"
          label="Version"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          value={updatedVersion}
          onChange={(e) => handleChange(e.target.value)}
          error={!version}
          helperText={version !== undefined ? '' : 'must have a version number'}
        />
      </DialogComponent>
    </AppBar>
  );
}
