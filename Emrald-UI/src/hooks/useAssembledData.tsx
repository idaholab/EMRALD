import { useActionContext } from '../contexts/ActionContext';
import { useDiagramContext } from '../contexts/DiagramContext';
import { useEventContext } from '../contexts/EventContext';
import { useExtSimContext } from '../contexts/ExtSimContext';
import { useLogicNodeContext } from '../contexts/LogicNodeContext';
import { useModelDetailsContext } from '../contexts/ModelDetailsContext';
import { useStateContext } from '../contexts/StateContext';
import { useTemplateContext } from '../contexts/TemplateContext';
import { useVariableContext } from '../contexts/VariableContext';
import { useWindowContext } from '../contexts/WindowContext';
import type { EMRALD_Model } from '../types/EMRALD_Model';
import { updateAppData } from './useAppData';
import ImportForm from '../components/forms/ImportForm/ImportForm';

export function useAssembledData() {
  // const { updateAppData } = useAppData();
  const {
    id,
    name,
    desc,
    emraldVersion,
    version,
    clearFileName,
    updateName,
    updateDescription,
    updateVersion,
  } = useModelDetailsContext();
  const { diagrams, clearDiagramList, newDiagramList } = useDiagramContext();
  const { logicNodes, clearLogicNodeList, newLogicNodeList } = useLogicNodeContext();
  const { actions, clearActionList, newActionList } = useActionContext();
  const { events, clearEventList, newEventList } = useEventContext();
  const { states, clearStateList, newStateList } = useStateContext();
  const { variables, clearVariableList, newVariableList } = useVariableContext();
  const { newExtSimList, clearExtSimList } = useExtSimContext();
  const { newTemplateList, clearTemplateList, mergeTemplateToList } = useTemplateContext();
  const { addWindow, closeAllWindows } = useWindowContext();
  // ... get data from other contexts

  const newProject = () => {
    updateName('');
    updateDescription('');
    updateVersion(1);
    clearDiagramList();
    clearLogicNodeList();
    clearActionList();
    clearEventList();
    clearVariableList();
    clearStateList();
    clearTemplateList();
    clearExtSimList();
    clearFileName();
  };

  const refreshWithNewData = (model: EMRALD_Model) => {
    newDiagramList(model.DiagramList);
    newLogicNodeList(model.LogicNodeList);
    newActionList(model.ActionList);
    newStateList(model.StateList);
    newEventList(model.EventList);
    newVariableList(model.VariableList);
    newExtSimList(model.ExtSimList);
  };

  // Function to replace data with imported data from the JSON file
  const populateNewData = (openedModel?: EMRALD_Model) => {
    try {
      if (openedModel) {
        closeAllWindows(); // close all active windows when opening a new project
        updateName(openedModel.name);
        updateDescription(openedModel.desc);
        updateVersion(openedModel.version);
        newTemplateList(openedModel.templates ?? []);
        updateAppData(openedModel);
      } else {
        console.error('Error parsing JSON: Upgrade not successful');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  // Function to merge data with imported data from the JSON file
  const mergeNewData = (newModel: EMRALD_Model) => {
    // Merge templates if there are any in the new model.
    if (newModel.templates && newModel.templates.length > 0) {
      newModel.templates.forEach((template) => {
        mergeTemplateToList(template);
      });
    }

    // Open import window to make sure conflicts are resolved before merging.
    addWindow(
      `Merge Model: ${newModel.name}`,
      <ImportForm importedData={newModel} fromTemplate={true} />,
      {
        x: 75,
        y: 25,
        width: 1300,
        height: 750,
      },
      null,
    );
  };

  const assembleData = () => {
    if (version) {
      updateVersion(parseFloat((version + 0.1).toFixed(1)));
    }

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
