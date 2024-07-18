import { Edge, Node, MarkerType } from 'reactflow';
import { Action } from '../../../../types/Action';
import { v4 as uuidv4 } from 'uuid';

interface EventAction {
  moveFromCurrent?: boolean;
  actions?: string[];
}

export const showRemainingValues = (action: Action, newState: { toState: string, prob: number }) => {
  const formatProb = (num: number) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf('.');
  
    if (decimalIndex !== -1 && numStr.length - decimalIndex - 1 >= 4) {
      // Convert to scientific notation first, then multiply by 100
      const scientificStr = num.toExponential();
      const [base, exponent] = scientificStr.split('e');
      const [front, decimal] = base.split('.');
      const scientificResult = front + (decimal ? '.' + decimal.substring(0, 3) : '') + 'e' + (Number(exponent) +2);
      return `${scientificResult} %`;
    }
  
    // For numbers with less than 4 decimal places, multiply by 100
    return `${(num * 100).toFixed(3)} %`;
  };
  
  if (action.newStates && action.newStates.length > 1) {  //  .012
    if (newState.prob === -1) {
      return 'Remaining';
    }
    else {
      return formatProb(newState.prob);;
    }
  } else {
    if (newState.prob > 0 && newState.prob !== Number.NEGATIVE_INFINITY) {
      return formatProb(newState.prob);
    }
  }
};

const getEventActionEdges = (
  stateId: string,
  nodes: Node[],
  eventActions: EventAction[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  getActionByActionName: (actionName: string) => Action,
  getNewStatesByActionName: (actionName: string) => { toState: string, prob: number }[],
) => {
  eventActions.forEach((action) => {
    if (action.actions) {
      action.actions.forEach((actionName: string) => {
      const newStates = getNewStatesByActionName(actionName);
      const currentAction = getActionByActionName(actionName);

      newStates.forEach((newState) => {
        const moveToState = nodes.find(
          (node) => node.data.label === newState.toState,
        );

        if (moveToState) {
          setEdges((prevEdges) => [
            ...prevEdges,
            {
              id: uuidv4(),
              source: stateId,
              target: moveToState.id,
              label: showRemainingValues(currentAction, newState),
              targetHandle: 'event-action-target',
              sourceHandle: `${currentAction?.id}`,
              updatable: 'target',
              style: {
                stroke: `${action.moveFromCurrent ? '#b1b1b7' : 'green'}`,
                strokeDasharray: `${action.moveFromCurrent ? '' : 5}`
              },
              markerEnd: { 
                type: MarkerType.ArrowClosed, 
                width: 25, 
                height: 25, 
                color: `${action.moveFromCurrent ? '#b1b1b7' : 'green'}` 
              },
            },
          ]);
        }
      });
      })
      
    }
  });
};

export default getEventActionEdges;
