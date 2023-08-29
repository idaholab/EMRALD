import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Logo from '../../assets/EMRALD-logo.png';
import { useModelDetailsContext } from '../../contexts/ModelDetailsContext';
import DialogComponent from '../common/DialogComponent/DialogComponent';
import TextField from '@mui/material/TextField';

const EmraldLogo = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(2),
  height: '65px',
}));

export default function Header() {
  const { name, desc, updateName, updateDescription } =
    useModelDetailsContext();
  const [open, setOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedDesc, setUpdatedDesc] = useState(desc);

  const handleSave = () => {
    updateName(updatedName);
    updateDescription(updatedDesc);
    setOpen(false);
  };

  return (
    <AppBar
      color="secondary"
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '1px 1px 1px #008080',
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
          flexGrow={1}
        >
          Model Editor
        </Typography>

        <Typography
          variant="h5"
          noWrap
          color="primary"
          fontWeight="bold"
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpen(true)}
        >
          {name ? name : 'Click Here to Name Project'}
        </Typography>
      </Toolbar>

      {/* Dialog for updating name and description */}
      <DialogComponent
        open={open}
        title="Enter new project name and description"
        disabled={updatedName === ''}
        onSave={handleSave}
        onClose={() => setOpen(false)}
      >
        <TextField
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="desc"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={updatedDesc}
          onChange={(e) => setUpdatedDesc(e.target.value)}
        />
      </DialogComponent>
    </AppBar>
  );
}
