import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  ConnectionLineType,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  NodeMouseHandler,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { LogicNode } from '../../../types/LogicNode.js';
import useLogicNodeTreeDiagram from './useLogicTreeDiagram.js';
import Box from '@mui/material/Box';
import TreeNodeComponent from './TreeNodeComponent/TreeNodeComponent.js';
import ContextMenu from '../../layout/ContextMenu/ContextMenu.js';
import { TbLogicAnd, TbLogicNot, TbLogicOr } from 'react-icons/tb';
import DraggableItem from '../../drag-and-drop/DraggableItem.js';
import { Alert, Typography } from '@mui/material';
import useExpandCollapse from './useExpandCollapse.js';

interface LogicNodeTreeDiagramProps {
  logicNode: LogicNode;
}

const LogicNodeTreeDiagram: React.FC<LogicNodeTreeDiagramProps> = ({ logicNode }) => {
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
            <Controls />
            {/* <MiniMap /> */}
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
            Node already exists within the current gate
          </Alert>
        </div>
      )}
    </Box>
  );
};

export default LogicNodeTreeDiagram;
