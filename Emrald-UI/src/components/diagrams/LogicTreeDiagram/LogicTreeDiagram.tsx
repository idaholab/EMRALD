import React, { useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  ConnectionLineType,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Panel,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { LogicNode } from '../../../types/LogicNode.js';
import useLogicNodeTreeDiagram from './useLogicTreeDiagram.js';
import Box from '@mui/material/Box';
import TreeNodeComponent from './TreeNodeComponent/TreeNodeComponent.js';
import ContextMenu from '../../layout/ContextMenu/ContextMenu.js';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext.js';
import { TbLogicAnd, TbLogicNot, TbLogicOr } from 'react-icons/tb';
import DraggableItem from '../../drag-and-drop/DraggableItem.js';
import { Typography } from '@mui/material';

// export const currentLogicNode = signal<LogicNode | null>(null);

interface LogicNodeTreeDiagramProps {
  logicNode: LogicNode;
}
const LogicNodeTreeDiagram: React.FC<LogicNodeTreeDiagramProps> = ({ logicNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { 
    nodes, 
    edges, 
    loading,
    menu,
    menuOptions,
    onNodeContextMenu,
    closeContextMenu,
    buildLogicTree,
    onNodesChange, 
    onEdgesChange,
    handleLoad
  } = useLogicNodeTreeDiagram();

  useEffect(() => {
    buildLogicTree(logicNode);
  }, [logicNode]);

  const nodeTypes = useMemo(() => ({ custom: TreeNodeComponent }), []);

  return (
    <ReactFlowProvider>
      <Box sx={{ width: '100%', height: '100%' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="tree-diagram" ref={ref} style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodeContextMenu={onNodeContextMenu}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              onInit={handleLoad}
              nodesDraggable={false}
              nodesConnectable={false}
              zoomOnDoubleClick={false}
            >
              <Panel position="top-left">
                <Box sx={{background: '#fff', p: 1}}>
                  <Typography variant="subtitle1" sx={{ml: 2}}>Drag and Drop Gates</Typography>
                  <Box sx={{display: 'flex', padding: '10px'}}>
                    <DraggableItem itemType='Gate' itemData={{gateType: 'gtAnd'}}><TbLogicAnd className='gate-icon'/></DraggableItem>
                    <DraggableItem itemType='Gate' itemData={{gateType: 'gtOr'}}><TbLogicOr className='gate-icon'/></DraggableItem>
                    <DraggableItem itemType='Gate' itemData={{gateType: 'gtNot'}}><TbLogicNot className='gate-icon'/></DraggableItem>
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
          </div>
        )}
      </Box>
    </ReactFlowProvider>
  );
};

export default LogicNodeTreeDiagram;
