import type {
  Action,
  Diagram,
  EMRALD_Model,
  Event,
  ExtSim,
  LogicNode,
  MainItemType,
  State,
  Variable,
} from '../../../types/EMRALD_Model';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useActionContext } from '../../../contexts/ActionContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useExtSimContext } from '../../../contexts/ExtSimContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { useVariableContext } from '../../../contexts/VariableContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { appData, updateAppData } from '../../../hooks/useAppData';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { GetItemByNameType } from '../../../utils/ModelReferences';
import {
  updateModelAndReferences,
  updateSpecifiedModel,
} from '../../../utils/UpdateModel';
import { EmraldDiagram } from '../../diagrams/EmraldDiagram/EmraldDiagram';

interface ImportedItem {
  type: MainItemType;
  displayType: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  conflict: boolean;
  required: boolean;
  emraldItem: Action | Diagram | LogicNode | ExtSim | Event | State | Variable;
}

export function useImportForm(
  importedData: EMRALD_Model,
  fromTemplate?: boolean,
) {
  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [hasConflicts, setHasConflicts] = useState(true);
  const [loading, setLoading] = useState(false);
  const { diagramList } = useDiagramContext();
  const { logicNodeList } = useLogicNodeContext();
  const { extSimList } = useExtSimContext();
  const { eventsList } = useEventContext();
  const { statesList } = useStateContext();
  const { actionsList } = useActionContext();
  const { variableList } = useVariableContext();
  const { handleClose, addWindow, activeWindowId } = useWindowContext();
  const { addTemplateToModel } = useTemplateContext();
  const { refreshWithNewData } = useAssembledData();
  const originalTemplate = structuredClone(importedData);

  /**
   * Converts an EMRALD_Model object into an array of ImportedItem objects.
   *
   * @param {EMRALD_Model} model - The EMRALD_Model object to convert.
   * @return {ImportedItem[]} An array of ImportedItem objects.
   */
  const convertModelToArray = (model: EMRALD_Model) => {
    const items: ImportedItem[] = [];

    for (const diagram of model.DiagramList) {
      items.push({
        type: 'Diagram',
        displayType: 'Diagram',
        locked: !diagramList.value.some(item => item.name === diagram.name),
        oldName: diagram.name,
        newName: diagram.name,
        action: diagram.required ? 'ignore' : 'rename',
        conflict: hasConflict(diagram.name, 'Diagram', diagram.required),
        required: diagram.required ?? false,
        emraldItem: diagram,
      });
    }

    for (const logicNode of model.LogicNodeList) {
      items.push({
        type: 'LogicNode',
        displayType: 'Logic Node',
        locked: !logicNodeList.value.some(item => item.name === logicNode.name),
        oldName: logicNode.name,
        newName: logicNode.name,
        action: 'rename',
        conflict: hasConflict(logicNode.name, 'LogicNode', logicNode.required),
        required: logicNode.required ?? false,
        emraldItem: logicNode,
      });
    }

    for (const extSim of model.ExtSimList) {
      items.push({
        type: 'ExtSim',
        displayType: 'External Sim',
        locked: !extSimList.value.some(item => item.name === extSim.name),
        oldName: extSim.name,
        newName: extSim.name,
        action: 'rename',
        conflict: hasConflict(extSim.name, 'ExtSim', extSim.required),
        required: extSim.required ?? false,
        emraldItem: extSim,
      });
    }

    for (const action of model.ActionList) {
      items.push({
        type: 'Action',
        displayType: 'Action',
        locked: !actionsList.value.some(item => item.name === action.name),
        oldName: action.name,
        newName: action.name,
        action:
          action.required
          || actionsList.value.some(item => item.name === action.name)
            ? 'ignore'
            : 'rename',
        conflict: hasConflict(action.name, 'Action', action.required),
        required: action.required ?? false,
        emraldItem: action,
      });
    }

    for (const event of model.EventList) {
      items.push({
        type: 'Event',
        displayType: 'Event',
        locked: !eventsList.value.some(item => item.name === event.name),
        oldName: event.name,
        newName: event.name,
        action:
          event.required
          || eventsList.value.some(item => item.name === event.name)
            ? 'ignore'
            : 'rename',
        conflict: hasConflict(event.name, 'Event', event.required),
        required: event.required ?? false,
        emraldItem: event,
      });
    }

    for (const state of model.StateList) {
      items.push({
        type: 'State',
        displayType: 'State',
        locked: !statesList.value.some(item => item.name === state.name),
        oldName: state.name,
        newName: state.name,
        action: state.required ? 'ignore' : 'rename',
        conflict: hasConflict(state.name, 'State', state.required),
        required: state.required ?? false,
        emraldItem: state,
      });
    }

    for (const variable of model.VariableList) {
      items.push({
        type: 'Variable',
        displayType: 'Variable',
        locked: !variableList.value.some(item => item.name === variable.name),
        oldName: variable.name,
        newName: variable.name,
        action: 'rename',
        conflict: hasConflict(variable.name, 'Variable', variable.required),
        required: variable.required ?? false,
        emraldItem: variable,
      });
    }
    return items.toSorted((a, b) => {
      if (a.type === 'Diagram') {
        return -1;
      }
      if (a.type === 'State' && b.type !== 'Diagram') {
        return -1;
      }
      if (a.type === 'Event' && b.type !== 'Diagram' && b.type !== 'State') {
        return -1;
      }
      if (
        a.type === 'Action'
        && b.type !== 'Diagram'
        && b.type !== 'State'
        && b.type !== 'Event'
      ) {
        return -1;
      }
      return 1;
    });
  };

  // set imported items
  useEffect(() => {
    setImportedItems(convertModelToArray(importedData));
  }, [importedData]);

  // set has conflicts
  useEffect(() => {
    const hasConflicts = importedItems.some(
      item =>
        item.action === 'rename'
        && hasConflict(item.newName, item.type, item.required),
    );
    setHasConflicts(hasConflicts);
  }, [importedItems]);

  /**
   * Checks if a name conflict exists for the given type in the respective list.
   *
   * @param {string} newName - The name to check for conflicts.
   * @param {MainItemTypes} type - The type of the item to check for conflicts.
   * @return {boolean} True if a conflict exists, false otherwise.
   */
  const checkForConflicts = (newName: string, type: MainItemType) => {
    switch (type) {
      case 'Diagram': {
        return diagramList.value.some(item => item.name === newName);
      }
      case 'LogicNode': {
        return logicNodeList.value.some(item => item.name === newName);
      }
      case 'ExtSim': {
        return extSimList.value.some(item => item.name === newName);
      }
      case 'Action': {
        return actionsList.value.some(item => item.name === newName);
      }
      case 'Event': {
        return eventsList.value.some(item => item.name === newName);
      }
      case 'State': {
        return statesList.value.some(item => item.name === newName);
      }
      case 'Variable': {
        return variableList.value.some(item => item.name === newName);
      }
      default: {
        return false;
      }
    }
  };

  /**
   * Checks if a required item with the given name and type exists.
   *
   * @param name - The name of the item to check.
   * @param type - The type of the item to check.
   * @returns True if the item exists, false otherwise.
   */
  const checkIfRequiredItemExists = (name: string, type: MainItemType) => {
    switch (type) {
      case 'Diagram': {
        return diagramList.value.some(item => item.name === name);
      }
      case 'LogicNode': {
        return logicNodeList.value.some(item => item.name === name);
      }
      case 'ExtSim': {
        return extSimList.value.some(item => item.name === name);
      }
      case 'Action': {
        return actionsList.value.some(item => item.name === name);
      }
      case 'Event': {
        return eventsList.value.some(item => item.name === name);
      }
      case 'State': {
        return statesList.value.some(item => item.name === name);
      }
      case 'Variable': {
        return variableList.value.some(item => item.name === name);
      }
      default: {
        return false;
      }
    }
  };

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
  const getConflictStatus = useCallback(
    (item: ImportedItem) => {
      const { action, conflict, required, newName, type } = item;
      if (action === 'ignore') {
        return 'NO CONFLICT';
      }
      if (conflict && !required) {
        return 'CONFLICTS';
      } else if (
        conflict
        && required
        && !checkIfRequiredItemExists(newName, type)
      ) {
        return 'MUST EXIST';
      } else if (required && !checkIfRequiredItemExists(newName, type)) {
        return 'MUST EXIST';
      } else {
        return 'NO CONFLICT';
      }
    },
    [importedItems],
  );

  function hasConflict(name: string, type: MainItemType, required?: boolean) {
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
  const handleNewNameChange = (index: number, newName: string) => {
    const updatedItems = [...importedItems];
    if (updatedItems[index]) {
      updatedItems[index].newName = newName;
      const hasConflict = checkForConflicts(newName, updatedItems[index].type);
      updatedItems[index].conflict = hasConflict;
    }
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
    if (updatedItems[index]) {
      updatedItems[index].locked = locked;
      if (!locked) {
        updatedItems[index].action = 'rename';
        updatedItems[index].conflict = hasConflict(
          updatedItems[index].newName,
          updatedItems[index].type,
          updatedItems[index].required,
        );
      }
    }
    setImportedItems(updatedItems);
  };

  /**
   * Locks all imported items.
   */
  const lockAll = () => {
    setImportedItems(importedItems.map(item => ({ ...item, locked: true })));
  };

  /**
   * Unlocks all imported items.
   */
  const unlockAll = () => {
    setImportedItems(
      importedItems.map(item =>
        item.required ? item : { ...item, locked: false, action: 'rename' },
      ),
    );
  };

  /**
   * Updates all unlocked items to the given action.
   *
   * @param action - The action to update all unlocked items to.
   */
  const updateAllUnlocked = (action: string) => {
    setImportedItems(
      importedItems.map(item =>
        item.locked
          ? item
          : item.type === 'State' && importedData.DiagramList.length > 0
            ? { ...item, action: 'rename' }
            : {
                ...item,
                action,
                conflict:
                  action === 'rename'
                    ? checkForConflicts(item.newName, item.type)
                    : false,
              },
      ),
    );
  };

  /**
   * Updates the action of an imported item.
   *
   * @param index - The index of the item in the importedItems array.
   * @param action - The new action of the item.
   */
  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...importedItems];
    if (updatedItems[index]) {
      updatedItems[index].action = action;
      if (action === 'rename') {
        updatedItems[index].conflict = hasConflict(
          updatedItems[index].newName,
          updatedItems[index].type,
          updatedItems[index].required,
        );
      } else {
        if (
          updatedItems[index].type === 'State'
          && importedData.DiagramList.length > 0
        ) {
          updatedItems[index].action = 'rename';
        }
        updatedItems[index].conflict = false;
      }
    }
    setImportedItems(updatedItems);
  };

  /**
   * Updates the new name and conflict status of each imported item based on the findValue and replaceValue.
   */
  const handleApply = () => {
    setImportedItems(
      importedItems.map(item =>
        item.newName.includes(findValue)
        && !item.locked
        && item.action === 'rename'
          ? {
              ...item,
              newName: item.newName.replace(findValue, replaceValue),
              conflict: hasConflict(
                item.newName.replace(findValue, replaceValue),
                item.type,
                item.required,
              ),
            }
          : item,
      ),
    );
  };

  /**
   * If items are being renamed, update the model with the new names.
   * After any names are updated, update the model to include the new items.
   */
  const handleSave = () => {
    setLoading(true);
    // Go through all of the renamed items and update the pasted model
    let updatedModel: EMRALD_Model = { ...appData.value };
    const importedDataCopy = structuredClone(importedData); // Deep copy of importedData so it doesn't get changed

    // Rename loop
    for (const item of importedItems) {
      if (item.action === 'rename') {
        const itemCopy = structuredClone(
          GetItemByNameType(item.oldName, item.type, importedDataCopy),
        ); // get the item from the importedDataCopy as it may be changed on other items being updated
        if (itemCopy) {
          itemCopy.name = item.newName;
          updateSpecifiedModel(itemCopy, item.type, importedDataCopy, false);
          itemCopy.id = uuidv4();
          item.emraldItem = itemCopy;
        }
        updatedModel = updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }
    }

    // Update loop
    for (const item of importedItems) {
      if (item.action === 'replace') {
        const currentEmraldItem = GetItemByNameType(item.oldName, item.type);
        item.emraldItem.id = currentEmraldItem?.id;
        updatedModel = updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
        return;
      } else if (item.action !== 'ignore') {
        updatedModel = updateModelAndReferences(item.emraldItem, item.type);
        updateAppData(updatedModel);
      }
    }

    // If from template, add it to the model
    if (fromTemplate) {
      addTemplateToModel(originalTemplate);
    }

    // Make it so the lists are refreshed with the new data
    refreshWithNewData(updatedModel);
    setLoading(false);
    if (activeWindowId) {
      const importedDiagrams = importedItems.filter(
        v => v.type === 'Diagram' && v.action !== 'ignore',
      );
      if (importedDiagrams.length === 0) {
        handleClose(activeWindowId);
      } else {
        addWindow(
          importedDataCopy.DiagramList[0]?.name ?? '',
          <EmraldDiagram diagram={importedDataCopy.DiagramList[0]} />,
          {
            x: 75,
            y: 25,
            width: 1300,
            height: 700,
          },
          null,
          activeWindowId,
        );
      }
    }
  };

  return {
    findValue,
    replaceValue,
    importedItems,
    hasConflicts,
    loading,
    getConflictStatus,
    setFindValue,
    setReplaceValue,
    setLoading,
    lockAll,
    unlockAll,
    updateAllUnlocked,
    handleLockChange,
    handleActionChange,
    handleNewNameChange,
    handleApply,
    handleSave,
    handleClose,
  };
}
