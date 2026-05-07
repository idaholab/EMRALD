import type { Event, EventType, State } from '@/types/EMRALD_Model';
import { Checkbox, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { MainDetailsForm } from '@/components/forms/MainDetailsForm';
import { useEventContext } from '@/contexts/EventContext';
import { useWindowContext } from '@/contexts/WindowContext';
import { appData } from '@/hooks/useAppData';
import { cleanFormItem } from '@/utils/util-functions';
import { useEventFormContext } from './EventFormContext';
import {
  ComponentLogic,
  Distribution,
  ExtSim,
  FailureRate,
  Timer,
  VarCondition,
} from './FormFieldsByType';
import { StateChange } from './FormFieldsByType/StateChange';

/**
 * Props for the event form and it's sub-forms
 */
export interface EventFormProps {
  eventData?: Event;
}

export const EventForm: React.FC<EventFormProps & { state?: State }> = ({
  eventData,
  state,
}) => {
  const {
    event,
    hasError,
    setHasError,
    invalidValues,
    setInvalidValues,
    sync,
    typeProperties,
  } = useEventFormContext();
  const { updateEvent, createEvent } = useEventContext();
  const { handleClose } = useWindowContext();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [originalName, setOriginalName] = useState<string>();
  const [evType, setEvType] = useState<EventType>('etStateCng');
  const [moveFromCurrent, setMoveFromCurrent] = useState<boolean>(false);

  useEffect(() => {
    if (eventData) {
      setName(eventData.name);
      setOriginalName(eventData.name);
      setDesc(eventData.desc);
      setEvType(eventData.evType);
      if (state !== undefined) {
        setMoveFromCurrent(
          state.eventActions[state.events.indexOf(eventData.name)]
            ?.moveFromCurrent ?? false,
        );
      }
    }
  }, []);

  useEffect(() => {
    sync({ name, desc, evType });
  }, [name, desc, evType]);

  const handleNameChange = (newName: string) => {
    const events = appData.value.EventList;
    const trimmedName = newName.trim();
    setHasError(
      events
        .filter(event => event.name !== originalName)
        .some(event => event.name === trimmedName)
        || /[^a-zA-Z0-9-_\s]/.test(trimmedName),
    );
    setName(newName);
  };

  const handleSave = (eventData?: Event, state?: State) => {
    const e: Event = {
      ...cleanFormItem(event, typeProperties),
      objType: 'Event',
      required: false,
      id: eventData?.id ?? uuid(),
      evType,
      name: name.trim(),
      desc,
      mainItem: true,
    };
    console.log(e);
    eventData
      ? updateEvent(e, state, moveFromCurrent)
      : createEvent(e, state, moveFromCurrent);
    handleClose();
  };

  const handleChangeEventType = (value: EventType) => {
    setEvType(value);
    setInvalidValues(prevInvalidValues => {
      const newInvalidValues = new Set(prevInvalidValues);
      newInvalidValues.clear();
      switch (value) {
        case 'etFailRate': {
          newInvalidValues.add('Lambda');

          break;
        }
        case 'etDistribution': {
          newInvalidValues
            .add('Mean')
            .add('Standard Deviation')
            .add('Minimum')
            .add('Maximum');

          break;
        }
        case 'etComponentLogic': {
          newInvalidValues.add('LogicTop');

          break;
        }
      }
      return newInvalidValues;
    });
  };

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {eventData ? `Edit` : `Create`} Event
      </Typography>
      <form>
        <MainDetailsForm
          itemType="Event"
          type={evType}
          setType={setEvType}
          handleTypeChange={handleChangeEventType}
          typeOptions={[
            { value: 'etVarCond', label: 'Var Condition' },
            { value: 'etStateCng', label: 'State Change' },
            { value: 'etComponentLogic', label: 'Component Logic' },
            { value: 'etTimer', label: 'Timer' },
            { value: 'etFailRate', label: 'Failure Rate' },
            { value: 'et3dSimEv', label: 'Ext Simulation' },
            { value: 'etDistribution', label: 'Distribution' },
          ]}
          name={name}
          desc={desc}
          setDesc={setDesc}
          handleSave={() => {
            handleSave(eventData, state);
          }}
          handleNameChange={handleNameChange}
          nameError={hasError}
          error={hasError || invalidValues.size > 0}
          errorMessage="An event with this name already exists, or the name includes an invalid character."
          reqPropsFilled={name ? true : false}
          invalidValues={invalidValues}
        >
          {state && (
            <FormControlLabel
              label="Exit Parent state when event is Triggered"
              value={moveFromCurrent}
              control={
                <Checkbox
                  checked={moveFromCurrent ? true : false}
                  onChange={e => {
                    setMoveFromCurrent(e.target.checked);
                  }}
                />
              }
            />
          )}
          {evType === 'et3dSimEv' ? (
            <ExtSim eventData={eventData} />
          ) : evType === 'etComponentLogic' ? (
            <ComponentLogic eventData={eventData} />
          ) : evType === 'etDistribution' ? (
            <Distribution eventData={eventData} />
          ) : evType === 'etFailRate' ? (
            <FailureRate eventData={eventData} />
          ) : evType === 'etStateCng' ? (
            <StateChange eventData={eventData} />
          ) : evType === 'etTimer' ? (
            <Timer eventData={eventData} />
          ) : (
            <VarCondition eventData={eventData} />
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};
