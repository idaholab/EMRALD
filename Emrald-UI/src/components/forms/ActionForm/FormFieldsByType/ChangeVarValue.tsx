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
import CodeVariables from '../../../common/CodeVariables';
import CodeEditorWithVariables from '../../../common/CodeEditorWithVariables';
import SelectComponent from '../../../common/SelectComponent';

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
      <SelectComponent
        label="Variable"
        value={variableName}
        setValue={setVariableName}
      >
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
