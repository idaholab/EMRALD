import React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';

import { Event } from '../../../types/Event';
import { MainItemTypes } from '../../../types/ItemTypes';

import { useEventFormContext } from './EventFormContext';
import { Alert, Checkbox, FormControlLabel } from '@mui/material';
import { State } from '../../../types/State';

interface EventFormProps {
  eventData?: Event;
  state?: State;
}

const EventForm: React.FC<EventFormProps> = ({ eventData, state }) => {
  const {
    hasError,
    name,
    desc,
    eventTypeOptions,
    eventTypeToComponent,
    evType,
    moveFromCurrent,
    handleSave,
    handleNameChange,
    InitializeForm,
    reset,
    setDesc,
    setEvType,
    setMoveFromCurrent,
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
          desc={desc}
          setDesc={setDesc}
          handleSave={() => handleSave(eventData)}
          reset={reset}
          handleNameChange={handleNameChange}
          error={hasError}
          errorMessage="An event with this name already exists."
          reqPropsFilled={name && evType ? true : false}
        >
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
        </MainDetailsForm>
      </form>
    </Box>
  );
};

export default EventForm;
