import { useActionContext } from '../../../../../../contexts/ActionContext';
import { useDiagramContext } from '../../../../../../contexts/DiagramContext';
import { useEventContext } from '../../../../../../contexts/EventContext';
import { useLogicNodeContext } from '../../../../../../contexts/LogicNodeContext';
import { useStateContext } from '../../../../../../contexts/StateContext';
import { useVariableContext } from '../../../../../../contexts/VariableContext';
import { useActionFormContext } from '../../../ActionFormContext';

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
    setProcessOutputFileCode,
    setCodeVariables,
    setReturnProcess,
    setVariableName,
  } = useActionFormContext();

  const ReturnPostCode = (postCode: string) => {
    setProcessOutputFileCode(postCode);
  };

  const ReturnExePath = (path: string) => {
    setExePath(path);
  };

  const ReturnUsedVariables = (variableName: string) => {
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
  };

  return {
    formData,
    diagrams,
    logicNodes,
    actions,
    events,
    states,
    variables,
    exePath,
    setExePath,
    setFormData,
    setReturnProcess,
    setVariableName,
    ReturnPostCode,
    ReturnExePath,
    ReturnUsedVariables,
  };
}
