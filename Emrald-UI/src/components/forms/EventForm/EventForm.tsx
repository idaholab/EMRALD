import type { Event, State } from '../../../types/EMRALD_Model';
import { Checkbox, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { MainDetailsForm } from '@/components/forms/MainDetailsForm';
import { useEventFormContext } from './EventFormContext';

interface EventFormProps {
  eventData?: Event;
  state?: State;
}

export const EventForm: React.FC<EventFormProps> = ({ eventData, state }) => {
  const {
    hasError,
    name,
    desc,
    eventTypeOptions,
    eventTypeToComponent,
    evType,
    moveFromCurrent,
    invalidValues,
    handleSave,
    handleNameChange,
    handleChangeEventType,
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
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {eventData ? `Edit` : `Create`} Event
      </Typography>
      <form>
        <MainDetailsForm
          itemType='Event'
          type={evType}
          setType={setEvType}
          handleTypeChange={handleChangeEventType}
          typeOptions={eventTypeOptions}
          name={name}
          desc={desc}
          setDesc={setDesc}
          handleSave={() => {
            handleSave(eventData, state);
          }}
          reset={reset}
          handleNameChange={handleNameChange}
          nameError={hasError}
          error={hasError || invalidValues.size > 0}
          errorMessage="An event with this name already exists, or the name includes an invalid character."
          reqPropsFilled={name ? true : false}
          invalidValues={invalidValues}
        >
          {state && (
            <FormControlLabel
              label="	Exit Parent state when event is Triggered"
              value={moveFromCurrent}
              control={
                <Checkbox
                  checked={moveFromCurrent ? true : false}
                  onChange={(e) => {
                    setMoveFromCurrent(e.target.checked);
                  }}
                />
              }
            />
          )}

          {/* Render the appropriate sub-component based on selected event type */}
          {React.createElement(
            eventTypeToComponent[evType].component,
            eventTypeToComponent[evType].props,
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};
