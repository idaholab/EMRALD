import { useState, useEffect } from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import { useWindowContext } from '../../../contexts/WindowContext';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import { Diagram } from '../../../types/Diagram';
import { MainItemTypes } from '../../../types/ItemTypes';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';
import { ExtSim } from '../../../types/ExtSim';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { updateModelAndReferences, updateSpecifiedModel } from '../../../utils/UpdateModel';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useExtSimContext } from '../../../contexts/ExtSimContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { useVariableContext } from '../../../contexts/VariableContext';
import { GetItemByNameType } from '../../../utils/ModelReferences';
import { appData, updateAppData } from '../../../hooks/useAppData';

interface ImportedItem {
  type: MainItemTypes;
  displayType: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  conflict: boolean;
  required: boolean;
  emraldItem: Action | Diagram | LogicNode | ExtSim | Event | State | Variable;
}

export const useImportForm = (importedData: EMRALD_Model, fromTemplate?: boolean) => {
  const [findValue, setFindValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [hasConflicts, setHasConflicts] = useState<boolean>(true);
  const { diagramList } = useDiagramContext();
  const { logicNodeList } = useLogicNodeContext();
  const { extSimList } = useExtSimContext();
  const { eventsList } = useEventContext();
  const { statesList} = useStateContext();
  const { actionsList } = useActionContext();
  const { variableList } = useVariableContext();
  const { handleClose } = useWindowContext();
  const { addTemplateToModel } = useTemplateContext();
  const { refreshWithNewData } = useAssembledData();
  const originalTemplate = structuredClone(importedData);


  /**
 * Converts an EMRALD_Model object into an array of ImportedItem objects.
 *
 * @param {EMRALD_Model} model - The EMRALD_Model object to convert.
 * @return {ImportedItem[]} An array of ImportedItem objects.
 */
  const convertModelToArray = (model: EMRALD_Model): ImportedItem[] => {
    const items: ImportedItem[] = [];

    for (const diagram of model.DiagramList) {
      items.push({
        type: MainItemTypes.Diagram,
        displayType: 'Diagram',
        locked: !diagramList.value.some(item => item.name === diagram.name),
        oldName: diagram.name,
        newName: diagram.name,
        action: diagram.required ? 'ignore' : 'rename',
        conflict: hasConflict(diagram.name, MainItemTypes.Diagram, diagram.required),
        required: diagram.required ? diagram.required : false,
        emraldItem: diagram,
      });
    }

    for (const logicNode of model.LogicNodeList) {
      items.push({
        type: MainItemTypes.LogicNode,
        displayType: 'Logic Node',
        locked: !logicNodeList.value.some(item => item.name === logicNode.name),
        oldName: logicNode.name,
        newName: logicNode.name,
        action: 'rename',
        conflict: hasConflict(logicNode.name, MainItemTypes.LogicNode, logicNode.required),
        required: logicNode.required ? logicNode.required : false,
        emraldItem: logicNode,
      });
    }

    for (const extSim of model.ExtSimList) {
      items.push({
        type: MainItemTypes.ExtSim,
        displayType: 'External Sim',
        locked: !extSimList.value.some(item => item.name === extSim.name),
        oldName: extSim.name,
        newName: extSim.name,
        action: 'rename',
        conflict: hasConflict(extSim.name, MainItemTypes.ExtSim, extSim.required),
        required: extSim.required ? extSim.required : false,
        emraldItem: extSim,
      });
    }

    for (const action of model.ActionList) {
      items.push({
        type: MainItemTypes.Action,
        displayType: 'Action',
        locked: !actionsList.value.some(item => item.name === action.name) || action.required !== false,
        oldName: action.name,
        newName: action.name,
        action: action.required ? 'ignore' : 'rename',
        conflict: hasConflict(action.name, MainItemTypes.Action, action.required),
        required: action.required ? action.required : false,
        emraldItem: action,
      });
    }

    for (const event of model.EventList) {
      items.push({
        type: MainItemTypes.Event,
        displayType: 'Event',
        locked: !eventsList.value.some(item => item.name === event.name),
        oldName: event.name,
        newName: event.name,
        action: event.required ? 'ignore' : 'rename',
        conflict: hasConflict(event.name, MainItemTypes.Event, event.required),
        required: event.required ? event.required : false,
        emraldItem: event,
      });
    }

    for (const state of model.StateList) {
      items.push({
        type: MainItemTypes.State,
        displayType: 'State',
        locked: !statesList.value.some(item => item.name === state.name),
        oldName: state.name,
        newName: state.name,
        action: state.required ? 'ignore' : 'rename',
        conflict: hasConflict(state.name, MainItemTypes.State, state.required),
        required: state.required ? state.required : false,
        emraldItem: state,
      });
    }

    for (const variable of model.VariableList) {
      items.push({
        type: MainItemTypes.Variable,
        displayType: 'Variable',
        locked: !variableList.value.some(item => item.name === variable.name),
        oldName: variable.name,
        newName: variable.name,
        action: 'rename',
        conflict: hasConflict(variable.name, MainItemTypes.Variable, variable.required),
        required: variable.required ? variable.required : false,
        emraldItem: variable,
      });
    }
    return items.sort((a, b) => {
      if (a.type === MainItemTypes.Diagram) return -1;
      if (a.type === MainItemTypes.State && b.type !== MainItemTypes.Diagram) return -1;
      if (a.type === MainItemTypes.Event && b.type !== MainItemTypes.Diagram && b.type !== MainItemTypes.State) return -1;
      if (a.type === MainItemTypes.Action && b.type !== MainItemTypes.Diagram && b.type !== MainItemTypes.State && b.type !== MainItemTypes.Event) return -1;
      return 1;
    });
  };

  // set imported items
  useEffect(() => {
    setImportedItems(convertModelToArray(importedData));
  }, [importedData]);

  // set has conflicts
  useEffect(() => {
    const hasConflicts = importedItems.some((item) => hasConflict(item.newName, item.type, item.required));
    setHasConflicts(hasConflicts);
    
  }, [importedItems]);

    /**
   * Checks if a name conflict exists for the given type in the respective list.
   *
   * @param {string} newName - The name to check for conflicts.
   * @param {MainItemTypes} type - The type of the item to check for conflicts.
   * @return {boolean} True if a conflict exists, false otherwise.
   */
  const checkForConflicts = (newName: string, type: MainItemTypes): boolean => {
    switch(type) {
      case MainItemTypes.Diagram:
        return diagramList.value.some(item => item.name === newName);
      case MainItemTypes.LogicNode:
        return logicNodeList.value.some(item => item.name === newName);
      case MainItemTypes.ExtSim:
        return extSimList.value.some(item => item.name === newName);
      case MainItemTypes.Action:
        return actionsList.value.some(item => item.name === newName);
      case MainItemTypes.Event:
        return eventsList.value.some(item => item.name === newName);
      case MainItemTypes.State:
        return statesList.value.some(item => item.name === newName);
      case MainItemTypes.Variable:
        return variableList.value.some(item => item.name === newName);
      default:
        return false;
    }
  };

    /**
   * Checks if a required item with the given name and type exists.
   *
   * @param name - The name of the item to check.
   * @param type - The type of the item to check.
   * @returns True if the item exists, false otherwise.
   */
  const checkIfRequiredItemExists = (name: string, type: MainItemTypes) => {
    switch(type) {
      case MainItemTypes.Diagram:
        return diagramList.value.some(item => item.name === name);
      case MainItemTypes.LogicNode:
        return logicNodeList.value.some(item => item.name === name);
      case MainItemTypes.ExtSim:
        return extSimList.value.some(item => item.name === name);
      case MainItemTypes.Action:
        return actionsList.value.some(item => item.name === name);
      case MainItemTypes.Event:
        return eventsList.value.some(item => item.name === name);
      case MainItemTypes.State:
        return statesList.value.some(item => item.name === name);
      case MainItemTypes.Variable:
        return variableList.value.some(item => item.name === name);
      default:
        return false;
    }
  }

  /**
   * Determines the conflict status of an imported item.
   *
   * @param item - The imported item to check
   * @returns A string indicating the conflict status of the imported item.
   *          Possible values are:
   *          - 'CONFLICTS': The imported item conflicts with an existing item.
   *          - 'MUST EXIST': The imported item is required but does not exist.
   *          - 'NO CONFLICT': The imported item does not conflict with any other item.
   */
  function getConflictStatus(item: ImportedItem) {
    const { conflict, required, newName, type } = item;
    if (conflict && !required) {
      return 'CONFLICTS';
    } else if (conflict && required && !checkIfRequiredItemExists(newName, type)) {
      return 'MUST EXIST';
    } else if (required && !checkIfRequiredItemExists(newName, type)) {
      return 'MUST EXIST';
    } else {
      return 'NO CONFLICT';
    }
  }

  function hasConflict(name: string, type: MainItemTypes, required?: boolean): boolean {
    if (checkIfRequiredItemExists(name, type) && !required) {
      return true;
    } else if (required && !checkIfRequiredItemExists(name, type)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the new name of an imported item and checks for conflicts.
   *
   * @param {number} index - The index of the item in the importedItems array.
   * @param {string} newName - The new name of the item.
   */
  const handleNewNameChange = (index: number, newName: string): void => {
    const updatedItems = [...importedItems];
    updatedItems[index].newName = newName;
    const hasConflict = checkForConflicts(newName, updatedItems[index].type);
    updatedItems[index].conflict = hasConflict;
    setImportedItems(updatedItems);
  };

  /**
   * Updates the locked status of an imported item.
   *
   * @param {number} index - The index of the item in the importedItems array.
   * @param {boolean} locked - The new locked status of the item.
   */
  const handleLockChange = (index: number, locked: boolean) => {
    const updatedItems = [...importedItems];
    updatedItems[index].locked = locked;
    setImportedItems(updatedItems);
  };

  /**
   * Locks all imported items.
   */
  const lockAll = () => {
    const updatedItems = importedItems.map((item) => {
      return { ...item, locked: true };
    });
    setImportedItems(updatedItems);
  };

  /**
   * Unlocks all imported items.
   */
  const unlockAll = () => {
    const updatedItems = importedItems.map((item) => {
      if (!item.required) {
        return { ...item, locked: false };
      } else {
        return item;
      }
    });
    setImportedItems(updatedItems);
  };

  /**
   * Updates all unlocked items to the given action.
   *
   * @param {string} action - The action to update all unlocked items to.
   */
  const updateAllUnlocked = (action: string) => {
    const updatedItems = importedItems.map((item) => {
      if (!item.locked) {
        if (item.type === MainItemTypes.State && importedData.DiagramList.length > 0) {
          return { ...item, action: 'rename' };
        }
        return { 
          ...item,
          action: action,
          conflict: action !== 'rename' ? false : checkForConflicts(item.newName, item.type),
        };
      }
      return item;
    });
    setImportedItems(updatedItems);
  };

  /**
   * Updates the action of an imported item.
   *
   * @param {number} index - The index of the item in the importedItems array.
   * @param {string} action - The new action of the item.
   */
  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...importedItems];
    updatedItems[index].action = action;
    if (action !== 'rename') {
      if (updatedItems[index].type === MainItemTypes.State && importedData.DiagramList.length > 0) {
        updatedItems[index].action = 'rename';
      }
      updatedItems[index].conflict = false;
    } else {
      updatedItems[index].conflict = checkForConflicts(updatedItems[index].newName.replace(findValue, replaceValue), updatedItems[index].type);
    }
    setImportedItems(updatedItems);
  };

  /**
 * Updates the new name and conflict status of each imported item based on the findValue and replaceValue.
 */
  const handleApply = () => {
    const updatedItems = importedItems.map((item) => {
      if (item.newName.includes(findValue) && !item.locked) {
        return {
          ...item,
          newName: item.newName.replace(findValue, replaceValue),
          conflict: checkForConflicts(item.newName.replace(findValue, replaceValue), item.type),
        };
      }
      return item;
    });

    setImportedItems(updatedItems);
  };

    /**
   * If items are being renamed, update the model with the new names.
   * After any names are updated, update the model to include the new items.
   */
  const handleSave = async () => {
    // Go through all of the renamed items and update the pasted model
    let updatedModel: EMRALD_Model = { ...appData.value };
  
    // Rename loop
    for (let i = 0; i < importedItems.length; i++) {
      const item = importedItems[i];
      if (item.action === 'rename') {
        const importedDataCopy = structuredClone(importedData); // Deep copy of importedData so it doesn't get changed
        const itemCopy = structuredClone(item.emraldItem);
        itemCopy.name = item.newName;
        await updateSpecifiedModel(itemCopy, item.type, importedDataCopy, false);
        const updatedItems = convertModelToArray(importedDataCopy);
        item.emraldItem = updatedItems[i].emraldItem;
        item.emraldItem.id = uuidv4();
      }
    }
  
    // Update loop
    for (let i = 0; i < importedItems.length; i++) {
      const item = importedItems[i];
      if (item.action === 'replace') {
        let currentEmraldItem = GetItemByNameType(item.oldName, item.type);
        item.emraldItem.id = currentEmraldItem?.id;
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
        return;
      } else {
        updatedModel = await updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }
    }

    // If from template, add it to the model
    if (fromTemplate) {
      addTemplateToModel(originalTemplate);
    }
  
    // Make it so the lists are refreshed with the new data
    refreshWithNewData(updatedModel);
    handleClose();
  };
  return {
    findValue,
    replaceValue,
    importedItems,
    hasConflicts,
    getConflictStatus,
    setFindValue,
    setReplaceValue,
    lockAll,
    unlockAll,
    updateAllUnlocked,
    handleLockChange,
    handleActionChange,
    handleNewNameChange,
    handleApply,
    handleSave,
    handleClose
  };
};
