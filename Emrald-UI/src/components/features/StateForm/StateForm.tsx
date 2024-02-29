import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { State } from '../../../types/State';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../MainDetailsForm';
import { useStateContext } from '../../../contexts/StateContext';

interface StateFormProps {
  stateData?: State;
}

const StateForm: React.FC<StateFormProps> = ({ stateData }) => {
  const { handleClose } = useWindowContext();
  const { updateState, createState } = useStateContext();
  const [stateType, setStateType] = useState<string>(
    stateData?.stateType || '',
  );
  const [name, setName] = useState<string>(stateData?.name || '');
  const [desc, setDesc] = useState<string>(stateData?.desc || '');

  const handleSave = () => {
    const newState = {
      id: uuidv4(),
      stateType,
      name,
      desc,
    };

    stateData
      ? updateState({
          id: stateData.id,
          stateType,
          name,
          desc,
        })
      : createState(newState);
    handleClose();
  };

  useEffect(() => {
    if (stateData) {
      setStateType(stateData.stateType || '');
      setName(stateData.name || '');
      setDesc(stateData.desc || '');
    }
  }, [stateData]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {stateData ? `Edit` : `Create`} State
      </Typography>
      <form>
        <MainDetailsForm 
          type={stateType}
          setType={setStateType}
          typeOptions={[
            {value: 'stStart', label: 'Start'},
            {value: 'stStandard', label: 'Standard'},
            {value: 'stKeyState', label: 'Key State'},
            {value: 'stTerminal', label: 'Terminal'},
          ]}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => handleSave()}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Typography variant="h6" mt={5}>
        Drop Components Here
      </Typography>
    </Container>
  );
};

export default StateForm;
