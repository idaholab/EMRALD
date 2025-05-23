import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  ConnectionLineType,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  NodeMouseHandler,
  useReactFlow,
  ControlButton,
  MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { LogicNode } from '../../../types/EMRALD_Model';
import useLogicNodeTreeDiagram from './useLogicTreeDiagram';
import Box from '@mui/material/Box';
import TreeNodeComponent from './TreeNodeComponent/TreeNodeComponent';
import ContextMenu from '../../layout/ContextMenu/ContextMenu';
import { TbLogicAnd, TbLogicNot, TbLogicOr, TbMap } from 'react-icons/tb';
import DraggableItem from '../../drag-and-drop/DraggableItem';
import { Alert, Typography } from '@mui/material';
import useExpandCollapse from './useExpandCollapse';
import DownloadButton from '../DownloadButton';
import { PiDotsNine } from 'react-icons/pi';

interface LogicNodeTreeDiagramProps {
  logicNode: LogicNode;
}

const LogicNodeTreeDiagram: React.FC<LogicNodeTreeDiagramProps> = ({ logicNode }) => {
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

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodes, edges, {
    treeWidth,
    treeHeight,
  });

  const onNodeClick: NodeMouseHandler = useCallback(
    async (_, node) => {
      await new Promise((resolve) => {
        setNodes((nds) => {
          const updatedNodes = nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: { ...n.data, expanded: !n.data.expanded },
              };
            }
            return n;
          });
          resolve(updatedNodes); // Resolve the promise after updating nodes
          return updatedNodes;
        });
      });

      // Fit view after node click
      reactFlowInstance && reactFlowInstance.fitView({ nodes: nodes, padding: 0.75 });
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
        <div className="tree-diagram" ref={ref} style={{ width: '100%', height: '100%' }}>
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
                  <DraggableItem itemType="Gate" itemData={{ gateType: 'gtAnd' }}>
                    <TbLogicAnd className="gate-icon" />
                  </DraggableItem>
                  <DraggableItem itemType="Gate" itemData={{ gateType: 'gtOr' }}>
                    <TbLogicOr className="gate-icon" />
                  </DraggableItem>
                  <DraggableItem itemType="Gate" itemData={{ gateType: 'gtNot' }}>
                    <TbLogicNot className="gate-icon" />
                  </DraggableItem>
                </Box>
              </Box>
            </Panel>
            <Controls>
              <ControlButton onClick={() => setShowMap(!showMap)}>
                <TbMap />
              </ControlButton>
              <ControlButton onClick={() => setShowBackgroundDots(!showBackgroundDots)}>
                <PiDotsNine />
              </ControlButton>
              <DownloadButton diagramName={logicNode.name}/>
            </Controls>
            {showMap && <MiniMap pannable />}
            {showBackgroundDots && <Background variant={BackgroundVariant.Dots} gap={12} size={1} />}
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
            onClose={() => setNodeExistsAlert(false)}
          >
            Pasting this node will create a circular reference. Please review the node structure.
          </Alert>
        </div>
      )}
    </Box>
  );
};

export default LogicNodeTreeDiagram;
