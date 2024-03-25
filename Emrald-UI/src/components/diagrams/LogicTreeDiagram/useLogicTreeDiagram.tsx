import { useCallback, useEffect, useState } from 'react';
import { useNodesState, useEdgesState, Edge, Node, Position, ReactFlowProvider, ReactFlowInstance, useReactFlow, useNodes } from 'reactflow';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { LogicNode } from '../../../types/LogicNode';
import { v4 as uuidv4 } from 'uuid';
import dagre from '@dagrejs/dagre';
import EmraldDiagram from '../EmraldDiagram/EmraldDiagram';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { Option } from '../../layout/ContextMenu/ContextMenu';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';

export type NodeType = 'root' | 'gate' | 'comp';

const useLogicNodeTreeDiagram = () => {
  const [rootNode, setRootNode] = useState<LogicNode | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [menu, setMenu] = useState<{ mouseX: number; mouseY: number; } | null>(null);
  const [menuOptions, setMenuOptions] = useState<Option[]>();
  const { logicNodes, getLogicNodeByName, updateLogicNode } = useLogicNodeContext();
  const { diagrams, getDiagramByDiagramName, updateDiagram } = useDiagramContext();
  const { addWindow } = useWindowContext();

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 150;

  // Build the logic tree
  const buildLogicTree = useCallback((logicNode: LogicNode) => {
    const nodeMap = new Map<string, Node>(); // Map to store nodes by their IDs
    const edges: Edge[] = [];
    setRootNode(logicNode);
  
    // Create the root node with the logic node name as the label
    const rootNodeId = 'root';
    const rootNode: Node = {
      id: rootNodeId,
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: logicNode.name,
        logicNode: logicNode,
        isRoot: logicNode.isRoot,
        parent: null,
        parentName: '',
        type: 'root',
        gateType: logicNode.gateType,
        description: logicNode.desc,
        compChildren: [],
        gateChildren: logicNode.gateChildren
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
          logicNode: node,
          isRoot: node.isRoot,
          parent: parentId,
          parentName: parentName,
          type: 'gate',
          gateType: node.gateType,
          description: node.desc,
          compChildren: node.compChildren,
          gateChildren: node.gateChildren
        },
      };
  
      nodeMap.set(gateNode.id, gateNode);
  
      edges.push({
        id: uuidv4(),
        source: parentId, // Use parentId as the source for edges
        target: gateNode.id,
        ariaLabel: node.name,
        type: 'smoothstep',
        style: {
          strokeWidth: 3
        }
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
        const diagram = getDiagramByDiagramName(child.diagramName);
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
              description: diagram.desc,
              diagram: diagram,
              defaultStateValues: child.stateValues && child.stateValues.length > 0 ? false : true
            },
          };
          nodeMap.set(compNode.id, compNode);
          edges.push({
            id: uuidv4(),
            source: gateNode.id,
            target: compNode.id,
            ariaLabel: `${gateNode.data.label}-${childNode}`,
            type: 'smoothstep',
            style: {
              strokeWidth: 3
            }
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

  const removeNode = (parentNode: string, nodeName: string, type: NodeType) => {
    const parentLogicNode = getLogicNodeByName(parentNode);
    if (type === 'gate') {
      parentLogicNode.gateChildren = parentLogicNode.gateChildren.filter((child) => child !== nodeName);
    }
    if (type === 'comp') {
      parentLogicNode.compChildren = parentLogicNode.compChildren.filter((child) => child.diagramName !== nodeName);
    }

    updateLogicNode(parentLogicNode);
  }
  
  // * Context menu

  const closeContextMenu = () => setMenu(null); // Close the context menu
  const onNodeContextMenu = (e: React.MouseEvent, node: Node) => {
    const { label, logicNode, parentName } = node.data;
    const parentNode = getLogicNodeByName(parentName);
    e.preventDefault();
    e.stopPropagation();
    setMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  
    let options: Option[] = [];
  
    switch (node.data.type) {
      case "root":
      case "gate":
        options = [
          { label: 'Add Gate', action: () => addWindow(`New Node`, <LogicNodeForm parentNodeName={logicNode.name} nodeType='gate' gateType="gtAnd" />)  },
          { label: 'Add Component', action: () => addWindow(`New Node`, <LogicNodeForm parentNodeName={logicNode.name} nodeType='comp' />), isDivider: true },
          { label: 'Edit Gate Node', action: () => addWindow(`Edit Gate Node: ${label}`, <LogicNodeForm logicNodeData={logicNode}/>) , isDivider: true  },
        ];
        if (node.data.type === "gate") {
          options.push(
            { label: 'Remove Gate', action: () => removeNode(parentName, label, 'gate') },
            { label: 'Delete Gate', action: () => console.log('Delete Gate')}
          );
        }
        break;
  
      case "comp":
        options = [
          { label: 'Edit Component Node', action: () => addWindow(`Edit Component Node: ${label}`, <LogicNodeForm logicNodeData={parentNode} component={label} nodeType='comp' editing={true}/>)  },
          { label: 'Go to Diagram', action: () => goToDiagram(node.data.label), isDivider: true },
          { label: 'Remove Component', action: () => removeNode(parentName, label, 'comp') },
        ];
        break;
  
      default:
        break;
    }
  
    setMenuOptions(options);
  };

  const handleDescriptionDoubleClick = (description: string) => {
    setEditingDescription(true);
    setEditedDescription(description);
  };

  const handleDescriptionBlur = useCallback((nodeId: string, type: string, label: string, nodes: Node[]) => {
    setEditingDescription(false);
    nodes.map((node) => {
      if (node.data.label === label) {
        node.data.description = editedDescription;
      }
      return node;
    });
    setNodes(nodes);
    
    if (type === 'gate' || type === 'root') {
      const updatedLogicNode = getLogicNodeByName(label);
      if (updatedLogicNode) {
        updateLogicNode({
          ...updatedLogicNode,
          desc: editedDescription
        });
      }
    }

    if (type === 'comp') {
      const updatedDiagram = getDiagramByDiagramName(label);
      if (updatedDiagram) {
        updateDiagram({
          ...updatedDiagram,
          desc: editedDescription
        });
      }
    }

    setEditedDescription('');
  }, [nodes, getLogicNodeByName, getDiagramByDiagramName, updateLogicNode, updateDiagram, editedDescription]);

  useEffect(() => {
    if (nodes && !loading) {
      const { nodes: formattedNodes } = dagreFormatNodes(nodes);
      setNodes(formattedNodes); // Update the nodes state with the dagre formatted nodes
    }
  }, [nodes, loading]);

  useEffect(() => {
    if (!rootNode) { return ;}
    const updatedLogicNode = getLogicNodeByName(rootNode.name);
    if (updatedLogicNode) {
      buildLogicTree(updatedLogicNode);
    }
  }, [logicNodes]);

  const handleLoad = useCallback((reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.fitView(); // Call fitView after the ReactFlow component has been fully loaded
  }, []);

  return {
    nodes,
    edges,
    loading,
    menu,
    menuOptions,
    editingDescription,
    editedDescription,
    setEditedDescription,
    handleDescriptionDoubleClick,
    handleDescriptionBlur,
    onNodeContextMenu,
    closeContextMenu,
    setNodes,
    setEdges,
    buildLogicTree,
    onNodesChange,
    onEdgesChange,
    handleLoad,
    goToDiagram,
    removeNode
  };
};

export default useLogicNodeTreeDiagram;
