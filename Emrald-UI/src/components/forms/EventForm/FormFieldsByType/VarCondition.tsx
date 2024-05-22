import React from 'react';
import { useVariableContext } from '../../../../contexts/VariableContext';
import CodeEditorWithVariables from '../../../common/CodeEditorWithVariables';
import { useEventFormContext } from '../EventFormContext';

const VarCondition = () => {
  const { codeVariables, scriptCode, addToUsedVariables, setScriptCode } = useEventFormContext();
  const { variableList } = useVariableContext();

  return (
    <>
      <CodeEditorWithVariables
        scriptCode={scriptCode}
        setScriptCode={setScriptCode}
        variableList={variableList.value}
        codeVariables={codeVariables}
        addToUsedVariables={addToUsedVariables}
        heading={<span>Evaluate Code (c#) - Must return a boolean value!</span>}
      />
    </>
  );
};

export default VarCondition;
