import { useMemo, useState } from 'react';
import { useActionContext } from '../../../../../../contexts/ActionContext';
import { useDiagramContext } from '../../../../../../contexts/DiagramContext';
import { useEventContext } from '../../../../../../contexts/EventContext';
import { useLogicNodeContext } from '../../../../../../contexts/LogicNodeContext';
import { useStateContext } from '../../../../../../contexts/StateContext';
import { useVariableContext } from '../../../../../../contexts/VariableContext';
import { useActionFormContext } from '../../../ActionFormContext';
import useRunApplication from '../useRunApplication';

export function useCustomForm() {
  const {
    diagramList: { value: diagrams },
  } = useDiagramContext();
  const {
    logicNodeList: { value: logicNodes },
  } = useLogicNodeContext();
  const {
    actionsList: { value: actions },
  } = useActionContext();
  const {
    eventsList: { value: events },
  } = useEventContext();
  const {
    statesList: { value: states },
  } = useStateContext();
  const {
    variableList: { value: variables },
  } = useVariableContext();
  const {
    formData,
    codeVariables,
    exePath,
    setFormData,
    setExePath,
    setMakeInputFileCode,
    setProcessOutputFileCode,
    setCodeVariables,
  } = useActionFormContext();
  const { preCodeUsed } = useRunApplication();
  const [postCodeUsed, setPostCodeUsed] = useState(false);
  const [exePathUsed, setExePathUsed] = useState(false);
  const [codeVariablesUsed, setCodeVariablesUsed] = useState(false);

  // ... get data from other contexts

  const resetUseCode = () => {
    setMakeInputFileCode('');
    setProcessOutputFileCode('');
    // setExePath('');
    setCodeVariables(codeVariables);
  };

  const isValid = useMemo(() => {
    if (!preCodeUsed || !postCodeUsed || !exePathUsed || !codeVariablesUsed) {
      resetUseCode();
    }
    return preCodeUsed && postCodeUsed && exePathUsed && codeVariablesUsed;
  }, [preCodeUsed, postCodeUsed, exePathUsed, codeVariablesUsed]);

  const ReturnPostCode = (postCode: string) => {
    setProcessOutputFileCode(postCode);
    setPostCodeUsed(true);
  };

  const ReturnExePath = (path: string) => {
    setExePath(path);
    setExePathUsed(true);
  };

  const ReturnUsedVariables = (variableName: string) => {
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
    setCodeVariablesUsed(true);
  };

  return {
    formData,
    isValid,
    diagrams,
    logicNodes,
    actions,
    events,
    states,
    variables,
    exePath,
    setExePath,
    setFormData,
    ReturnPostCode,
    ReturnExePath,
    ReturnUsedVariables,
  };
}
