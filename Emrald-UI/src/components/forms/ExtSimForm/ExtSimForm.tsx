import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { v4 as uuidv4 } from 'uuid';
import { useSignal } from '@preact/signals-react';
import type { ExtSim } from '../../../types/EMRALD_Model';
import { emptyExtSim, useExtSimContext } from '../../../contexts/ExtSimContext';
import TextField from '@mui/material/TextField';

interface ExtSimFormProps {
  ExtSimData?: ExtSim;
}

const ExtSimForm: React.FC<ExtSimFormProps> = ({ ExtSimData }) => {
  const { handleClose } = useWindowContext();
  const { updateExtSim, createExtSim } = useExtSimContext();
  const ExtSim = useSignal<ExtSim>(ExtSimData ?? emptyExtSim);
  const [name, setName] = useState<string>(ExtSimData?.name ?? '');
  const [originalName] = useState<string | undefined>(ExtSimData?.name);
  const [resourceName, setResourceName] = useState<string>(ExtSimData?.resourceName ?? '');
  const [hasError, setHasError] = useState<boolean>(false);
  const { extSimList } = useExtSimContext();

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    const nameExists = extSimList.value
      .filter((extSim) => extSim.name !== originalName)
      .some((extSim) => extSim.name === trimmedName);
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const handleSave = () => {
    ExtSimData
      ? updateExtSim({
          ...ExtSim.value,
          name: name.trim(),
          resourceName,
        })
      : createExtSim({
          ...ExtSim.value,
          id: uuidv4(),
          name: name.trim(),
          resourceName,
        });
    handleClose();
  };

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {ExtSimData ? `Edit` : `Create`} ExtSim
      </Typography>
      <form>
        <TextField
          label="Name"
          margin="normal"
          variant="outlined"
          size="small"
          slotProps={{ htmlInput: { maxLength: 20 } }}
          value={name}
          onChange={(e) => {
            handleNameChange(e.target.value);
          }}
          fullWidth
          error={hasError}
          helperText={hasError ? 'Name already exists or contains an invalid character' : ''}
        />
        <TextField
          label="Application Name"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          margin="normal"
          value={resourceName}
          onChange={(e) => {
            setResourceName(e.target.value);
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ExtSimForm;
