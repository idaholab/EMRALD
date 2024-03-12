import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Position,
  Connection,
} from 'reactflow';
import dagre from '@dagrejs/dagre';
import { signal } from '@preact/signals';

import { initialNodes, initialEdges } from './nodes-edges.js';

import 'reactflow/dist/style.css';
import { LogicNode } from '../../../types/LogicNode.js';
import useLogicNodeTreeDiagram from './useLogicTreeDiagram.js';

export const currentLogicNode = signal<LogicNode | null>(null);
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

interface LogicNodeTreeDiagramProps {
  logicNode: LogicNode;
}
const LogicNodeTreeDiagram: React.FC<LogicNodeTreeDiagramProps> = ({ logicNode }) => {
  currentLogicNode.value = logicNode;
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const { test } = useLogicNodeTreeDiagram();


  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
      addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
    );
    },
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
};

export default LogicNodeTreeDiagram;
