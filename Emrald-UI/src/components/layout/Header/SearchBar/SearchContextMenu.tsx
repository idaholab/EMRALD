import { Menu, MenuItem } from '@mui/material';
import { Children, cloneElement, JSX, useState } from 'react';
import { ModelItem } from '../../../../types/ModelUtils';
import {
  Action,
  Diagram,
  LogicNode,
  MainItemType,
  State,
  Event,
  ExtSim,
  Variable,
} from '../../../../types/EMRALD_Model';
import EmraldDiagram from '../../../diagrams/EmraldDiagram/EmraldDiagram';
import { useDiagramContext } from '../../../../contexts/DiagramContext';
import { GetModelItemsReferencing } from '../../../../utils/ModelReferences';
import { emptyLogicNode } from '../../../../contexts/LogicNodeContext';
import { ReactFlowProvider } from 'reactflow';
import LogicNodeTreeDiagram from '../../../diagrams/LogicTreeDiagram/LogicTreeDiagram';
import { useWindowContext } from '../../../../contexts/WindowContext';
import DiagramForm from '../../../forms/DiagramForm/DiagramForm';
import StateForm from '../../../forms/StateForm/StateForm';
import ActionFormContextProvider from '../../../forms/ActionForm/ActionFormContext';
import ActionForm from '../../../forms/ActionForm/ActionForm';
import EventFormContextProvider from '../../../forms/EventForm/EventFormContext';
import EventForm from '../../../forms/EventForm/EventForm';
import ExtSimForm from '../../../forms/ExtSimForm/ExtSimForm';
import LogicNodeFormContextProvider from '../../../forms/LogicNodeForm/LogicNodeFormContext';
import LogicNodeForm from '../../../forms/LogicNodeForm/LogicNodeForm';
import VariableFormContextProvider from '../../../forms/VariableForm/VariableFormContext';
import VariableForm from '../../../forms/VariableForm/VariableForm';

type SearchContextMenuProps = {
  targetItem: ModelItem | null;
};

export const SearchContextMenu: React.FC<React.PropsWithChildren<SearchContextMenuProps>> = ({
  targetItem,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const { getDiagramByDiagramName } = useDiagramContext();
  const { addWindow } = useWindowContext();

  const findParentNode = (logicNode: LogicNode): LogicNode => {
    const tempModel = GetModelItemsReferencing(logicNode.name, 'LogicNode', 1);
    const nodes = tempModel.LogicNodeList;
    if (nodes.length === 0) return emptyLogicNode;
    for (const node of nodes) {
      if (node.isRoot) {
        return node;
      } else {
        return findParentNode(node);
      }
    }
    return emptyLogicNode;
  };

  return (
    <>
      {Children.map(children, (child, i) => {
        if (i === 0) {
          return cloneElement(child, {
            onContextMenu: (ev) => {
              ev.preventDefault();
              setAnchorEl(ev.currentTarget);
              setContextMenuOpen(true);
            },
          });
        }
        return child;
      })}
      <Menu anchorEl={anchorEl} open={contextMenuOpen} onClose={() => setContextMenuOpen(false)}>
        <MenuItem
          onClick={() => {
            const componentMap: Record<MainItemType, (data: ModelItem) => JSX.Element> = {
              Diagram: (data) => <DiagramForm diagramData={data as Diagram} />,
              State: (data) => <StateForm stateData={data as State} />,
              Action: (data) => (
                <ActionFormContextProvider>
                  <ActionForm actionData={data as Action} />
                </ActionFormContextProvider>
              ),
              Event: (data) => (
                <EventFormContextProvider>
                  <EventForm eventData={data as Event} />
                </EventFormContextProvider>
              ),
              ExtSim: (data) => <ExtSimForm ExtSimData={data as ExtSim} />,
              LogicNode: (data) => (
                <LogicNodeFormContextProvider>
                  <LogicNodeForm logicNodeData={data as LogicNode} editing />
                </LogicNodeFormContextProvider>
              ),
              Variable: (data) => (
                <VariableFormContextProvider>
                  <VariableForm variableData={data as Variable} />
                </VariableFormContextProvider>
              ),
              EMRALD_Model: () => <></>,
            };

            if (targetItem?.objType) {
              addWindow(`Edit ${targetItem.name}`, componentMap[targetItem.objType](targetItem));
            }

            setContextMenuOpen(false);
            setAnchorEl(null);
          }}
        >
          Edit Properties
        </MenuItem>
        {(targetItem?.objType === 'Diagram' ||
          targetItem?.objType === 'State' ||
          targetItem?.objType === 'LogicNode') && (
          <MenuItem
            onClick={() => {
              let name = targetItem?.name ?? '';
              const componentMap: Record<
                Extract<MainItemType, 'LogicNode' | 'Diagram' | 'State'>,
                (data: Diagram | State | LogicNode) => JSX.Element
              > = {
                Diagram: (data): JSX.Element => <EmraldDiagram diagram={data as Diagram} />,
                State: (data) => {
                  const d = data as State;
                  const stateDiagram = getDiagramByDiagramName(d.diagramName);
                  name = stateDiagram?.name ?? '';
                  return <EmraldDiagram diagram={stateDiagram!} />;
                },
                LogicNode: (data) => {
                  const logicNode = data as LogicNode;
                  let parentNode = logicNode;
                  if (!logicNode.isRoot) {
                    parentNode = findParentNode(logicNode);
                    name = parentNode.name;
                  }
                  return (
                    <ReactFlowProvider>
                      <LogicNodeTreeDiagram logicNode={parentNode} />
                    </ReactFlowProvider>
                  );
                },
              };

              if (targetItem?.objType) {
                const component = componentMap[
                  targetItem.objType as 'Diagram' | 'State' | 'LogicNode'
                ](targetItem as Diagram | State | LogicNode);

                addWindow(name, component, {
                  x: 75,
                  y: 25,
                  width: 1300,
                  height: 700,
                });
              }
              setContextMenuOpen(false);
              setAnchorEl(null);
            }}
          >
            View: {targetItem?.name}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
