import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { Event } from '../../../types/Event';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { useEventContext } from '../../../contexts/EventContext';

interface EventFormProps {
  eventData?: Event;
}

const EventForm: React.FC<EventFormProps> = ({ eventData }) => {
  const { handleClose } = useWindowContext();
  const { updateEvent, createEvent } = useEventContext();
  const [evType, setEvType] = useState<string>(
    eventData?.evType || '',
  );
  const [name, setName] = useState<string>(eventData?.name || '');
  const [desc, setDesc] = useState<string>(eventData?.desc || '');

  const handleSave = () => {
    const newEvent = {
      id: uuidv4(),
      evType,
      name,
      desc,
    };

    eventData
      ? updateEvent({
          id: eventData.id,
          evType,
          name,
          desc,
        })
      : createEvent(newEvent);
    handleClose();
  };

  useEffect(() => {
    if (eventData) {
      setEvType(eventData.evType || '');
      setName(eventData.name || '');
      setDesc(eventData.desc || '');
    }
  }, [eventData]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {eventData ? `Edit` : `Create`} Event
      </Typography>
      <form>
        <MainDetailsForm 
          type={evType}
          setType={setEvType}
          typeOptions={[
            {value: 'etVarCond', label: 'Var Condition'},
            {value: 'etStateCng', label: 'State Change'},
            {value: 'etComponentLogic', label: 'Component Logic'},
            {value: 'etTimer', label: 'Timer'},
            {value: 'etFailRate', label: 'Failure Rate'},
            {value: 'et3dSimEv', label: 'Ext Simulation'},
            {value: 'etDistribution', label: 'Distribution'},
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

export default EventForm;
