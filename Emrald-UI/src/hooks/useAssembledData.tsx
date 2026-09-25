import type { EMRALD_Model } from '../types/EMRALD_Model';
import type { ModelItem } from '../types/ModelUtils';
import { ImportForm } from '../components/forms/ImportForm/ImportForm';
import {
  CompareModels,
  ITEM_EXISTENCE_KEY,
  type ModelDifferences,
  type ModelValue,
  type PropertyDifference,
} from '../components/layout/CompareModels';
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
import { appData, updateAppData } from './useAppData';

export function useAssembledData() {
  const {
    id,
    name,
    desc,
    emraldVersion,
    version,
    clearFileName,
    setName,
    setDesc,
    setVersion,
  } = useModelDetailsContext();
  const { diagrams, clearDiagramList, newDiagramList } = useDiagramContext();
  const { logicNodes, clearLogicNodeList, newLogicNodeList }
    = useLogicNodeContext();
  const { actions, clearActionList, newActionList } = useActionContext();
  const { events, clearEventList, newEventList } = useEventContext();
  const { states, clearStateList, newStateList } = useStateContext();
  const { variables, clearVariableList, newVariableList }
    = useVariableContext();
  const { newExtSimList, clearExtSimList } = useExtSimContext();
  const { newTemplateList, clearTemplateList, mergeTemplateToList }
    = useTemplateContext();
  const { addWindow, closeAllWindows } = useWindowContext();
  // ... get data from other contexts

  const newProject = () => {
    // Close any open windows
    closeAllWindows();
    setName('');
    setDesc('');
    setVersion(1);
    clearDiagramList();
    clearLogicNodeList();
    clearActionList();
    clearEventList();
    clearVariableList();
    clearStateList();
    clearTemplateList();
    clearExtSimList();
    clearFileName();
    updateAppData({
      ...appData.value,
      name: undefined,
      desc: undefined,
      version: 1,
      versionHistory: [],
    });
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
        setName(openedModel.name);
        setDesc(openedModel.desc);
        setVersion(openedModel.version);
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
      for (const template of newModel.templates) {
        mergeTemplateToList(template);
      }
    }

    // Open import window to make sure conflicts are resolved before merging.
    addWindow(
      `Merge Model: ${newModel.name ?? ''}`,
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
    const differences: ModelDifferences = {};
    const excludedKeys = new Set(['id']);
    const formatKeyName = (key: string) =>
      (key[0]?.toUpperCase() ?? '') + key.slice(1);
    const joinPath = (path: string, key: string) =>
      path ? `${path} ${formatKeyName(key)}` : formatKeyName(key);
    const existence = (value: ModelValue) =>
      value === undefined ? 'Does not exist' : 'Exists';
    /**
     * Records a difference for the given property of an item, creating the category and item entries as needed.
     * @param category - The type of item the difference belongs to (e.g. "State").
     * @param item - The name of the item that differs.
     * @param property - The path of the differing property within the item.
     */
    const addDifference = (
      category: string,
      item: string,
      property: string,
      difference: PropertyDifference,
    ) => {
      differences[category] ??= {};
      differences[category][item] ??= {};
      differences[category][item][property] = difference;
    };
    /**
     * Recursively checks each property of the objects for equality.
     * @param base - The base object to compare against.
     * @param compare - The object to compare to.
     * @param addDiff - Records a difference at the given property path.
     * @param path - The property path of the current values within the item.
     */
    const checkObjDiff = (
      base: ModelValue | undefined,
      compare: ModelValue | undefined,
      addDiff: (property: string, difference: PropertyDifference) => void,
      path: string,
    ) => {
      if (base === undefined || compare === undefined) {
        if (base !== compare) {
          addDiff(path, {
            oldValue: existence(base),
            newValue: existence(compare),
          });
        }
        return;
      }
      if (typeof base !== typeof compare) {
        addDiff(path, {
          oldValue: `Type: ${typeof base}`,
          newValue: `Type: ${typeof compare}`,
        });
        return;
      }
      if (Array.isArray(base) && Array.isArray(compare)) {
        const length = Math.max(base.length, compare.length);
        for (let i = 0; i < length; i++) {
          checkObjDiff(
            base[i],
            compare[i],
            addDiff,
            `${path}[${i.toString()}]`,
          );
        }
        // The array.isarray checks on this if are redundant, but TypeScript gets confused without them
      } else if (
        typeof base === 'object'
        && typeof compare === 'object'
        && !Array.isArray(base)
        && !Array.isArray(compare)
      ) {
        for (const key in compare) {
          if (!excludedKeys.has(key.toLowerCase())) {
            if (base[key] !== undefined && compare[key] !== undefined) {
              checkObjDiff(
                base[key],
                compare[key],
                addDiff,
                joinPath(path, key),
              );
            } else {
              addDiff(joinPath(path, key), {
                oldValue: existence(base[key]),
                newValue: existence(compare[key]),
              });
            }
          }
        }
        // Again, the redundant checks are just to help TypeScript understand
      } else if (
        typeof base !== 'object'
        && typeof compare !== 'object'
        && !Array.isArray(base)
        && !Array.isArray(compare)
        && base !== compare
      ) {
        addDiff(path, {
          oldValue: base,
          newValue: compare,
        });
      }
    };
    const processItemList = (base: ModelItem[], compare: ModelItem[]) => {
      const baseNames = base.map(item => item.name);
      for (const item of compare) {
        const baseItem = base.find(i => i.name === item.name);
        if (baseItem) {
          // Force ModelItems to be represented as a Record<string, ...>
          checkObjDiff(
            baseItem as unknown as ModelValue,
            item as unknown as ModelValue,
            (property, difference) => {
              addDifference(item.objType, item.name, property, difference);
            },
            '',
          );
          baseNames.splice(baseNames.indexOf(item.name), 1);
        } else {
          addDifference(item.objType, item.name, ITEM_EXISTENCE_KEY, {
            oldValue: 'Does not exist',
            newValue: 'Exists',
          });
        }
      }
      for (const name of baseNames) {
        addDifference(base[0]?.objType ?? '', name, ITEM_EXISTENCE_KEY, {
          oldValue: 'Exists',
          newValue: 'Does not exist',
        });
      }
    };
    const addProjectDifference = (
      property: string,
      oldValue: ModelValue,
      newValue: ModelValue,
    ) => {
      if (oldValue !== newValue) {
        addDifference('Project', 'Project Details', property, {
          oldValue,
          newValue,
        });
      }
    };
    addProjectDifference(
      'EMRALD Version',
      appData.value.emraldVersion,
      newModel.emraldVersion,
    );
    addProjectDifference('Name', appData.value.name, newModel.name);
    addProjectDifference('Description', appData.value.desc, newModel.desc);
    addProjectDifference('Version', appData.value.version, newModel.version);
    processItemList(appData.value.DiagramList, newModel.DiagramList);
    processItemList(appData.value.ActionList, newModel.ActionList);
    processItemList(appData.value.EventList, newModel.EventList);
    processItemList(appData.value.StateList, newModel.StateList);
    processItemList(appData.value.VariableList, newModel.VariableList);
    processItemList(appData.value.LogicNodeList, newModel.LogicNodeList);
    processItemList(appData.value.ExtSimList, newModel.ExtSimList);
    // Ignoring versionHistory and templates differences for now
    addWindow(
      `Compare Model: ${newModel.name ?? ''}`,
      <CompareModels differences={differences} />,
      {
        x: 75,
        y: 25,
        width: 1000,
        height: 550,
      },
      null,
    );
  };

  const assembleData = () => {
    if (version) {
      setVersion(Number.parseFloat((version + 0.1).toFixed(1)));
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
