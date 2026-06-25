import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useVariableContext } from '../../../../contexts/VariableContext';
import { CodeEditorWithVariables } from '../../../common/CodeEditorWithVariables';
import { DistributionFields } from '../../../common/DistributionFields';
import { SelectComponent } from '../../../common/SelectComponent';
import { useActionFormContext } from '../ActionFormContext';

export const ChangeVarValue: React.FC = () => {
  const {
    variableName,
    codeVariables,
    scriptCode,
    useDistribution,
    distType,
    distParameters,
    setVariableName,
    addToUsedVariables,
    setScriptCode,
    setUseDistribution,
    setDistType,
    setDistParameters,
    setHasError,
  } = useActionFormContext();
  const { variableList } = useVariableContext();
  const [invalidValues, setInvalidValues] = useState<Set<string>>(new Set());

  const mode: 'code' | 'distribution' = useDistribution
    ? 'distribution'
    : 'code';

  useEffect(() => {
    if (variableName === undefined || variableName.length === 0) {
      setHasError(true);
      return;
    }
    if (mode === 'distribution') {
      setHasError(invalidValues.size > 0 || !distType);
    } else {
      setHasError(false);
    }
  }, [variableName, mode, invalidValues, distType, setHasError]);

  const handleModeChange = (newMode: 'code' | 'distribution') => {
    if (newMode === 'distribution') {
      setUseDistribution(true);
      if (!distType) {
        setDistType('dtNormal');
      }
    } else {
      setUseDistribution(false);
    }
  };

  return (
    <>
      <SelectComponent
        label="Variable"
        value={variableName}
        setValue={setVariableName}
      >
        {variableList.value.map(variable => (
          <MenuItem value={variable.name} key={variable.id}>
            {variable.name}
          </MenuItem>
        ))}
      </SelectComponent>

      <Box sx={{ mt: 2 }}>
        <b>New Value Source</b>
        <RadioGroup
          row
          value={mode}
          onChange={e => {
            handleModeChange(e.target.value as 'code' | 'distribution');
          }}
        >
          <FormControlLabel value="code" control={<Radio />} label="Code" />
          <FormControlLabel
            value="distribution"
            control={<Radio />}
            label="Distribution"
          />
        </RadioGroup>
      </Box>

      {mode === 'code' ? (
        <CodeEditorWithVariables
          scriptCode={scriptCode}
          setScriptCode={setScriptCode}
          variableList={variableList.value}
          codeVariables={codeVariables}
          addToUsedVariables={addToUsedVariables}
          heading={
            <span>
              New Value Code (c#)
              <br />
              Must return same type as the specified variable
            </span>
          }
          codeContext="changeVarValue"
        />
      ) : (
        <DistributionFields
          distType={distType}
          setDistType={setDistType}
          parameters={distParameters}
          setParameters={setDistParameters}
          invalidValues={invalidValues}
          setInvalidValues={setInvalidValues}
          showTimeRate={false}
        />
      )}
    </>
  );
};
