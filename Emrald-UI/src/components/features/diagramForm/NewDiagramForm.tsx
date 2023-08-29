import react from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';

const NewDiagramForm = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={5}>
        New Diagram
      </Typography>
      <form>
        <TextField label="Name" variant="standard" fullWidth margin="normal" />
        <TextField
          label="Description"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Ok
          </Button>
          <Button variant="contained" color="secondary">
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
