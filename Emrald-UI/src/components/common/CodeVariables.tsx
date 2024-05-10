import { Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React from 'react'
import { Variable } from '../../types/Variable';

interface CodeVariablesProps {
  variableList: Variable[];
  codeVariables: string[];
  addToUsedVariables: (variableName: string) => void
  height?: string;
}
const CodeVariables: React.FC<CodeVariablesProps> = ({ variableList, codeVariables, addToUsedVariables, height  }) => {
  return (
    <Box>
    <b>Variables used in code</b>
    <Box sx={{ height: height ? height : '340px', overflowY: 'auto', ml: 3 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox sx={{ p: '0 9px' }} checked={true} disabled />
          }
          label={'CurTime'}
        />
        <FormControlLabel
          control={
            <Checkbox sx={{ p: '0 9px' }} checked={true} disabled />
          }
          label={'RunIdx'}
        />
        {variableList.map((variable) => (
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
  )
}

export default CodeVariables
