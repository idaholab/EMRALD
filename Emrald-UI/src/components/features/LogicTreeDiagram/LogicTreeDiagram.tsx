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
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              onInit={handleLoad}
              nodesDraggable={false}
              nodesConnectable={false}
            >
              <Panel position="top-left">
                <Box sx={{background: '#d3d3d3', padding: '10px'}}>Panel to add items if needed</Box>
              </Panel>
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        )}
      </Box>
    </ReactFlowProvider>
  );
};

export default LogicNodeTreeDiagram;
