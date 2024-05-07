import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { sim3DMessageType, useActionFormContext } from '../ActionFormContext';
import DurationControl from 'react-duration-control';
import 'react-duration-control/dist/react-duration-control.css';
import { useExtSimContext } from '../../../../contexts/ExtSimContext';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useVariableContext } from '../../../../contexts/VariableContext';

dayjs.extend(duration);

const ExtSimulation: React.FC = () => {
  const { 
    sim3DMessage,
    extSim,
    openSimVarParams,
    sim3DModelRef,
    sim3DConfigData,
    simEndTime, 
    setSim3DMessage,
    setExtSim,
    setOpenSimVarParams,
    setSim3DModelRef,
    setSim3DConfigData,
    setSimEndTime,
  } = useActionFormContext();
  const { extSimList } = useExtSimContext();
  const { variableList } = useVariableContext();
  const extSimVariables = variableList.value.filter((variable) => variable.varScope === 'gt3DSim');
  const simEndTimeDuration = dayjs.duration(simEndTime);
  const [milliseconds, setMilliseconds] = useState(0);
  const simTypeOptions = [
    { value: 'atCompModify', label: 'Comp Modify' },
    { value: 'atOpenSim', label: 'Open Sim' },
    { value: 'atCancelSim', label: 'Cancel Sim' },
    { value: 'atPing', label: 'Ping' },
  ];

  useEffect(() => {
    const simEndTimeDuration = dayjs.duration(simEndTime);
    setMilliseconds(simEndTimeDuration.$ms);
  }, [simEndTime])

  const handleDurationChange = (value: number) => {
    setMilliseconds(value);
    setSimEndTime(dayjs.duration(value).toISOString());
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Sim Action</InputLabel>
        <Select
          value={sim3DMessage}
          onChange={(e) => setSim3DMessage(e.target.value as sim3DMessageType)}
          label="Sim Action"
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {simTypeOptions.map((item, index) => (
            <MenuItem value={item.value} key={index}>
              <em>{item.label}</em>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">External Sim</InputLabel>
        <Select
          value={extSim}
          onChange={(e) => setExtSim(e.target.value)}
          label="External Sim"
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {extSimList.value.map((item) => (
            <MenuItem value={item.name} key={item.id}>
              <em>{item.name}</em>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {sim3DMessage === 'atOpenSim' ? (
        <Box mt={2} display={'flex'} flexDirection={'column'}>
          <Box>
            <DurationControl
              className="custom-duration-control"
              label="Duration"
              pattern={
                'Days {dddd} Hours {hh} Minutes {mm} Seconds {ss}'
              }
              value={milliseconds}
              onChange={handleDurationChange}
              hideSpinner
            />
          </Box>
          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                sx={{ p: '0 9px' }}
                checked={openSimVarParams}
                onChange={(e) => setOpenSimVarParams(e.target.checked)}
              />
            }
            label="Use variable for items below"
          />

          <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Model Reference (Optional)</InputLabel>
            <Select
              value={sim3DModelRef}
              onChange={(e) => setSim3DModelRef(e.target.value)}
              label="Model Reference (Optional)"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {extSimVariables.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Config Data (Optional)</InputLabel>
            <Select
              value={sim3DConfigData}
              onChange={(e) => setSim3DConfigData(e.target.value)}
              label="Config Data (Optional)"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {extSimVariables.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ExtSimulation;
