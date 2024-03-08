import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Logo from '../../../assets/EMRALD-logo.png';
import { useModelDetailsContext } from '../../../contexts/ModelDetailsContext';
import DialogComponent from '../../common/DialogComponent/DialogComponent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import theme from '../../../theme';
import { projectOptions, downloadOptions } from './menuOptions';
import MenuButton from './MenuButton';

const EmraldLogo = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(2),
  height: '65px',
}));

export default function Header() {
  const { name, desc, updateName, updateDescription } =
    useModelDetailsContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedDesc, setUpdatedDesc] = useState(desc);

  const handleSave = () => {
    updateName(updatedName);
    updateDescription(updatedDesc);
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setUpdatedName('');
    setUpdatedDesc('');
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
        <EmraldLogo src={Logo} alt="Logo" />
        <Typography
          variant="h4"
          noWrap
          color="primary"
          fontSize="2em"
          fontWeight="bold"
        >
          Model Editor
        </Typography>
        <Box display="flex" alignItems="center" flexGrow={1} ml={5}>
          <MenuButton id={1} title="Project" options={projectOptions}/>
          <MenuButton id={2} title="Download" options={downloadOptions}/>
          <MenuButton id={3} title="Help" handleClick={() => window.open("https://emraldapp.inl.gov/docs/")}/>
          <MenuButton id={4} title="About" handleClick={() => window.open("https://emrald.inl.gov/SitePages/Overview.aspx")}/>
        </Box>

        <Typography
          variant="h5"
          noWrap
          color="primary"
          fontWeight="bold"
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenDialog(true)}
        >
          {name ? name : 'Click Here to Name Project'}
        </Typography>
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
      </DialogComponent>
    </AppBar>
  );
}
