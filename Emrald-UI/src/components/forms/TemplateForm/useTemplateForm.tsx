import { useState, useEffect } from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import { useWindowContext } from '../../../contexts/WindowContext';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';
import { State } from '../../../types/State';
import { Diagram } from '../../../types/Diagram';
import { Group, MainItemTypes } from '../../../types/ItemTypes';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';
import { ExtSim } from '../../../types/ExtSim';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { updateSpecifiedModel } from '../../../utils/UpdateModel';

interface TemplatedItem {
  type: MainItemTypes;
  displayType: string;
  locked: boolean;
  oldName: string;
  action: string;
  newName: string;
  exclude: boolean;
  required: boolean;
  emraldItem: Action | Diagram | LogicNode | ExtSim | Event | State | Variable;
}

export const useTemplateForm = (templatedData: EMRALD_Model) => {
  const {groups, temporaryTemplates, createTemplate, findGroupHierarchyByGroupName} = useTemplateContext();
  const [findValue, setFindValue] = useState<string>('');
  const [replaceValue, setReplaceValue] = useState<string>('');
  const [templatedItems, setTemplatedItems] = useState<TemplatedItem[]>([]);
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDesc, setTemplateDesc] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showGroupDialog, setShowGroupDialog] = useState<boolean>(false);
  const [groupType, setGroupType] = useState<string>('');
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [currentGroup, setCurrentGroup] = useState<Group>();
  const [duplicateNameError, setDuplicateNameError] = useState<boolean>(false);
  const [groupList, setGroupList] = useState<Group[]>(groups ? groups : []);
  const { handleClose } = useWindowContext();
  const [expanded, setExpanded] = useState(['Group 1']);
  const [diagramStates, setDiagramStates] = useState<string[]>(templatedData.DiagramList[0].states);

  useEffect(() => {
    setTemplatedItems(convertModelToArray(templatedData));
  }, [templatedData]);

  /** Build out the templated items array **/
  const convertModelToArray = (model: EMRALD_Model): TemplatedItem[] => {
    const items: TemplatedItem[] = [];
    for (const diagram of model.DiagramList) {
      items.push({
        type: MainItemTypes.Diagram,
        displayType: 'Diagram',
        locked: true,
        oldName: diagram.name,
        newName: diagram.name,
        action: 'keep',
        exclude: false,
        required: false,
        emraldItem: diagram,
      });
      setDiagramStates(diagram.states);
    }
    for (const logicNode of model.LogicNodeList) {
      items.push({
        type: MainItemTypes.LogicNode,
        displayType: 'Logic Node',
        locked: false,
        oldName: logicNode.name,
        newName: logicNode.name,
        action: 'keep',
        exclude: false,
        required: false,
        emraldItem: logicNode,
      });
    }
    for (const extSim of model.ExtSimList) {
      items.push({
        type: MainItemTypes.ExtSim,
        displayType: 'External Sim',
        locked: false,
        oldName: extSim.name,
        newName: extSim.name,
        action: 'keep',
        exclude: false,
        required: false,
        emraldItem: extSim,
      });
    }
    for (const action of model.ActionList) {
      items.push({
        type: MainItemTypes.Action,
        displayType: 'Action',
        locked: false,
        oldName: action.name,
        newName: action.name,
        action: 'keep',
        exclude: false,
        required: false,
        emraldItem: action,
      });
    }
    for (const event of model.EventList) {
      items.push({
        type: MainItemTypes.Event,
        displayType: 'Event',
        locked: false,
        oldName: event.name,
        newName: event.name,
        action: 'keep',
        exclude: false,
        required: false,
        emraldItem: event,
      });
    }
    for (const state of model.StateList) {
      items.push({
        type: MainItemTypes.State,
        displayType: 'State',
        locked: true,
        oldName: state.name,
        newName: state.name,
        action: 'keep',
        exclude: !checkIfDiagramDirectState(state.name),
        required: false,
        emraldItem: state,
      });
    }
    for (const variable of model.VariableList) {
      items.push({
        type: MainItemTypes.Variable,
        displayType: 'Variable',
        locked: false,
        oldName: variable.name,
        newName: variable.name,
        action: 'keep',
        exclude: false,
        required: false,
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

  const checkIfDiagramDirectState = (stateName: string) => {
    return diagramStates.includes(stateName);
  }

  const addNewGroup = () => {
    setGroupList((prevGroups) => {
      const newGroup: Group = {
        name: newGroupName,
        subgroup: [],
      };
      if (currentGroup && currentGroup.subgroup) {
        currentGroup.subgroup.push(newGroup);
        toggleExpand(currentGroup.name);
      } else {
        prevGroups.push(newGroup);
      }
      const updatedGroups = [...prevGroups];
      localStorage.setItem('templateGroups', JSON.stringify(updatedGroups));
      return [...prevGroups];
    });
    setCurrentGroup(undefined);
    setNewGroupName('');
    setShowGroupDialog(false);
  };

  const deleteGroup = () => {
    setGroupList((prevGroups) => {
      const updatedGroups = prevGroups
        .map((group) => deleteItem(group, currentGroup?.name || ''))
        .filter((group): group is Group => group !== null);
      localStorage.setItem('templateGroups', JSON.stringify(updatedGroups));
      return updatedGroups;
    });
    setCurrentGroup(undefined);
    setShowGroupDialog(false);
  };

  const deleteItem = (item: Group, name: string): Group | null => {
    if (item.name === name) {
      return null; // Return null to indicate this item should be deleted
    } else if (item.subgroup) {
      const newChildren = item.subgroup
        .map((child) => deleteItem(child, name))
        .filter((child): child is Group => child !== null); // Type guard to filter out null values
      return {
        ...item,
        subgroup: newChildren,
      };
    } else {
      return item;
    }
  };

  // Function to check for duplicate name
  const checkDuplicateName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && groupList.some((group) => group.name.trim() === trimmedName)) {
      setDuplicateNameError(true);
      return true;
    } else {
      setDuplicateNameError(false);
      return false;
    }
  };

  const handleNewGroupNameChange = (name: string) => {
    setNewGroupName(name);
    checkDuplicateName(name);
  }

  const handleShowGroupDialog = (type: string) => {
    setGroupType(type);
    if (type === 'main') {
      setCurrentGroup(undefined);
    }
    if (type === 'main' || type === 'sub') {
      setShowGroupDialog(true);
    }
    if (type === 'delete' && currentGroup) {
      if (currentGroup.subgroup && currentGroup.subgroup.length > 0) {
        setShowGroupDialog(true);
      } else {
        deleteGroup();
      }
    }
    handleMenuClose();
  };

  const toggleExpand = (id: string) => {
    setExpanded((prevExpanded) => {
      const isExpanded = prevExpanded.includes(id);
      if (isExpanded) {
        return prevExpanded.filter((item) => item !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: Group) => {
    event.preventDefault();
    setCurrentGroup(group);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /** Manage items in templated items array **/
  const handleNewNameChange = (index: number, newName: string) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].newName = newName;
    setTemplatedItems(updatedItems);
  };

  const handleLockChange = (index: number, locked: boolean) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].locked = locked;
    setTemplatedItems(updatedItems);
  };

  const lockAll = () => {
    const updatedItems = templatedItems.map((item) => ({ ...item, locked: true }));
    setTemplatedItems(updatedItems);
  };

  const unlockAll = () => {
    const updatedItems = templatedItems.map((item) => ({ ...item, locked: false }));
    setTemplatedItems(updatedItems);
  };

  const updateAllUnlocked = (action: string) => {
    const updatedItems = templatedItems.map((item) => {
      if (!item.locked) {
        if (item.type === MainItemTypes.State && templatedData.DiagramList.length > 0) {
          return { ...item, action: 'rename' };
        }
        return { ...item, action: action };
      }
      return item;
    });
    setTemplatedItems(updatedItems);
  };

  const handleActionChange = (index: number, action: string) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].action = action;
    setTemplatedItems(updatedItems);
  };

  const handleExcludeChange = (index: number, exclude: boolean) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].exclude = exclude;
    setTemplatedItems(updatedItems);
  };

  const handleRequiredChange = (index: number, required: boolean) => {
    const updatedItems = [...templatedItems];
    updatedItems[index].required = required;
    if ('required' in updatedItems[index].emraldItem) {
      (updatedItems[index].emraldItem as Action | Diagram | LogicNode | ExtSim | Event | State | Variable).required = required;
    }
    setTemplatedItems(updatedItems);
  };
  
  const handleApply = () => {
    setTemplatedItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.newName.includes(findValue) && !item.locked) {
          const newName = item.newName.replace(new RegExp(findValue, 'g'), replaceValue);
          return {
            ...item,
            newName: newName,
          };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const removeExcludedItems = () => {
    return new Promise<void>((resolve) => {
      templatedData.DiagramList = templatedData.DiagramList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.Diagram && ti.exclude && d.name === ti.newName));
      templatedData.LogicNodeList = templatedData.LogicNodeList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.LogicNode && ti.exclude && d.name === ti.newName));
      templatedData.ActionList = templatedData.ActionList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.Action && ti.exclude && d.name === ti.newName));
      templatedData.ExtSimList = templatedData.ExtSimList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.ExtSim && ti.exclude && d.name === ti.newName));
      templatedData.EventList = templatedData.EventList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.Event && ti.exclude && d.name === ti.newName));
      templatedData.StateList = templatedData.StateList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.State && ti.exclude && d.name === ti.newName));
      templatedData.VariableList = templatedData.VariableList.filter((d) => !templatedItems.find((ti) => ti.type === MainItemTypes.Variable && ti.exclude && d.name === ti.newName));

      resolve();
    })
  }

  const handleSave = async () => {
    templatedData.id = uuidv4();
    templatedData.name = templateName;
    templatedData.desc = templateDesc;
    templatedData.group = findGroupHierarchyByGroupName(groups, selectedGroup);
    await removeExcludedItems(); // Remove excluded items before building the template

    // Go through all of the renamed items and update the pasted model
    for (let i = 0; i < templatedItems.length; i++) {
      const item = templatedItems[i];
      if (!item.exclude) {
        const itemCopy = structuredClone(item.emraldItem);
        if (item.action === 'rename') {
          itemCopy.name = item.newName;
        }
        await updateSpecifiedModel(itemCopy, item.type, templatedData, false);
        const updatedItems = convertModelToArray(templatedData);
        if (updatedItems[i]?.emraldItem) {          
          item.emraldItem = updatedItems[i].emraldItem;
          item.emraldItem.id = uuidv4();
        }
      }
    }
  
    // Proceed with creating the template and closing the window
    createTemplate(templatedData);
    handleClose();
  };
  return {
    findValue,
    replaceValue,
    templatedItems,
    templateName,
    templateDesc,
    selectedGroup,
    anchorEl,
    showGroupDialog,
    groupType,
    newGroupName,
    currentGroup,
    groupList,
    temporaryTemplates,
    expanded,
    duplicateNameError,
    checkIfDiagramDirectState,
    setFindValue,
    setReplaceValue,
    setTemplatedItems,
    setTemplateName,
    setTemplateDesc,
    setSelectedGroup,
    setAnchorEl,
    setShowGroupDialog,
    setGroupType,
    setNewGroupName,
    setCurrentGroup,
    setExpanded,
    handleShowGroupDialog,
    handleMenuClose,
    handleContextMenu,
    handleNewNameChange,
    handleLockChange,
    lockAll,
    unlockAll,
    updateAllUnlocked,
    handleActionChange,
    handleExcludeChange,
    handleRequiredChange,
    handleClose,
    handleApply,
    handleSave,
    addNewGroup,
    deleteGroup,
    deleteItem,
    toggleExpand,
    handleNewGroupNameChange,
    checkDuplicateName
  };
};
