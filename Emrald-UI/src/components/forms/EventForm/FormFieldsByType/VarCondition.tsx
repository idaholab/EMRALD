import CodeEditorWithVariables from '@/components/common/CodeEditorWithVariables';
import { appData } from '@/hooks/useAppData';
import { useEventFormContext } from '../EventFormContext';

export const VarCondition: React.FC = () => {
  const { codeVariables, scriptCode, addToUsedVariables, setScriptCode }
    = useEventFormContext();

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
