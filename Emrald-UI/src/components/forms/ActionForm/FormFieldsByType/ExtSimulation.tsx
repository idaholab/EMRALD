import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { sim3DMessageType, useActionFormContext } from '../ActionFormContext';
import DurationControl from 'react-duration-control';
import 'react-duration-control/dist/react-duration-control.css';
import { useExtSimContext } from '../../../../contexts/ExtSimContext';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useVariableContext } from '../../../../contexts/VariableContext';
import DurationComponent from '../../../common/DurationComponent';
import { SelectComponent } from '../../../common';

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
  const extSimVariables = variableList.value.filter(
    (variable) => variable.varScope === 'gt3DSim',
  );
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
  }, [simEndTime]);

  const handleDurationChange = (value: number) => {
    setMilliseconds(value);
    setSimEndTime(dayjs.duration(value).toISOString());
  };

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <SelectComponent
        value={sim3DMessage}
        label="Sim Action"
        setValue={setSim3DMessage}
      >
        {simTypeOptions.map((item, index) => (
          <MenuItem value={item.value} key={index}>
            <em>{item.label}</em>
          </MenuItem>
        ))}
      </SelectComponent>
      <SelectComponent value={extSim} label="External Sim" setValue={setExtSim}>
        {extSimList.value.map((item) => (
          <MenuItem value={item.name} key={item.id}>
            <em>{item.name}</em>
          </MenuItem>
        ))}
      </SelectComponent>

      {sim3DMessage === 'atOpenSim' ? (
        <Box mt={2} display={'flex'} flexDirection={'column'}>
          <DurationComponent
            milliseconds={milliseconds}
            handleDurationChange={handleDurationChange}
          />
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

          <SelectComponent
            value={sim3DModelRef}
            label="Model Reference (Optional)"
            setValue={setSim3DModelRef}
          >
            {extSimVariables.map((item, index) => (
              <MenuItem value={item.name} key={index}>
                <em>{item.name}</em>
              </MenuItem>
            ))}
          </SelectComponent>

          <SelectComponent
            value={sim3DConfigData}
            label="Config Data (Optional)"
            setValue={setSim3DConfigData}
          >
            {extSimVariables.map((item, index) => (
              <MenuItem value={item.name} key={index}>
                <em>{item.name}</em>
              </MenuItem>
            ))}
          </SelectComponent>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ExtSimulation;
