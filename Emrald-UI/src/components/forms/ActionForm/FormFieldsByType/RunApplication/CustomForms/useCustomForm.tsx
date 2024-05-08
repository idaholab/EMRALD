import { useActionContext } from "../../../../../../contexts/ActionContext";
import { useDiagramContext } from "../../../../../../contexts/DiagramContext";
import { useEventContext } from "../../../../../../contexts/EventContext";
import { useLogicNodeContext } from "../../../../../../contexts/LogicNodeContext";
import { useStateContext } from "../../../../../../contexts/StateContext";
import { useVariableContext } from "../../../../../../contexts/VariableContext";

export function useCustomForm() {
  const { diagramList: { value: diagrams } } = useDiagramContext();
  const {logicNodeList: { value: logicNodes }} = useLogicNodeContext();
  const { actionsList: { value: actions }} = useActionContext();
  const { eventsList: { value: events } } = useEventContext();
  const { statesList: { value: states } } = useStateContext();
  const { variableList: { value: variables }} = useVariableContext();
  // ... get data from other contexts


  return {
    diagrams,
    logicNodes,
    actions,
    events,
    states,
    variables,
  };
}
