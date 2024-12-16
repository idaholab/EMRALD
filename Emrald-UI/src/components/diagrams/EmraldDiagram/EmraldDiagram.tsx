import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant, ControlButton } from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, CircularProgress, Typography } from '@mui/material';
import StateNode from '../EmraldDiagram/StateNodeComponent';
import { Diagram } from '../../../types/Diagram';
import useEmraldDiagram from './useEmraldDiagram';
import CustomConnectionLine from './Edges/ConnectionLineComponent';
import ContextMenu from '../../layout/ContextMenu/ContextMenu';
import DialogComponent from '../../common/DialogComponent/DialogComponent';
import useContextMenu from './useContextMenu';
import { signal } from '@preact/signals';
import { emptyDiagram } from '../../../contexts/DiagramContext';
import { TbMap } from "react-icons/tb";
import { PiDotsNine } from 'react-icons/pi';
import DownloadButton from '../DownloadButton';

interface EmraldDiagramProps {
  diagram: Diagram;
}

export const currentDiagram = signal<Diagram>(emptyDiagram);

const EmraldDiagram: React.FC<EmraldDiagramProps> = ({ diagram }) => {
  const [showMap, setShowMap] = useState(true);
  const [showBackgroundDots, setShowBackgroundDots] = useState(true);
  currentDiagram.value = diagram;
  const {
    nodes,
    edges,
    loading,
    setEdges,
    getStateNodes,
    onNodesChange,
    onEdgesChange,
    onEdgeClick,
    onPaneClick,
    onNodeDragStop,
    onConnect,
    onNodeDoubleClick,
    onEdgeUpdate,
    isValidConnection,
    setTopDiagram,
  } = useEmraldDiagram();
  const {
    menu,
    menuOptions,
    deleteConfirmation,
    itemToDelete,
    deleteItem,
    closeDeleteConfirmation,
    closeContextMenu,
    onPaneContextMenu,
    onNodeContextMenu,
    onEdgeContextMenu,
  } = useContextMenu(getStateNodes, setEdges);

  useEffect(() => {
    setTopDiagram(diagram);
  }, []);
  const nodeTypes = useMemo(() => ({ custom: StateNode }), []);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
          <h4>Loading Diagram</h4>
        </Box>
      ) : (
        <div className="emrald-diagram" ref={ref} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={onEdgeClick}
            onConnect={onConnect}
            onPaneContextMenu={onPaneContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeContextMenu={(event, edge) => onEdgeContextMenu(event, edge, edges)}
            onEdgeUpdate={onEdgeUpdate}
            onPaneClick={(e) => { closeContextMenu(); onPaneClick(e); }}
            connectionLineComponent={CustomConnectionLine}
            onNodeDragStop={onNodeDragStop}
            isValidConnection={isValidConnection}
            proOptions={{ hideAttribution: true }}
            fitView
            nodeTypes={nodeTypes}
          >
            <Controls>
              <ControlButton onClick={() => setShowMap(!showMap)}>
                <TbMap />
              </ControlButton> 
              <ControlButton onClick={() => setShowBackgroundDots(!showBackgroundDots)}>
                <PiDotsNine />
              </ControlButton>  
              <DownloadButton diagramName={diagram.name}/>
            </Controls>
            {
              showMap && (
                <MiniMap pannable />
              )
            }
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
          {deleteConfirmation && (
            <DialogComponent
              open={true}
              title="Delete Confirmation"
              submitText="delete"
              onSubmit={() => deleteItem()}
              onClose={() => closeDeleteConfirmation()}
            >
              <Typography>
                Are you sure you want to delete {itemToDelete?.name}? It will be removed from all
                other places it is used.
              </Typography>
            </DialogComponent>
          )}
        </div>
      )}
    </Box>
  );
};

export default EmraldDiagram;
