import { Editor } from '@monaco-editor/react';
import {
  Box,
  Typography,
  FormControlLabel,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useActionFormContext } from '../../ActionFormContext';
import { useVariableContext } from '../../../../../contexts/VariableContext';
import CodeVariables from '../../CodeVariables';
import { useEffect, useState } from 'react';

const RunApplication = () => {
  const [applicationType, setApplicationType] = useState('code');
  const {
    codeVariables,
    makeInputFileCode,
    exePath,
    processOutputFileCode,
    addToUsedVariables,
    setMakeInputFileCode,
    setExePath,
    setProcessOutputFileCode,
  } = useActionFormContext();
  const { variableList } = useVariableContext();

  const [customFormType, setCustomFormType] = useState('');
  const [options, setOptions] = useState<string[]>([]);


  useEffect(() => {
    console.log(window)
  }, []);

  return (
    <>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={applicationType}
          onChange={(e) => setApplicationType(e.target.value)}
          row
        >
          <FormControlLabel value="code" control={<Radio />} label="Use Code" />
          <FormControlLabel
            value="custom"
            control={<Radio />}
            label="Use Custom Application"
          />
        </RadioGroup>
      </FormControl>
      {applicationType === 'code' ? (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, mr: 3, minWidth: '340px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ mb: 1 }} fontWeight={600}>
                Preprocess Code (c#)
              </Typography>
              <Editor
                height="300px"
                defaultLanguage="csharp"
                language="csharp"
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
                language="csharp"
                value={processOutputFileCode}
                onChange={(value) => setProcessOutputFileCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  snippetSuggestions: 'inline',
                }}
              />
            </Box>
          </Box>

          <CodeVariables
            variableList={variableList}
            codeVariables={codeVariables}
            addToUsedVariables={addToUsedVariables}
          />
        </Box>
      ) : (
        <Box>
          <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">
              Custom Application Type
            </InputLabel>
            <Select
              value={customFormType}
              onChange={(e) => setCustomFormType(e.target.value)}
              label="Custom Application Type"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {options.map((option) => (
                <MenuItem value={option} key={option}>
                  <em>{option}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          

        </Box>
      )}
    </>
  );
};

export default RunApplication;
