import { useActionContext } from '../contexts/ActionContext';
import { useDiagramContext } from '../contexts/DiagramContext';
import { useEventContext } from '../contexts/EventContext';
import { useLogicNodeContext } from '../contexts/LogicNodeContext';
import { useModelDetailsContext } from '../contexts/ModelDetailsContext';
import { useStateContext } from '../contexts/StateContext';
import { useVariableContext } from '../contexts/VariableContext';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { appData, useAppData } from './useAppData';
import { EMRALD_Model, EMRALD_SchemaVersion } from '../types/EMRALD_Model';
// ... import other context hooks

export function useAssembledData() {
  const { updateAppData } = useAppData();
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
        let jsonData;
    
        if (typeof jsonContent === 'string') {
          jsonData = JSON.parse(jsonContent);
        } else {
          jsonData = jsonContent;
        }
    
        //const upgrade = new Upgrade(JSON.stringify(jsonData));
        //const upgradeSuccessful = upgrade.upgrade(3.0); // upgrade to version 3.0
        const newModel : EMRALD_Model | null = upgradeModel(EMRALD_SchemaVersion, JSON.stringify(jsonData));
        if (newModel != null) {
          appData.value = newModel as EMRALD_Model;
          updateName(appData.value.name);
          updateDescription(appData.value.desc);
          updateVersion(appData.value.version);
          newDiagramList(appData.value.DiagramList || []);
          newLogicNodeList(appData.value.LogicNodeList || []);
          newEventList(appData.value.EventList || []);
          newVariableList(appData.value.VariableList || []);
          // updateAppData(appData.value);
        } else {
          console.error('Error parsing JSON: Upgrade not successful');
        }

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
