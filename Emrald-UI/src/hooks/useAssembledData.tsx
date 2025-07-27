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
import { updateAppData, appData } from './useAppData';
import ImportForm from '../components/forms/ImportForm/ImportForm';
import { CompareModels, type ModelDifference } from '../components/layout/CompareModels';
import type { ModelItem } from '../types/ModelUtils';

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

  const compareData = (newModel: EMRALD_Model) => {
    const differences: ModelDifference[] = [];
    const excludedKeys = ['id'];
    const formatKeyName = (key: string) => key[0].toUpperCase() + key.substring(1);
    /**
     * Recursively checks each property of the objects for equality.
     * Makes the major assumption that the type associated with a given key is the same for both objects.
     * @param base - The base object to compare against.
     * @param compare - The object to compare to.
     */
    const checkObjDiff = (base: Record<string, any>, compare: Record<string, any>, path: string) => {
      const baseKeys = Object.keys(base);
      Object.keys(compare).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(base, key)) {
          if (Array.isArray(compare[key]) && Array.isArray(base[key])) {
            if (typeof compare[key][0] === 'object') {
              for (let i = 0; i < compare[key].length; i += 1) {
                checkObjDiff(base[key][i], compare[key][i], `${path} ${formatKeyName(key)}[${i.toString()}]`);
              }
            } else if (compare[key].sort().join('') !== base[key].sort().join('')) {
              differences.push({
                key: `${path} ${formatKeyName(key)}`,
                oldValue: base[key].join(', '),
                newValue: compare[key].join(', '),
              });
            }
          } else if (typeof compare[key] === 'object') {
            checkObjDiff(base[key], compare[key], `${path} ${formatKeyName(key)}`);
          } else if (compare[key] !== base[key]) {
            differences.push({
              key: `${path} ${formatKeyName(key)}`,
              oldValue: base[key],
              newValue: compare[key],
            });
          }
          baseKeys.splice(baseKeys.indexOf(key), 1);
        } else if (!excludedKeys.includes(key)) {
          differences.push({
            key: `${path} ${formatKeyName(key)}`,
            oldValue: 'Does not exist',
            newValue: compare[key],
          });
        }
      });
    };
    const processItemList = (base: ModelItem[], compare: ModelItem[]) => {
      const baseNames = base.map((item) => item.name);
      compare.forEach((item) => {
        const baseItem = base.find((i) => i.name === item.name);
        if (baseItem) {
          checkObjDiff(baseItem, item, item.name);
          baseNames.splice(baseNames.indexOf(item.name), 1);
        } else {
          differences.push({
            key: item.objType,
            newValue: item.name,
            oldValue: 'Does not exist'
          });
        }
      });
      baseNames.forEach((name) => {
        differences.push({
          key: base[0].objType,
          newValue: 'Does not exist',
          oldValue: name,
        });
      });
    };
    if (newModel.emraldVersion !== appData.value.emraldVersion) {
      differences.push({
        key: 'EMRALD Version',
        newValue: newModel.emraldVersion,
        oldValue: appData.value.emraldVersion,
      });
    }
    if (newModel.name !== appData.value.name) {
      differences.push({
        key: 'Project Name',
        newValue: newModel.name,
        oldValue: appData.value.name,
      });
    }
    if (newModel.desc !== appData.value.desc) {
      differences.push({
        key: 'Project Description',
        newValue: newModel.desc,
        oldValue: appData.value.desc,
      });
    }
    if (newModel.version !== appData.value.version) {
      differences.push({
        key: 'Project Version',
        newValue: newModel.version,
        oldValue: appData.value.version,
      });
    }
    processItemList(appData.value.DiagramList, newModel.DiagramList);
    processItemList(appData.value.ActionList, newModel.ActionList);
    processItemList(appData.value.EventList, newModel.EventList);
    processItemList(appData.value.StateList, newModel.StateList);
    processItemList(appData.value.VariableList, newModel.VariableList);
    processItemList(appData.value.LogicNodeList, newModel.LogicNodeList);
    processItemList(appData.value.ExtSimList, newModel.ExtSimList);
    // Ignoring versionHistory and templates differences for now
    addWindow(
      `Compare Model: ${newModel.name}`,
      <CompareModels differences={differences} />,
      {
        x: 75,
        y: 25,
        width: 1000,
        height: 350,
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
    compareData,
    assembleData,
    assembledData,
  };
}
