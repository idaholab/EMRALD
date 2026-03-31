import type { EMRALD_Model } from '../types/EMRALD_Model';
import type { ModelItem } from '../types/ModelUtils';
import { ImportForm } from '../components/forms/ImportForm/ImportForm';
import {
  CompareModels,
  type ModelDifference,
  type ModelValue,
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
    const differences: ModelDifference[] = [];
    const excludedKeys = new Set(['id']);
    const formatKeyName = (key: string) =>
      (key[0]?.toUpperCase() ?? '') + key.slice(1);
    /**
     * Recursively checks each property of the objects for equality.
     * @param base - The base object to compare against.
     * @param compare - The object to compare to.
     */
    const checkObjDiff = (
      base: ModelValue | undefined,
      compare: ModelValue | undefined,
      path: string,
    ) => {
      if (base === undefined || compare === undefined) {
        if (!(base === undefined && compare === undefined)) {
          differences.push({
            key: path,
            oldValue: base === undefined ? 'Does not exist' : 'Exists',
            newValue: compare === undefined ? 'Does not exist' : 'Exists',
          });
        }
        return;
      }
      if (typeof base !== typeof compare) {
        differences.push({
          key: path,
          oldValue: `Type: ${typeof base}`,
          newValue: `Type: ${typeof compare}`,
        });
        return;
      }
      if (Array.isArray(base) && Array.isArray(compare)) {
        for (const [i, element] of base.entries()) {
          checkObjDiff(element, compare[i], `${path}[${i.toString()}]`);
        }
        // The array.isarray checks on this if are redundant, but TypeScript gets confused without them
      } else if (
        typeof base === 'object'
        && typeof compare === 'object'
        && !Array.isArray(base)
        && !Array.isArray(compare)
      ) {
        for (const key in compare) {
          if (base[key] && compare[key]) {
            checkObjDiff(
              base[key],
              compare[key],
              `${path} ${formatKeyName(key)}`,
            );
          } else if (!excludedKeys.has(key)) {
            differences.push({
              key: `${path} ${formatKeyName(key)}`,
              oldValue: base[key] === undefined ? 'Does not exist' : 'Exists',
              newValue:
                compare[key] === undefined ? 'Does not exist' : 'Exists',
            });
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
        differences.push({
          key: path,
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
            item.name,
          );
          baseNames.splice(baseNames.indexOf(item.name), 1);
        } else {
          differences.push({
            key: item.objType,
            newValue: item.name,
            oldValue: 'Does not exist',
          });
        }
      }
      for (const name of baseNames) {
        differences.push({
          key: base[0]?.objType ?? '',
          newValue: 'Does not exist',
          oldValue: name,
        });
      }
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
      `Compare Model: ${newModel.name ?? ''}`,
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
