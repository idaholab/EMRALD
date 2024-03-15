import { useCallback, useEffect, useState } from 'react';
import { useNodesState, useEdgesState, Edge, Node, Position, ReactFlowProvider, ReactFlowInstance } from 'reactflow';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
// import { currentLogicNode } from './LogicTreeDiagram';
import { LogicNode } from '../../../types/LogicNode';
import { v4 as uuidv4 } from 'uuid';
import dagre from '@dagrejs/dagre';
import EmraldDiagram from '../EmraldDiagram/EmraldDiagram';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';

const useLogicNodeTreeDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const { getLogicNodeByName } = useLogicNodeContext();
  const { getDiagramByDiagramName } = useDiagramContext();
  const { addWindow } = useWindowContext();

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 150;

  // Build the logic tree
  const buildLogicTree = useCallback((logicNode: LogicNode) => {
    const nodeMap = new Map<string, Node>(); // Map to store nodes by their IDs
    const edges: Edge[] = [];
  
    // Create the root node with the logic node name as the label
    const rootNodeId = 'root';
    const rootNode: Node = {
      id: rootNodeId,
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: logicNode.name,
        isRoot: true,
        parent: null,
        parentName: '',
        type: 'root',
        compChildren: [],
        gateChildren: logicNode.gateChildren,
      },
    };
  
    // Add the root node to the node map
    nodeMap.set(rootNodeId, rootNode);
  
    // Recursive function to process nodes
    const processNode = (node: LogicNode, parentId: string, parentName: string) => {
      const gateNode: Node = {
        id: uuidv4(),
        position: { x: 0, y: 0 },
        type: 'custom',
        data: {
          label: node.name,
          isRoot: node.isRoot,
          parent: parentId,
          parentName: parentName,
          type: 'gate',
          compChildren: node.compChildren,
          gateChildren: node.gateChildren,
        },
      };
  
      nodeMap.set(gateNode.id, gateNode);
  
      edges.push({
        id: uuidv4(),
        source: parentId, // Use parentId as the source for edges
        target: gateNode.id,
        ariaLabel: node.name,
      });
  
      // Process the gate children
      node.gateChildren.forEach((childId) => {
        const childNode = getLogicNodeByName(childId); // Get the child logic node details
        if (childNode) {
          processNode(childNode, gateNode.id, gateNode.data.label);
        }
      });
  
      // Process the comp children
      node.compChildren.forEach((child) => {
        const childNode = child.diagramName;
        if (childNode) {
          const compNode: Node = {
            id: uuidv4(),
            position: { x: 0, y: 0 },
            type: 'custom',
            data: {
              label: `${childNode}`,
              parent: gateNode.id,
              parentName: gateNode.data.label,
              type: 'comp',
            },
          };
          nodeMap.set(compNode.id, compNode);
          edges.push({
            id: uuidv4(),
            source: gateNode.id,
            target: compNode.id,
            ariaLabel: `${gateNode.data.label}-${childNode}`,
          });
        }
      });
    };
  
    // Process the gate children of the root node
    logicNode.gateChildren.forEach((childId) => {
      const childNode = getLogicNodeByName(childId);
      if (childNode) {
        processNode(childNode, rootNodeId, rootNode.data.label);
      }
    });
  
    const formattedNodes = Array.from(nodeMap.values()); // Convert the node map to an array of nodes
    setNodes(formattedNodes); // Update the nodes state
    setEdges(edges); // Update the edges state
    setLoading(false); // Set loading to false after setting nodes
  }, [getLogicNodeByName, setNodes, setEdges]); 
  

  const dagreFormatNodes = (nodes: Node[], direction = 'TB') => {
    dagreGraph.setGraph({ rankdir: direction }); // Create a new directed graph

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }); // Add nodes to the graph
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target); // Add edges to the graph
    });

    dagre.layout(dagreGraph); // Layout the graph

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id); // Get the position of the node
      node.targetPosition = Position.Top;
      node.sourcePosition = Position.Bottom;

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });

    return { nodes, edges }; // Return the formatted nodes
  };

  const goToDiagram = (diagramName: string) => {
    const diagram = getDiagramByDiagramName(diagramName);
    addWindow(diagramName, <EmraldDiagram diagram={diagram} />, {
      x: 75,
      y: 25,
      width: 1300,
      height: 700,
    });
  }

  useEffect(() => {
    if (nodes && !loading) {
      const { nodes: formattedNodes } = dagreFormatNodes(nodes);
      setNodes(formattedNodes); // Update the nodes state with the dagre formatted nodes
    }
  }, [nodes, loading]);

  const handleLoad = useCallback((reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.fitView(); // Call fitView after the ReactFlow component has been fully loaded
  }, []);

  return {
    nodes,
    edges,
    loading,
    setNodes,
    setEdges,
    buildLogicTree,
    onNodesChange,
    onEdgesChange,
    handleLoad,
    goToDiagram
  };
};

export default useLogicNodeTreeDiagram;
