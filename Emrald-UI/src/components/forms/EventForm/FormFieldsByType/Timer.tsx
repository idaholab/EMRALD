import type { EventFormProps } from '../EventForm';
import type { TimeVariableUnit, VarChangeOptions } from '@/types/EMRALD_Model';
import { Box, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DurationComponent, SelectComponent } from '@/components/common';
import { appData } from '@/hooks/useAppData';
import { convertToISOString } from '@/utils/util-functions';
import { useEventFormContext } from '../EventFormContext';
import { VariableChangesPiece } from './VariableChangesPiece';

export const Timer: React.FC<EventFormProps> = ({ eventData }) => {
  const { setTypeProperties, sync } = useEventFormContext();

  const [fromSimStart, setFromSimStart] = useState<boolean>();
  const [time, setTime] = useState<string>();
  const [timerMilliseconds, setTimerMilliseconds] = useState(0);
  const [timeVariableUnit, setTimeVariableUnit] = useState<TimeVariableUnit>();
  const [useVariable, setUseVariable] = useState<boolean>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions>();
  const [persistent, setPersistent] = useState<boolean | undefined>();

  useEffect(() => {
    setFromSimStart(eventData?.fromSimStart);
    setTimeVariableUnit(eventData?.timeVariableUnit);
    if (eventData?.time !== undefined) {
      setTime(eventData.time);
      setTimerMilliseconds(moment.duration(eventData.time).asMilliseconds());
    }
    setUseVariable(eventData?.useVariable);
    setPersistent(eventData?.persistent);
    setTypeProperties([
      'fromSimStart',
      'time',
      'timeVariableUnit',
      'useVariable',
      'onVarChange',
      'persistent',
    ]);
  }, []);

  useEffect(() => {
    sync({
      fromSimStart,
      time,
      timeVariableUnit,
      useVariable,
      onVarChange,
      persistent,
    });
  }, [
    fromSimStart,
    time,
    timeVariableUnit,
    useVariable,
    onVarChange,
    persistent,
  ]);

  const handleSetUseVariable = (checked: boolean) => {
    setTime('');
    setUseVariable(checked);
  };

  const handleTimerDurationChange = (value: number) => {
    setTimerMilliseconds(value);
    setTime(convertToISOString(value));
  };

  return (
    <div>
      <FormControlLabel
        label="Persistent - Keeps initial time between state movement and only re-samples after it occurs."
        control={
          <Checkbox
            checked={persistent}
            value={persistent}
            onChange={e => {
              setPersistent(e.target.checked);
            }}
          />
        }
      />
      {useVariable ? (
        <>
          <SelectComponent
            value={
              appData.value.VariableList.filter(
                item => item.type !== 'bool',
              ).some(variable => variable.name === time)
                ? time
                : ''
            }
            setValue={setTime}
            label="Time Span"
            sx={{ mr: 2 }}
          >
            {appData.value.VariableList.filter(
              item => item.type !== 'bool',
            ).map((variable, index) => (
              <MenuItem key={index} value={variable.name}>
                {variable.name}
              </MenuItem>
            ))}
          </SelectComponent>
          <SelectComponent
            value={timeVariableUnit ?? ''}
            setValue={setTimeVariableUnit}
            label="Time Variable Unit"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="trSeconds">Second</MenuItem>
            <MenuItem value="trMinutes">Minute</MenuItem>
            <MenuItem value="trHours">Hour</MenuItem>
            <MenuItem value="trDays">Day</MenuItem>
            <MenuItem value="trYears">Year</MenuItem>
          </SelectComponent>
        </>
      ) : (
        <DurationComponent
          milliseconds={timerMilliseconds}
          handleDurationChange={handleTimerDurationChange}
        />
      )}
      <Box>
        <FormControlLabel
          label="Use Variable?"
          value={useVariable}
          control={
            <Checkbox
              checked={useVariable ? true : false}
              onChange={e => {
                handleSetUseVariable(e.target.checked);
              }}
            />
          }
        />
      </Box>
      {useVariable && (
        <VariableChangesPiece
          onVarChange={onVarChange}
          setOnVarChange={setOnVarChange}
        />
      )}
      <FormControlLabel
        label="From Sim Start"
        value={fromSimStart}
        control={
          <Checkbox
            checked={fromSimStart ? true : false}
            onChange={e => {
              setFromSimStart(e.target.checked);
            }}
          />
        }
      />
    </div>
  );
};
