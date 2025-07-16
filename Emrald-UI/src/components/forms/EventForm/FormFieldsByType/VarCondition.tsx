import CodeEditorWithVariables from '../../../common/CodeEditorWithVariables';
import { useEventFormContext } from '../EventFormContext';
import { appData } from '../../../../hooks/useAppData';

const VarCondition = () => {
  const { codeVariables, scriptCode, addToUsedVariables, setScriptCode } = useEventFormContext();

  return (
    <>
      <CodeEditorWithVariables
        scriptCode={scriptCode ?? ''}
        setScriptCode={setScriptCode}
        variableList={appData.value.VariableList}
        codeVariables={codeVariables ?? []}
        addToUsedVariables={addToUsedVariables}
        heading={<span>Evaluate Code (c#) - Must return a boolean value!</span>}
      />
    </>
  );
};

export default VarCondition;
