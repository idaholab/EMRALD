import type { EventFormProps } from '../EventForm';
import { useEffect } from 'react';
import { CodeEditorWithVariables } from '@/components/common/CodeEditorWithVariables';
import { appData } from '@/hooks/useAppData';
import { useEventFormContext } from '../EventFormContext';

export const VarCondition: React.FC<EventFormProps> = ({ eventData }) => {
  const {
    addToUsedVariables,
    codeVariables,
    setCodeVariables,
    scriptCode,
    setScriptCode,
    setTypeProperties,
    sync,
  } = useEventFormContext();

  useEffect(() => {
    setScriptCode(eventData?.code);
    setCodeVariables(eventData?.varNames);
    setTypeProperties(['code', 'varNames']);
  }, []);

  useEffect(() => {
    sync({ code: scriptCode, varNames: codeVariables });
  }, [scriptCode, codeVariables]);

  return (
    <CodeEditorWithVariables
      scriptCode={scriptCode ?? ''}
      setScriptCode={setScriptCode}
      variableList={appData.value.VariableList}
      codeVariables={codeVariables ?? []}
      addToUsedVariables={addToUsedVariables}
      heading={<span>Evaluate Code (c#) - Must return a boolean value!</span>}
      codeContext="event"
    />
  );
};
