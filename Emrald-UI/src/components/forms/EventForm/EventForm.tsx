import React from 'react';
import { useEffect, useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../../../types/Event';
import { EventType, MainItemTypes } from '../../../types/ItemTypes';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyEvent, useEventContext } from '../../../contexts/EventContext';
import { ComponentLogic, Distribution, ExtSim, FailureRate, StateChange, Timer, VarCondition } from './FormFieldsByType';

interface EventFormProps {
  eventData?: Event;
}

const EventForm: React.FC<EventFormProps> = ({ eventData }) => {
  const { handleClose } = useWindowContext();
  const { updateEvent, createEvent } = useEventContext();
  const event = useSignal<Event>(eventData || emptyEvent);
  const [name, setName] = useState<string>(eventData?.name || '');
  const [desc, setDesc] = useState<string>(eventData?.desc || '');
  const [evType, setEvType] = useState<EventType>(
    eventData?.evType || 'etStateCng',
  );
  const eventTypeOptions = [
    { value: 'etVarCond', label: 'Var Condition' },
    { value: 'etStateCng', label: 'State Change' },
    { value: 'etComponentLogic', label: 'Component Logic' },
    { value: 'etTimer', label: 'Timer' },
    { value: 'etFailRate', label: 'Failure Rate' },
    { value: 'et3dSimEv', label: 'Ext Simulation' },
    { value: 'etDistribution', label: 'Distribution' },
  ];

   // Map event types to their respective sub-components and props
  const eventTypeToComponent: { [key in EventType]: { component: React.FC<any>, props: any } } = {
    'etVarCond': { component: VarCondition, props: {} },
    'etStateCng': { component: StateChange, props: {} },
    'etComponentLogic': { component: ComponentLogic, props: {} },
    'etTimer': { component: Timer, props: {} },
    'etFailRate': { component: FailureRate, props: {} },
    'et3dSimEv': { component: ExtSim, props: {} },
    'etDistribution': { component: Distribution, props: {} },
  };

  const handleSave = () => {
    eventData
      ? updateEvent({
          ...event.value,
          evType,
          name,
          desc,
        })
      : createEvent({
          ...event.value,
          id: uuidv4(),
          evType,
          name,
          desc,
        });
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
          itemType={MainItemTypes.Event}
          type={evType}
          setType={setEvType}
          typeOptions={eventTypeOptions}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />

        {/* Render the appropriate sub-component based on selected event type */}
        {evType && React.createElement(eventTypeToComponent[evType].component, eventTypeToComponent[evType].props)}

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
    </Container>
  );
};

export default EventForm;
