import { useEffect } from 'react';
import { DurationComponent, SelectComponent } from '../../../common';
import { useEventFormContext } from '../EventFormContext';
import { Box, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { appData } from '../../../../hooks/useAppData';
import VariableChangesPiece from './VariableChangesPiece';

const Timer = () => {
  const {
    fromSimStart,
    timerMilliseconds,
    time,
    timeVariableUnit,
    useVariable,
    handleTimerDurationChange,
    setFromSimStart,
    setTimerMilliseconds,
    setTime,
    setTimeVariableUnit,
    setUseVariable,
    persistent,
    setPersistent,
  } = useEventFormContext();

  const handleSetUseVariable = (checked: boolean) => {
    setTime('');
    setUseVariable(checked);
  };

  useEffect(() => {
    if (!time) setTimerMilliseconds(0); // if time is a variable string, milliseconds will not be able to be converted to number
  }, [useVariable]);

  return (
    <div>
      <FormControlLabel
        label="Persistent - Keeps initial time between state movement and only re-samples after it occurs."
        control={
          <Checkbox
            checked={persistent}
            value={persistent}
            onChange={(e) => setPersistent(e.target.checked)}
          ></Checkbox>
        }
      ></FormControlLabel>
      {useVariable ? (
        <>
          <SelectComponent
            value={
              appData.value.VariableList.filter((item) => item.type !== 'bool').some(
                (variable) => variable.name === time,
              )
                ? time
                : ''
            }
            setValue={setTime}
            label="Time Span"
            sx={{ mr: 2}}
          >
            {appData.value.VariableList.filter((item) => item.type !== 'bool').map(
              (variable, index) => (
                <MenuItem key={index} value={variable.name}>
                  {variable.name}
                </MenuItem>
              ),
            )}
          </SelectComponent>
          <SelectComponent
            value={timeVariableUnit || ''}
            setValue={setTimeVariableUnit}
            label="Time Variable Unit"
            sx={{ minWidth: 200}}
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
          milliseconds={timerMilliseconds || 0}
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
              onChange={(e) => handleSetUseVariable(e.target.checked)}
            />
          }
        />
      </Box>
      {useVariable && <VariableChangesPiece />}
      <FormControlLabel
        label="From Sim Start"
        value={fromSimStart}
        control={
          <Checkbox
            checked={fromSimStart ? true : false}
            onChange={(e) => setFromSimStart(e.target.checked)}
          />
        }
      />
    </div>
  );
};

export default Timer;
