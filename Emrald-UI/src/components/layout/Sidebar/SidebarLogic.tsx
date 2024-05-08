import { useState, useCallback, useMemo } from 'react';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { useActionContext } from '../../../contexts/ActionContext';
import { useEventContext } from '../../../contexts/EventContext';
import { useStateContext } from '../../../contexts/StateContext';
import { useVariableContext } from '../../../contexts/VariableContext';
import { useExtSimContext } from '../../../contexts/ExtSimContext';

export function useSidebarLogic() {
  const { diagrams } = useDiagramContext();
  const { logicNodes } = useLogicNodeContext();
  const { actions } = useActionContext();
  const { events } = useEventContext();
  const { states } = useStateContext();
  const { variables } = useVariableContext();
  const { extSims } = useExtSimContext();
  
  const [isDiagramAccordionOpen, setIsDiagramAccordionOpen] = useState(false);
  const [isComponentAccordionOpen, setIsComponentAccordionOpen] = useState(false);

  const [componentGroup, setComponentGroup] = useState('all');

  const diagramPanels = [
    { type: 'Diagrams', data: diagrams },
    { type: 'Logic Tree', data: logicNodes },
    { type: 'External Sims', data: extSims },
  ];

  const stateItems = useMemo(() => {
    if (componentGroup === 'all') {
      return states;
    } else {
      return states // TODO: Add condition for what to show when states are local
    }
  }, [componentGroup, states]);

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
    } else {
      return [];
    }
  }, [componentGroup, actions]);

  const eventItems = useMemo(() => {
    if (componentGroup === 'all') {
      return events;
    } else if (componentGroup === 'global') {
      return events.filter((item) => item.mainItem === true);
    } else {
      return [];
    }
  }, [componentGroup, events]);

  const componentPanels = useMemo(() => {
    if (componentGroup === 'global') {
      return [
        { type: 'Actions', data: actionItems },
        { type: 'Events', data: eventItems },
        { type: 'Variables', data: variableItems },      ];
    }
    else if (componentGroup === 'local') {
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
  }, [componentGroup, actions, events, variables, states]);

  const bothAccordionsOpen = useMemo(() => {
    return isDiagramAccordionOpen && isComponentAccordionOpen;
  }, [isDiagramAccordionOpen, isComponentAccordionOpen]);

  const defaultDrawerWidth = 245;
  const minDrawerWidth = 215;
  const maxDrawerWidth = 1000;

  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp as EventListener, true);
    document.addEventListener(
      'mousemove',
      handleMouseMove as EventListener,
      true,
    );
  };

  const handleMouseUp = () => {
    document.removeEventListener(
      'mouseup',
      handleMouseUp as EventListener,
      true,
    );
    document.removeEventListener(
      'mousemove',
      handleMouseMove as EventListener,
      true,
    );
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

  return {
    setIsDiagramAccordionOpen,
    setIsComponentAccordionOpen,
    componentGroup,
    setComponentGroup,
    bothAccordionsOpen,
    drawerWidth,
    handleMouseDown,
    diagramPanels,
    componentPanels
  };
}
