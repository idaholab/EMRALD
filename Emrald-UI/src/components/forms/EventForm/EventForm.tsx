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
import { useEventFormContext } from './EventFormContext';
import { Checkbox, FormControlLabel } from '@mui/material';
import { State } from '../../../types/State';

interface EventFormProps {
  eventData?: Event;
  state?: State;
}

const EventForm: React.FC<EventFormProps> = ({ eventData, state }) => {
  const {
    name,
    desc,
    eventTypeOptions,
    eventTypeToComponent,
    evType,
    moveFromCurrent,
    handleClose,
    handleSave,
    InitializeForm,
    setDesc,
    setEvType,
    setMoveFromCurrent,
    setName,
  } = useEventFormContext();
  useEffect(() => {
    InitializeForm(eventData, state);
  }, []);

  return (
    <Box mx={3}>
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

        {state && (
          <FormControlLabel
            label="	Exit Parent state when event is Triggered"
            value={moveFromCurrent}
            control={
              <Checkbox
                checked={moveFromCurrent ? true : false}
                onChange={(e) => setMoveFromCurrent(e.target.checked)}
              />
            }
          />
        )}

        {/* Render the appropriate sub-component based on selected event type */}
        {evType &&
          React.createElement(
            eventTypeToComponent[evType].component,
            eventTypeToComponent[evType].props,
          )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => handleSave(eventData, state)}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EventForm;
