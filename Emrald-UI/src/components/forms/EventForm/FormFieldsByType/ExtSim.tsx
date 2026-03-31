import type { EventFormProps } from '../EventForm';
import type { ExtEventMsgType } from '@/types/EMRALD_Model';
import { Box, MenuItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CodeEditorWithVariables, SelectComponent } from '@/components/common';
import { appData } from '@/hooks/useAppData';
import { useEventFormContext } from '../EventFormContext';

export const ExtSim: React.FC<EventFormProps> = ({ eventData }) => {
  const {
    codeVariables,
    scriptCode,
    addToUsedVariables,
    setCodeVariables,
    setScriptCode,
    setTypeProperties,
    sync,
  } = useEventFormContext();

  const [extEventType, setExtEventType] = useState<ExtEventMsgType>();
  const [variable, setVariable] = useState<string>();

  useEffect(() => {
    setScriptCode(eventData?.code);
    setCodeVariables(eventData?.varNames);
    setExtEventType(eventData?.extEventType);
    setVariable(eventData?.variable);
    setTypeProperties(['code', 'varNames', 'extEventType', 'variable']);
  }, []);

  useEffect(() => {
    sync({ code: scriptCode, varNames: codeVariables, extEventType, variable });
  }, [scriptCode, codeVariables, extEventType, variable]);

  useEffect(() => {
    if (extEventType !== 'etCompEv') {
      setVariable(undefined);
      setScriptCode(undefined);
      setCodeVariables(undefined);
    }
  }, [extEventType]);

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <SelectComponent
          value={extEventType ?? undefined}
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
            <Typography>
              Trigger event when the external simulation has ended.
            </Typography>
          )}
          {extEventType === 'etStatus' && (
            <Typography>
              Triggered if received a ping event from eternal simulation.
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        {extEventType === 'etCompEv' && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SelectComponent
                value={variable ?? ''}
                setValue={setVariable}
                label="External Sim Variable"
                fullWidth
              >
                {appData.value.VariableList.filter(
                  variable => variable.varScope === 'gt3DSim',
                ).map((variable, idx) => (
                  <MenuItem key={idx} value={variable.name}>
                    {variable.name}
                  </MenuItem>
                ))}
              </SelectComponent>
            </Box>
            <CodeEditorWithVariables
              scriptCode={scriptCode ?? ''}
              setScriptCode={setScriptCode}
              variableList={appData.value.VariableList}
              codeVariables={codeVariables ?? []}
              addToUsedVariables={addToUsedVariables}
              heading={
                <span>Evaluate Code (c#) - Must return a boolean value!</span>
              }
            />
          </>
        )}
      </Box>
    </div>
  );
};
