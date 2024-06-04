import { useActionContext } from '../contexts/ActionContext';
import { useDiagramContext } from '../contexts/DiagramContext';
import { useEventContext } from '../contexts/EventContext';
import { useExtSimContext } from '../contexts/ExtSimContext';
import { useLogicNodeContext } from '../contexts/LogicNodeContext';
import { useModelDetailsContext } from '../contexts/ModelDetailsContext';
import { useStateContext } from '../contexts/StateContext';
import { useVariableContext } from '../contexts/VariableContext';
import { useWindowContext } from '../contexts/WindowContext';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { upgradeModel } from '../utils/Upgrades/upgrade';
import { updateAppData } from './useAppData';

export function useAssembledData() {
  // const { updateAppData } = useAppData();
  const {
    id,
    name,
    desc,
    emraldVersion,
    version,
    updateName,
    updateDescription,
    updateVersion,
  } = useModelDetailsContext();
  const { diagrams, clearDiagramList, newDiagramList, mergeDiagramList } =
    useDiagramContext();
  const {
    logicNodes,
    clearLogicNodeList,
    newLogicNodeList,
  } = useLogicNodeContext();
  const { actions, clearActionList, newActionList } = useActionContext();
  const { events, clearEventList, newEventList } = useEventContext();
  const { states, clearStateList, newStateList } = useStateContext();
  const { variables, clearVariableList, newVariableList } =
    useVariableContext();
  const { newExtSimList } = useExtSimContext();
  const { closeAllWindows } = useWindowContext();
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

  const refreshWithNewData = (model: EMRALD_Model) => {
    newDiagramList(model.DiagramList || []);
    newLogicNodeList(model.LogicNodeList || []);
    newActionList(model.ActionList || []);
    newStateList(model.StateList || []);
    newEventList(model.EventList || []);
    newVariableList(model.VariableList || []);
    newExtSimList(model.ExtSimList || []);
  }

  // Function to replace data with imported data from the JSON file
  const populateNewData = (jsonContent: string) => {
    try {
      let jsonData;

      if (typeof jsonContent === 'string') {
        jsonData = JSON.parse(jsonContent);
      } else {
        jsonData = jsonContent;
      }

      const upgrade = upgradeModel(3.0, JSON.stringify(jsonData));

      if (upgrade) {
        closeAllWindows(); // close all active windows when opening a new project
        const openedModel: EMRALD_Model = upgrade;
        updateName(openedModel.name);
        updateDescription(openedModel.desc);
        updateVersion(openedModel.version);
        newDiagramList(openedModel.DiagramList || []);
        newLogicNodeList(openedModel.LogicNodeList || []);
        newActionList(openedModel.ActionList || []);
        newStateList(openedModel.StateList || []);
        newEventList(openedModel.EventList || []);
        newVariableList(openedModel.VariableList || []);
        newExtSimList(openedModel.ExtSimList || []);
        updateAppData(openedModel);
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
    };
  };

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
    refreshWithNewData,
    populateNewData,
    mergeNewData,
    assembleData,
    assembledData,
  };
}
