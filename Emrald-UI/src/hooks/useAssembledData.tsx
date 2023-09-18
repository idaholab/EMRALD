import { useActionContext } from '../contexts/ActionContext';
import { useDiagramContext } from '../contexts/DiagramContext';
import { useEventContext } from '../contexts/EventContext';
import { useLogicNodeContext } from '../contexts/LogicNodeContext';
import { useModelDetailsContext } from '../contexts/ModelDetailsContext';
import { useStateContext } from '../contexts/StateContext';
import { useVariableContext } from '../contexts/VariableContext';
// ... import other context hooks

export function useAssembledData() {
  const {
    id,
    name,
    desc,
    emraldVersion,
    version,
    updateName,
    updateDescription,
    updateEmraldVersion,
    updateVersion,
  } = useModelDetailsContext();
  const { diagrams, clearDiagramList, newDiagramList, mergeDiagramList } =
    useDiagramContext();
  const {
    logicNodes,
    clearLogicNodeList,
    newLogicNodeList,
    mergeLogicNodeList,
  } = useLogicNodeContext();
  const { actions, clearActionList } = useActionContext();
  const { events, clearEventList, newEventList } = useEventContext();
  const { states, clearStateList } = useStateContext();
  const { variables, clearVariableList, newVariableList } = useVariableContext();
  // ... get data from other contexts

  const newProject = () => {
    updateName('');
    updateDescription('');
    updateVersion(1.3);
    clearDiagramList();
    clearLogicNodeList();
    clearActionList();
    clearEventList();
    clearVariableList();
    clearStateList();
  };

  // Function to replace data with imported data from the JSON file
  const populateNewData = (jsonContent: string) => {
    try {
      const jsonData = JSON.parse(jsonContent);
      updateName(jsonData.name);
      updateDescription(jsonData.desc);
      updateVersion(jsonData.version);
      newDiagramList(jsonData.DiagramList || []);
      newLogicNodeList(jsonData.LogicNodeList || []);
      newEventList(jsonData.EventList || []);
      newVariableList(jsonData.VariableList || []);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  // Function to merge data with imported data from the JSON file
  const mergeNewData = (jsonContent: string) => {
    try {
      const jsonData = JSON.parse(jsonContent);
      mergeDiagramList(jsonData.DiagramList || []);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  const assembleData = () => {
    updateVersion(parseFloat((version + 0.1).toFixed(1)));

    return {
      id,
      name,
      desc,
      emraldVersion,
      version,
      DiagramList: diagrams,
      LogicNodeList: logicNodes,
      StateList: states,
      ActionList: actions,
      EventList: events,
      VariableList: variables,
    }
  }

  const assembledData = {
    id,
    name,
    desc,
    emraldVersion,
    version,
    DiagramList: diagrams,
    LogicNodeList: logicNodes,
    StateList: states,
    ActionList: actions,
    EventList: events,
    VariableList: variables,
  };

  return {
    newProject,
    populateNewData,
    mergeNewData,
    assembleData,
    assembledData,
  };
}
