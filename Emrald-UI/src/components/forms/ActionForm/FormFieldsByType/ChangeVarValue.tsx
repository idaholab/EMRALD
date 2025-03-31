import { MenuItem } from '@mui/material';
import { useActionFormContext } from '../ActionFormContext';
import { useVariableContext } from '../../../../contexts/VariableContext';
import CodeEditorWithVariables from '../../../common/CodeEditorWithVariables';
import SelectComponent from '../../../common/SelectComponent';
import { useEffect } from 'react';

const ChangeVarValue = () => {
  const {
    variableName,
    codeVariables,
    scriptCode,
    setVariableName,
    addToUsedVariables,
    setScriptCode,
    setHasError,
  } = useActionFormContext();
  const { variableList } = useVariableContext();

  useEffect(() => {
    setHasError(variableName.length === 0);
  });

  return (
    <>
      <SelectComponent label="Variable" value={variableName} setValue={setVariableName}>
        {variableList.value.map((variable) => (
          <MenuItem value={variable.name} key={variable.id}>
            <em>{variable.name}</em>
          </MenuItem>
        ))}
      </SelectComponent>

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
      />
    </>
  );
};

export default ChangeVarValue;
