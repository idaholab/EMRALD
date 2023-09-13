import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { v4 as uuidv4 } from 'uuid';

const LogicTreeForm = () => {
  const {handleClose} = useWindowContext();
  const {createLogicNode} = useLogicNodeContext();
  const [gateType, setGateType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const handleSave = () => {
    const newLogicNode = {
        id: uuidv4(),
        gateType,
        name,
        desc
      } 
    
    createLogicNode(newLogicNode);
    handleClose();
  };


  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        Create New Logic Tree
      </Typography>
      <form>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 120, width: '100%' }}
        >
          <InputLabel id="demo-simple-select-standard-label">Gate Type</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={gateType}
            onChange={(event: SelectChangeEvent<string>) => setGateType(event.target.value)}
            label="Gate Type"
          >
            <MenuItem value={'gtAnd'}>And</MenuItem>
            <MenuItem value={'gtOr'}>Or</MenuItem>
            <MenuItem value={'gtNot'}>Not</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Name"
          margin="normal"
          variant="outlined"
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          variant="outlined"
          size="small"
          fullWidth
          multiline
          margin="normal"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleSave()}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LogicTreeForm;
