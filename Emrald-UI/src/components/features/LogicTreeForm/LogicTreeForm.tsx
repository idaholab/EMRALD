import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../MainDetailsForm';

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
      <MainDetailsForm 
          typeLabel='Gate Type'
          type={gateType}
          setType={setGateType}
          typeOptions={[
            {value: 'gtAnd', label: 'And'},
            {value: 'gtOr', label: 'Or'},
            {value: 'gtNot', label: 'Not'},
          ]}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
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
