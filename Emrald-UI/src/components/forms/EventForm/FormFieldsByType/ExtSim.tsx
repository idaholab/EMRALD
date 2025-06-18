import { Box, MenuItem, Typography } from '@mui/material';
import { useEventFormContext } from '../EventFormContext';
import { CodeEditorWithVariables, SelectComponent } from '../../../common';
import { appData } from '../../../../hooks/useAppData';
import { useEffect } from 'react';

const ExtSim = () => {
  const {
    codeVariables,
    extEventType,
    scriptCode,
    variable,
    addToUsedVariables,
    setCodeVariables,
    setExtEventType,
    setScriptCode,
    setVariable,
  } = useEventFormContext();

  useEffect(() => {
    if (extEventType !== 'etCompEv') {
      setVariable(undefined);
      setScriptCode(undefined);
      setCodeVariables(undefined);
    }
  }, [extEventType]);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <SelectComponent
          value={extEventType ? extEventType : undefined}
          setValue={setExtEventType}
          label="External Event Type"
          fullWidth
        >
          <MenuItem value="etCompEv">Variable Change</MenuItem>
          <MenuItem value="etEndSim">Simulation End</MenuItem>
          <MenuItem value="etStatus">Ping</MenuItem>
        </SelectComponent>
        <Box sx={{ ml: 3, mt: 2 }}>
          {extEventType === 'etEndSim' && (
            <Typography>Trigger event when the external simulation has ended.</Typography>
          )}
          {extEventType === 'etStatus' && (
            <Typography>Triggered if received a ping event from eternal simulation.</Typography>
          )}
        </Box>
      </Box>
      <Box>
        {extEventType === 'etCompEv' && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SelectComponent
                value={variable ? variable : ''}
                setValue={setVariable}
                label="External Sim Variable"
                fullWidth
              >
                {appData.value.VariableList.filter(
                  (variable) => variable.varScope === 'gt3DSim',
                ).map((variable, idx) => (
                  <MenuItem key={idx} value={variable.name}>
                    {variable.name}
                  </MenuItem>
                ))}
              </SelectComponent>
            </Box>
            <CodeEditorWithVariables
              scriptCode={scriptCode ? scriptCode : ''}
              setScriptCode={setScriptCode}
              variableList={appData.value.VariableList}
              codeVariables={codeVariables || []}
              addToUsedVariables={addToUsedVariables}
              heading={<span>Evaluate Code (c#) - Must return a boolean value!</span>}
            />
          </>
        )}
      </Box>
    </div>
  );
};

export default ExtSim;
