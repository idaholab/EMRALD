import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';

const NewDiagramForm = () => {
  const {handleClose} = useWindowContext();
  const {createDiagram} = useDiagramContext();
  const [diagramType, setDiagramType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const handleSave = () => {
    const newDiagram = {
        id: 1111,
        diagramType,
        name,
        desc
      } 
    
    createDiagram(newDiagram);
    handleClose();
  };


  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        Create New Diagram
      </Typography>
      <form>
        <FormControl
          variant="outlined"
          sx={{ minWidth: 120, width: '100%' }}
        >
          <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={diagramType}
            onChange={(event: SelectChangeEvent<string>) => setDiagramType(event.target.value)}
            label="Type"
          >
            <MenuItem value={'dtPlant'}>Plant</MenuItem>
            <MenuItem value={'dtComponent'}>Component</MenuItem>
            <MenuItem value={'dtSystem'}>System</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Name"
          margin="normal"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          variant="outlined"
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

      <Typography variant="h6" mt={5}>
        Drop Components Here
      </Typography>
      <DropTargetComponent />
    </Container>
  );
};

export default NewDiagramForm;
