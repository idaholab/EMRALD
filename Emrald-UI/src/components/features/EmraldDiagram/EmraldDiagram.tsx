import React, { useMemo, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@mui/material';
import StateNode from '../EmraldDiagram/StateNodeComponent';
import { Diagram } from '../../../types/Diagram';
import useEmraldDiagram from './useEmraldDiagram';
import CustomConnectionLine from './Edges/ConnectionLineComponent';
import ContextMenu from '../../layout/ContextMenu/ContextMenu';

interface EmraldDiagramProps {
  diagram: Diagram;
}

const EmraldDiagram: React.FC<EmraldDiagramProps> = ({ diagram }) => {
  const {
    nodes,
    edges,
    loading,
    menu,
    menuOptions,
    closeContextMenu,
    onPaneContextMenu,
    onNodeContextMenu,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
  } = useEmraldDiagram(diagram);

  const nodeTypes = useMemo(() => ({ custom: StateNode }), []);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onPaneContextMenu={onPaneContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={() => closeContextMenu()}
            connectionLineComponent={CustomConnectionLine}
            connectionLineType={ConnectionLineType.SmoothStep}
            onNodeDragStop={onNodeDragStop}
            fitView
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
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
  );
};

export default EmraldDiagram;
