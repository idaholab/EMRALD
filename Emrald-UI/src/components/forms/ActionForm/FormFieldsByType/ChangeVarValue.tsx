import { Editor } from '@monaco-editor/react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useActionFormContext } from '../ActionFormContext';
import { useVariableContext } from '../../../../contexts/VariableContext';
import CodeVariables from '../CodeVariables';

const ChangeVarValue = () => {
  const {
    variableName,
    codeVariables,
    scriptCode,
    setVariableName,
    addToUsedVariables,
    setScriptCode,
  } = useActionFormContext();
  const { variableList } = useVariableContext();

  return (
    <>
      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
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
      </FormControl>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flex: 1 }}>
        <Box sx={{ flex: 1, mr: 3, minWidth: '340px' }}>
          <Typography sx={{ mb: 1 }} fontWeight={600}>
            New Value Code (c#)<br></br>Must return same type as the specified
            variable
          </Typography>
          <Editor
            height="300px"
            defaultLanguage="csharp"
            language='csharp'
            value={scriptCode}
            onChange={(value) => setScriptCode(value || '')}
            options={{ 
              minimap: { enabled: false },
              snippetSuggestions: 'inline',
            }}
          />
        </Box>

        <CodeVariables variableList={variableList} codeVariables={codeVariables} addToUsedVariables={addToUsedVariables} />
      </Box>
    </>
  );
};

export default ChangeVarValue;
