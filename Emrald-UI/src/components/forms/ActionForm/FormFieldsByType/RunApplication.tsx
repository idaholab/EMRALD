import { Editor } from '@monaco-editor/react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';
import { useActionFormContext } from '../ActionFormContext';
import { useVariableContext } from '../../../../contexts/VariableContext';

const RunApplication = () => {
  const {
    codeVariables,
    makeInputFileCode,
    exePath,
    processOutputFileCode,
    addToUsedVariables,
    setMakeInputFileCode,
    setExePath,
    setProcessOutputFileCode
  } = useActionFormContext();
  const { variableList } = useVariableContext();

  return (
    <>
      {/* <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Variable</InputLabel>
        <Select
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
          label="Variable"
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {variableList.value.map((variable) => (
            <MenuItem value={variable.name} key={variable.id}>
              <em>{variable.name}</em>
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, mr: 3 }}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{ mb: 1 }} fontWeight={600}>
              Preprocess Code (c#)
            </Typography>
            <Editor
              height="300px"
              defaultLanguage="csharp"
              language='csharp'
              value={makeInputFileCode}
              onChange={(value) => setMakeInputFileCode(value || '')}
              options={{ 
                minimap: { enabled: false },
                snippetSuggestions: 'inline',
              }}
            />

            <TextField
              label="Executable Location"
              margin="normal"
              variant="outlined"
              size="small"
              value={exePath}
              sx={{ my: 3 }}
              onChange={(e) => setExePath(e.target.value)}
              fullWidth
            />

            <Typography sx={{ mb: 1 }} fontWeight={600}>
              Postprocess Code (c#)
            </Typography>
            <Editor
              height="300px"
              defaultLanguage="csharp"
              language='csharp'
              value={processOutputFileCode}
              onChange={(value) => setProcessOutputFileCode(value || '')}
              options={{ 
                minimap: { enabled: false },
                snippetSuggestions: 'inline',
              }}
            />
          </Box>
          
        </Box>

        <Box>
          <b>Variables used in code</b>
          <Box sx={{ height: '530px', overflowY: 'auto', ml: 3 }}>
            <FormGroup>
              {variableList.value.map((variable) => (
                <FormControlLabel
                  key={variable.id}
                  control={
                    <Checkbox
                      sx={{ p: '0 9px' }}
                      checked={codeVariables.includes(variable.name)}
                      onChange={() => addToUsedVariables(variable.name)}
                      name={variable.name}
                    />
                  }
                  label={variable.name}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RunApplication;
