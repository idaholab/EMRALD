import type { LogicNode } from '../../../types/EMRALD_Model';
import { Alert, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PiDotsNine } from 'react-icons/pi';
import { TbLogicAnd, TbLogicNot, TbLogicOr, TbMap } from 'react-icons/tb';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ControlButton,
  Controls,
  MiniMap,
  type NodeMouseHandler,
  Panel,
  useReactFlow,
} from 'reactflow';
import { DraggableItem } from '../../drag-and-drop/DraggableItem';
import { ContextMenu } from '../../layout/ContextMenu/ContextMenu';
import { DownloadButton } from '../DownloadButton';
import { TreeNodeComponent } from './TreeNodeComponent/TreeNodeComponent';
import { useExpandCollapse } from './useExpandCollapse';
import { useLogicNodeTreeDiagram } from './useLogicTreeDiagram';
import 'reactflow/dist/style.css';

interface LogicNodeTreeDiagramProps {
  logicNode: LogicNode;
}

export const LogicNodeTreeDiagram: React.FC<LogicNodeTreeDiagramProps> = ({
  logicNode,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showBackgroundDots, setShowBackgroundDots] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const {
    nodes,
    edges,
    loading,
    menu,
    menuOptions,
    nodeExistsAlert,
    setNodeExistsAlert,
    onNodeContextMenu,
    closeContextMenu,
    buildLogicTree,
    onNodesChange,
    onEdgesChange,
    handleLoad,
    setNodes,
  } = useLogicNodeTreeDiagram();

  const treeWidth = 180;
  const treeHeight = 140;

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(
    nodes,
    edges,
    {
      treeWidth,
      treeHeight,
    },
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes(nds =>
        nds.map(n =>
          n.id === node.id
            ? {
                ...n,
                data: { ...n.data, expanded: !n.data.expanded },
              }
            : n,
        ),
      );

      // Fit view after node click
      reactFlowInstance.fitView({ nodes, padding: 0.75 });
    },
    [setNodes, reactFlowInstance, visibleNodes],
  );

  useEffect(() => {
    buildLogicTree(logicNode);
  }, [logicNode]);

  const nodeTypes = useMemo(() => ({ custom: TreeNodeComponent }), []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="tree-diagram"
          ref={ref}
          style={{ width: '100%', height: '100%' }}
        >
          <ReactFlow
            nodes={visibleNodes}
            edges={visibleEdges}
            onNodesChange={onNodesChange}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            onInit={handleLoad}
            nodesDraggable={false}
            nodesConnectable={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          >
            <Panel position="top-left">
              <Box sx={{ background: '#fff', p: 1 }}>
                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                  Drag and Drop Gates
                </Typography>
                <Box sx={{ display: 'flex', padding: '10px' }}>
                  <DraggableItem
                    itemType="Gate"
                    itemData={{ objType: 'Gate', gateType: 'gtAnd' }}
                  >
                    <TbLogicAnd className="gate-icon" />
                  </DraggableItem>
                  <DraggableItem
                    itemType="Gate"
                    itemData={{ objType: 'Gate', gateType: 'gtOr' }}
                  >
                    <TbLogicOr className="gate-icon" />
                  </DraggableItem>
                  <DraggableItem
                    itemType="Gate"
                    itemData={{ objType: 'Gate', gateType: 'gtNot' }}
                  >
                    <TbLogicNot className="gate-icon" />
                  </DraggableItem>
                </Box>
              </Box>
            </Panel>
            <Controls>
              <ControlButton
                onClick={() => {
                  setShowMap(!showMap);
                }}
              >
                <TbMap />
              </ControlButton>
              <ControlButton
                onClick={() => {
                  setShowBackgroundDots(!showBackgroundDots);
                }}
              >
                <PiDotsNine />
              </ControlButton>
              <DownloadButton diagramName={logicNode.name} />
            </Controls>
            {showMap && <MiniMap pannable />}
            {showBackgroundDots && (
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            )}
          </ReactFlow>
          {menu && (
            <ContextMenu
              mouseX={menu.mouseX}
              mouseY={menu.mouseY}
              handleClose={closeContextMenu}
              options={menuOptions}
            />
          )}
          <Alert
            severity="warning"
            sx={{
              position: 'absolute',
              top: '35px',
              right: 0,
              zIndex: 9999,
              opacity: nodeExistsAlert ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
            }}
            onClose={() => {
              setNodeExistsAlert(false);
            }}
          >
            Pasting this node will create a circular reference. Please review
            the node structure.
          </Alert>
        </div>
      )}
    </Box>
  );
};
