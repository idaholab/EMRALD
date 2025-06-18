import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useVariableContext } from '../../../contexts/VariableContext';
import { useExtSimContext } from '../../../contexts/ExtSimContext';
import { currentDiagram } from '../../diagrams/EmraldDiagram/EmraldDiagram';
import { GetModelItemsReferencedBy } from '../../../utils/ModelReferences';
import { Diagram, State, Action, Event, LogicNode, MainItemType } from '../../../types/EMRALD_Model';
import { useWindowContext } from '../../../contexts/WindowContext';
import useLogicNodeTreeDiagram from '../../diagrams/LogicTreeDiagram/useLogicTreeDiagram';
import { useAlertContext } from '../../../contexts/AlertContext';

export function useSidebarLogic() {
  const { diagrams, getDiagramByDiagramName } = useDiagramContext();
  const { logicNodes } = useLogicNodeContext();
  const { actions } = useActionContext();
  const { events } = useEventContext();
  const { states } = useStateContext();
  const { variables } = useVariableContext();
  const { extSims } = useExtSimContext();

  const [isDiagramAccordionOpen, setIsDiagramAccordionOpen] = useState(false);
  const [isComponentAccordionOpen, setIsComponentAccordionOpen] = useState(false);
  const [componentGroup, setComponentGroup] = useState('all');
  const [currDiagram, setCurrDiagram] = useState<Diagram>(currentDiagram.value);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Event | State | Action | Diagram | undefined>();
  const [itemToDeleteType, setItemToDeleteType] = useState<MainItemType>();
  const { deleteState } = useStateContext();
  const { deleteDiagram, updateDiagram } = useDiagramContext();
  const { deleteLogicNode } = useLogicNodeContext();
  const { deleteExtSim } = useExtSimContext();
  const { deleteAction } = useActionContext();
  const { deleteEvent } = useEventContext();
  const { deleteVariable } = useVariableContext();
  const { closeAllWindows } = useWindowContext();
  const { recurseAndDeleteChildren } = useLogicNodeTreeDiagram();
  const { activeWindowId, getWindowTitleById } = useWindowContext();
  const { showAlert } = useAlertContext();

  const onDiagramChange = (newDiagram: Diagram) => {
    // Update currDiagram state
    setCurrDiagram(newDiagram);
  };

  // Set the current diagram to the one corresponding to the active window
  useEffect(() => {
    // Get the title of the active window
    const activeWindowTitle = getWindowTitleById(activeWindowId) || '';

    // Set the current diagram to the one corresponding to the active window title
    setCurrDiagram(getDiagramByDiagramName(activeWindowTitle));
  }, [activeWindowId]);

  const diagramPanels = [
    { type: 'Diagrams', data: diagrams },
    { type: 'Logic Tree', data: logicNodes },
    { type: 'External Sims', data: extSims },
  ];

  const stateItems = useMemo(() => {
    if (componentGroup === 'all') {
      return states;
    } else if (componentGroup === 'local') {
      try {
        const copyModel = GetModelItemsReferencedBy(currDiagram.name, 'Diagram', 1);
        return copyModel.StateList;
      } catch(error) {
        console.error("Error Message:", error);
        showAlert('Unable to get referenced StateList items', 'error');
      }
    } else {
      return states; // TODO: Add condition for what to show when states are local
    }
  }, [componentGroup, states, currDiagram]);

  const variableItems = useMemo(() => {
    if (componentGroup === 'all') {
      return variables;
    } else {
      return variables;
    }
  }, [componentGroup, variables]);

  const actionItems = useMemo(() => {
    if (componentGroup === 'all') {
      return actions;
    } else if (componentGroup === 'global') {
      return actions.filter((item) => item.mainItem === true);
    } else if (componentGroup === 'local') {
      try {
        const copyModel = GetModelItemsReferencedBy(currDiagram.name, 'Diagram', 2);
        return copyModel.ActionList;
      } catch(error) {
        console.error("Error Message:", error);
        showAlert('Unable to get referenced ActionList items', 'error');
      }
    } else {
      return [];
    }
  }, [componentGroup, actions, currDiagram]);

  const eventItems = useMemo(() => {
    if (componentGroup === 'all') {
      return events;
    } else if (componentGroup === 'global') {
      return events.filter((item) => item.mainItem === true);
    } else if (componentGroup === 'local') {
      try {
        const copyModel = GetModelItemsReferencedBy(currDiagram.name, 'Diagram', 2);
        return copyModel.EventList;
      } catch(error) {
        console.error("Error Message:", error);
        showAlert('Unable to get referenced EventList items', 'error');
      }
    } else {
      return [];
    }
  }, [componentGroup, events, currDiagram]);

  const componentPanels = useMemo(() => {
    if (componentGroup === 'global') {
      return [
        { type: 'Actions', data: actionItems },
        { type: 'Events', data: eventItems },
        { type: 'Variables', data: variableItems },
      ];
    } else if (componentGroup === 'local') {
      return [
        { type: 'Actions', data: actionItems },
        { type: 'Events', data: eventItems },
        { type: 'States', data: stateItems },
      ];
    }
    return [
      { type: 'Actions', data: actionItems },
      { type: 'Events', data: eventItems },
      { type: 'States', data: stateItems },
      { type: 'Variables', data: variableItems },
    ];
  }, [componentGroup, actionItems, eventItems, variables, stateItems]);

  const bothAccordionsOpen = useMemo(() => {
    return isDiagramAccordionOpen && isComponentAccordionOpen;
  }, [isDiagramAccordionOpen, isComponentAccordionOpen]);

  const defaultDrawerWidth = 245;
  const minDrawerWidth = 215;
  const maxDrawerWidth = 1000;

  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp as EventListener, true);
    document.addEventListener('mousemove', handleMouseMove as EventListener, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp as EventListener, true);
    document.removeEventListener('mousemove', handleMouseMove as EventListener, true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWidth = e.clientX - document.body.offsetLeft;
      if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
        setDrawerWidth(newWidth);
      }
    },
    [minDrawerWidth, maxDrawerWidth],
  );
  const closeDeleteConfirmation = () => {
    // * Closes the confirmation dialog and resets the state items
    setDeleteConfirmation(false);
    setItemToDelete(undefined);
  };
  const deleteItem = async () => {
    if (!itemToDelete) return;
    if (itemToDeleteType === 'Diagram') {
      deleteDiagram(itemToDelete.id);
      closeDeleteConfirmation();
    }
    if (itemToDeleteType === 'LogicNode') {
      let nodeToDelete = itemToDelete as unknown as LogicNode;
      await recurseAndDeleteChildren(nodeToDelete);
      deleteLogicNode(nodeToDelete.id);
    }
    if (itemToDeleteType === 'ExtSim') {
      deleteExtSim(itemToDelete.id);
    }
    if (itemToDeleteType === 'Action') {
      deleteAction(itemToDelete.id);
    }
    if (itemToDeleteType === 'Event') {
      deleteEvent(itemToDelete.id);
    }
    if (itemToDeleteType === 'State') {
      //not sure why the next 4 lines are needed, but if not then the diagram containin ght state has a ghost state left in it when you open it
      let diagram = getDiagramByDiagramName((itemToDelete as State).diagramName);
      const updatedStates = diagram.states.filter((stateName) => stateName !== itemToDelete.name);
      diagram.states = updatedStates;
      await updateDiagram(diagram);
      deleteState(itemToDelete.id);
    }
    if (itemToDeleteType === 'Variable') {
      deleteVariable(itemToDelete.id);
    }
    setDeleteConfirmation(false);
    closeAllWindows();
  };

  const handleDelete = (itemToDelete: any, itemType: MainItemType) => {
    setDeleteConfirmation(true);
    setItemToDelete(itemToDelete);
    setItemToDeleteType(itemType);
  };

  return {
    componentGroup,
    bothAccordionsOpen,
    drawerWidth,
    diagramPanels,
    componentPanels,
    deleteConfirmation,
    itemToDelete,
    setDeleteConfirmation,
    setItemToDelete,
    closeDeleteConfirmation,
    deleteItem,
    handleDelete,
    setIsDiagramAccordionOpen,
    setIsComponentAccordionOpen,
    setComponentGroup,
    handleMouseDown,
    onDiagramChange,
  };
}
