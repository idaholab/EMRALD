import type { ModelValidationResult } from '../../../utils/Upgrades/upgrade';
import { Alert, Table } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import Logo from '../../../assets/EMRALD-logo.png';
import { useModelDetailsContext } from '../../../contexts/ModelDetailsContext';
import { appData, updateAppData } from '../../../hooks/useAppData';
import { DialogComponent } from '../../common/DialogComponent/DialogComponent';
import { MenuButton } from './MenuButton';
import { downloadOptions, projectOptions } from './menuOptions';
import { SearchField } from './SearchBar/SearchField';

const url = window.location.href;
let emraldDocsUrl = 'https://emrald-docs.inl.gov/'; // Default URL

const urlEnvMappings = {
  dev: 'https://emrald-docs.dev.inl.gov/',
  acc: 'https://emrald-docs.acc.inl.gov/',
  scan: 'https://emrald-docs.scan.inl.gov/',
};

// Loop through the mappings and set the URL if a match is found
for (const key in urlEnvMappings) {
  if (url.includes(key)) {
    emraldDocsUrl = urlEnvMappings[key as keyof typeof urlEnvMappings];
  }
}

const EmraldLogo = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(2),
  height: '65px',
}));

export const Header: React.FC = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const { name, desc, fileName, version, setVersion, setName, setDesc }
    = useModelDetailsContext();
  const [projectDialog, setProjectDialog] = useState(false);
  const [nameRequiredMsg, setNameRequiredMsg] = useState(false);
  const [updatedName, setUpdatedName] = useState<string>();
  const [updatedDesc, setUpdatedDesc] = useState<string>();
  const [updatedVersion, setUpdatedVersion] = useState<string>();
  const [versionDialog, setVersionDialog] = useState(false);
  const [changeDesc, setChangeDesc] = useState<string>();
  const [modelErrorDialog, setModelErrorDialog] = useState(false);
  const [modelErrorMessage, setModelErrorMessage] = useState('');
  const [saveValidationDialog, setSaveValidationDialog] = useState(false);
  const [saveValidationResult, setSaveValidationResult] = useState<
    ModelValidationResult | undefined
  >();
  const saveValidationResolver = useRef<
    ((shouldSave: boolean) => void) | undefined
  >(undefined);

  useEffect(() => {
    setUpdatedName(name);
    setUpdatedDesc(desc);
    setUpdatedVersion(String(version));
  }, [name, desc, version]);

  const handleSave = () => {
    setName(updatedName);
    setDesc(updatedDesc);
    setVersion(Number(updatedVersion));
    updateAppData({
      ...appData.value,
      name: updatedName,
      desc: updatedDesc,
      version: Number(updatedVersion),
    });
    setProjectDialog(false);
  };

  const handleClose = () => {
    setProjectDialog(false);
    setUpdatedName(undefined);
    setUpdatedDesc(undefined);
  };

  const handleChange = (value: string) => {
    if (value === '' || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
      setUpdatedVersion(value);
    }
  };

  const confirmInvalidModelSave = (validationResult: ModelValidationResult) =>
    new Promise<boolean>(resolve => {
      saveValidationResolver.current = resolve;
      setSaveValidationResult(validationResult);
      setSaveValidationDialog(true);
    });

  const closeSaveValidationDialog = (shouldSave: boolean) => {
    saveValidationResolver.current?.(shouldSave);
    saveValidationResolver.current = undefined;
    setSaveValidationDialog(false);
    setSaveValidationResult(undefined);
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
        <EmraldLogo
          src={Logo}
          alt="Logo"
          sx={{ height: isMediumScreen ? '45px' : '65px' }}
        />
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
          <MenuButton
            id={1}
            title="Project"
            options={projectOptions}
            openVersionDialog={() => {
              setVersionDialog(true);
            }}
            openNameDialog={() => {
              setVersionDialog(true);
              setNameRequiredMsg(true);
            }}
            handleModelError={message => {
              setModelErrorDialog(true);
              setModelErrorMessage(message);
            }}
            confirmInvalidModelSave={confirmInvalidModelSave}
          />
          <MenuButton id={2} title="Download" options={downloadOptions} />
          <MenuButton
            id={3}
            title="Help"
            handleClick={() => window.open(emraldDocsUrl)}
          />
          <MenuButton
            id={4}
            title="About"
            handleClick={() => window.open('https://inl.gov/emrald/')}
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
            sx={{
              cursor: 'pointer',
              fontSize: isMediumScreen ? '1em' : '1.2em',
            }}
            onClick={() => {
              setProjectDialog(true);
            }}
          >
            {name === undefined || name.length === 0
              ? 'Click Here to Name Project'
              : name}
            &nbsp;
            {version && version > 1 ? `v${version.toString()}` : ''}
          </Typography>
          <Typography sx={{ fontSize: isMediumScreen ? '0.625em' : '0.75em' }}>
            {fileName ?? ''}
          </Typography>
        </Box>
      </Toolbar>

      {/* Dialog for project updating name and description */}
      <DialogComponent
        open={projectDialog}
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
          onChange={e => {
            setUpdatedName(e.target.value);
            if (nameRequiredMsg && e.target.value.length > 0) {
              setNameRequiredMsg(false);
            }
          }}
          error={nameRequiredMsg}
          helperText={
            nameRequiredMsg ? 'A project name is required' : undefined
          }
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
          onChange={e => {
            setUpdatedDesc(e.target.value);
          }}
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
          onChange={e => {
            handleChange(e.target.value);
          }}
          error={!version}
          helperText={version === undefined ? 'must have a version number' : ''}
        />
        Version History
        <Table>
          <thead>
            <tr>
              <th>Version</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            {/* This somehow tries to render before the model is upgraded, causing versionHistory to not exist */}
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {appData.value.versionHistory?.map(h => (
              <tr style={{ textAlign: 'center' }}>
                <td>{h.version}</td>
                <td>{h.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DialogComponent>

      {/* Dialog for model version history & required project name */}
      <DialogComponent
        open={versionDialog}
        title={nameRequiredMsg ? 'Enter Project Name' : 'Update Model Version'}
        onClose={() => {
          setVersionDialog(false);
        }}
        onSubmit={() => {
          const newVersion = Number(updatedVersion);
          const versionHistory = appData.value.versionHistory;
          const existing = versionHistory.findIndex(
            v => v.version === newVersion,
          );
          if (existing === -1) {
            versionHistory.push({
              description: changeDesc,
              version: newVersion,
            });
          } else if (versionHistory[existing]) {
            // Update the existing entry if the version number was not increased
            versionHistory[existing].description = changeDesc;
          }
          updateAppData({
            ...appData.value,
            version: newVersion,
            versionHistory,
          });
          setVersionDialog(false);
          void projectOptions.Save(confirmInvalidModelSave);
        }}
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
          onChange={e => {
            setUpdatedName(e.target.value);
            if (nameRequiredMsg && e.target.value.length > 0) {
              setNameRequiredMsg(false);
            }
          }}
          error={nameRequiredMsg}
          helperText={
            nameRequiredMsg ? 'A project name is required' : undefined
          }
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
          onChange={e => {
            handleChange(e.target.value);
          }}
          error={!version}
          helperText={version === undefined ? 'must have a version number' : ''}
        />
        <TextField
          multiline
          margin="dense"
          id="changes"
          label="Change Description"
          type="text"
          fullWidth
          variant="outlined"
          value={changeDesc}
          onChange={e => {
            setChangeDesc(e.target.value);
          }}
        />
      </DialogComponent>

      <DialogComponent
        open={modelErrorDialog}
        title="Error Opening File"
        onClose={() => {
          setModelErrorDialog(false);
        }}
      >
        An error occurred opening the selected file. Please check the error
        message below.
        <Alert severity="error">{modelErrorMessage}</Alert>
      </DialogComponent>

      <DialogComponent
        open={saveValidationDialog}
        title="Model Schema Warning"
        submitText="Save Anyway"
        cancelText="Cancel"
        onSubmit={() => {
          closeSaveValidationDialog(true);
        }}
        onClose={() => {
          closeSaveValidationDialog(false);
        }}
      >
        <Typography sx={{ mb: 2 }}>
          This model does not match EMRALD schema{' '}
          {saveValidationResult?.schemaVersion.toString()}. The file can still
          be saved, but it may not load or run correctly until the issues below
          are fixed.
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Review the validation errors before choosing whether to save anyway.
        </Alert>
        <Box
          component="ul"
          sx={{
            m: 0,
            maxHeight: 240,
            overflow: 'auto',
            pl: 3,
          }}
        >
          {(saveValidationResult?.errors ?? []).map((error, index) => (
            <li key={index}>
              <Typography variant="body2">{error}</Typography>
            </li>
          ))}
        </Box>
      </DialogComponent>
    </AppBar>
  );
};
