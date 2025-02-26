import { useCallback, useEffect, useState } from 'react';
import { useNodesState, useEdgesState, Edge, Node, Position, ReactFlowInstance } from 'reactflow';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { CompChildItems, LogicNode } from '../../../types/LogicNode';
import { v4 as uuidv4 } from 'uuid';
import dagre from '@dagrejs/dagre';
import EmraldDiagram from '../EmraldDiagram/EmraldDiagram';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { Option } from '../../layout/ContextMenu/ContextMenu';
import LogicNodeForm from '../../forms/LogicNodeForm/LogicNodeForm';
import { MainItemTypes } from '../../../types/ItemTypes';
import { GetModelItemsReferencing } from '../../../utils/ModelReferences';
import LogicNodeFormContextProvider from '../../forms/LogicNodeForm/LogicNodeFormContext';

export type NodeType = 'root' | 'gate' | 'comp';

const useLogicNodeTreeDiagram = () => {
  const [rootNode, setRootNode] = useState<LogicNode | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [nodeExistsAlert, setNodeExistsAlert] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [menu, setMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [menuOptions, setMenuOptions] = useState<Option[]>();
  const { logicNodeList, getLogicNodeByName, updateLogicNode, createLogicNode, deleteLogicNode } =
    useLogicNodeContext();
  const { getDiagramByDiagramName, updateDiagram } = useDiagramContext();
  const { addWindow } = useWindowContext();

  const { handleClose } = useWindowContext();

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 180;
  const nodeHeight = 130;

  // Build the logic tree
  const buildLogicTree = useCallback(
    (logicNode: LogicNode) => {
      const nodeMap = new Map<string, Node>(); // Map to store nodes by their IDs
      const edges: Edge[] = [];
      setRootNode(logicNode);
      const rootNodeId = logicNode.id || 'root';
      // Create the root node with the logic node name as the label
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
          gateChildren: logicNode.gateChildren,
          expanded: true,
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
            gateChildren: node.gateChildren,
            expanded: true,
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
            strokeWidth: 3,
          },
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
          setCompChildren(child, gateNode, nodeMap, edges);
        });
      };

      // Process the gate children of the root node
      logicNode.gateChildren.forEach((childId) => {
        const childNode = getLogicNodeByName(childId);
        if (childNode) {
          processNode(childNode, rootNodeId, rootNode.data.label);
        }
      });

      logicNode.compChildren.forEach((child) => {
        setCompChildren(child, logicNode, nodeMap, edges);
      });

      const formattedNodes = Array.from(nodeMap.values()); // Convert the node map to an array of nodes
      setNodes(formattedNodes); // Update the nodes state
      setEdges(edges); // Update the edges state
      setLoading(false); // Set loading to false after setting nodes
    },
    [getLogicNodeByName, setNodes, setEdges],
  );
  const setCompChildren = (
    child: CompChildItems,
    gateNode: Node | LogicNode,
    nodeMap: Map<string, Node>,
    edges: Edge[] = [],
  ) => {
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
          parentName: isNode(gateNode) ? gateNode.data.label : gateNode.name,
          type: 'comp',
          description: diagram.desc,
          diagram: diagram,
          defaultStateValues: child.stateValues && child.stateValues.length > 0 ? false : true,
        },
      };
      nodeMap.set(compNode.id, compNode);
      edges.push({
        id: uuidv4(),
        source: gateNode.id || '',
        target: compNode.id,
        ariaLabel: `${isNode(gateNode) ? gateNode.data.label : gateNode.name}-${childNode}`,
        type: 'smoothstep',
        style: {
          strokeWidth: 3,
        },
      });
    }
  };

  const isNode = (node: Node | LogicNode): node is Node => {
    return (node as Node).data !== undefined;
  };

  const dagreFormatNodes = (nodes: Node[], edges: Edge[], direction = 'TB') => {
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
  };
  const removeNode = async (parentNode: string, nodeName: string, type: NodeType) => {
    return new Promise<void>(async (resolve) => {
      const parentLogicNode = getLogicNodeByName(parentNode);
      const nodeToRemove = getLogicNodeByName(nodeName);
      if (type === 'gate') {
        if (nodeToRemove.gateChildren.length > 0) {
          await recurseAndDeleteChildren(nodeToRemove);
        }
        if (canDeleteNode(nodeName)) {
          await deleteLogicNode(nodeToRemove.id);
        }
        if (parentNode) {
          parentLogicNode.gateChildren = parentLogicNode.gateChildren.filter(
            (child) => child !== nodeName,
          );
        }
      }
      if (type === 'comp' && parentNode) {
        parentLogicNode.compChildren = parentLogicNode.compChildren.filter(
          (child) => child.diagramName !== nodeName,
        );
      }
      await updateLogicNode(parentLogicNode);
      if (nodeToRemove === rootNode) {
        handleClose();
      }
      resolve();
    });
  };
  const removeChildNodes = async (nodesToRemove: { nodeName: string; parentName: string }[]) => {
    if (nodesToRemove && nodesToRemove.length > 0) {
      for (const node of nodesToRemove) {
        await removeNode(node.parentName, node.nodeName, 'gate');
      }
    }
  };

  const deleteChildNodes = async (nodesToDelete: string[]) => {
    if (nodesToDelete && nodesToDelete.length > 0) {
      for (const nodeID of nodesToDelete) {
        await deleteLogicNode(nodeID);
      }
    }
  };

  const recurseAndDeleteChildren = async (node: LogicNode) => {
    return new Promise<void>(async (resolve) => {
      const result = recurseChildren(node);
      if (result) {
        const { nodesToDelete, nodesToRemove } = result;
        await removeChildNodes(nodesToRemove);
        await deleteChildNodes(nodesToDelete);
      }
      resolve();
    });
  };
  const recurseChildren = (
    node: LogicNode,
    nodesToRemove: { nodeName: string; parentName: string }[] = [],
    nodesToDelete: string[] = [],
  ) => {
    if (!node) return;
    if (!canDeleteNode(node.name)) return;
    node.gateChildren.forEach(async (gateChildName) => {
      const gateChildNode = getLogicNodeByName(gateChildName);
      if (gateChildNode) {
        if (!canDeleteNode(gateChildNode.name)) {
          nodesToRemove.push({ nodeName: gateChildNode.name, parentName: node.name });
        } else {
          if (gateChildNode.id) {
            nodesToDelete.push(gateChildNode.id);
          }
          recurseChildren(gateChildNode, nodesToRemove, nodesToDelete);
        }
      }
    });
    return { nodesToDelete, nodesToRemove };
  };

  const canDeleteNode = (nodeName: string) => {
    const nodeInQuestion = getLogicNodeByName(nodeName);
    if (nodeInQuestion.isRoot && nodeInQuestion !== rootNode) {
      return false;
    }
    const currentReferences = GetModelItemsReferencing(nodeName, MainItemTypes.LogicNode, 1);
    return currentReferences.LogicNodeList.length > 1 ? false : true;
  };

  const DeleteNode = async (parentNode: string, nodeName: string) => {
    const parentLogicNode = getLogicNodeByName(parentNode);
    const nodeToDelete = getLogicNodeByName(nodeName);
    let gateChildren = getAllGateChildren(nodeToDelete);
    await deleteChildNodes(
      gateChildren.map((node) => {
        if (canDeleteNode(node.name)) {
          return node.id || '';
        }
        return '';
      }),
    );
    await deleteLogicNode(nodeToDelete.id);

    if (parentNode) {
      parentLogicNode.gateChildren = parentLogicNode.gateChildren.filter(
        (child) => child !== nodeName,
      );
    }
    if (rootNode === nodeToDelete) {
      handleClose();
    }
    updateLogicNode(parentLogicNode);
  };

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
      case 'root':
      case 'gate':
        options = [
          {
            label: 'Add Gate',
            action: () =>
              addWindow(
                `New Node`,
                <LogicNodeFormContextProvider>
                  <LogicNodeForm parentNodeName={logicNode.name} nodeType="gate" gateType="gtAnd" />
                </LogicNodeFormContextProvider>
                ,
              ),
          },
          {
            label: 'Add Component',
            action: () =>
              addWindow(
                `New Node`,
                <LogicNodeFormContextProvider>
                  <LogicNodeForm parentNodeName={logicNode.name} nodeType="comp" />
                </LogicNodeFormContextProvider>,
              ),
            isDivider: true,
          },
          {
            label: 'Edit Gate Node',
            action: () =>
              addWindow(
                `Edit Gate Node: ${label}`,
                <LogicNodeFormContextProvider>
                  <LogicNodeForm logicNodeData={logicNode} gateType={logicNode.gateType} editing={true} />
                </LogicNodeFormContextProvider>,
              ),
            isDivider: true,
          },
        ];
        options.push(
          {
            label: 'Copy',
            action: () => {
              const copiedNodeData = JSON.stringify(structuredClone(node.data.logicNode), null, 2);
              navigator.clipboard.writeText(copiedNodeData);
            },
          },
          { label: 'Paste', action: () => pasteNode(label) },
          {
            label: 'Paste (as new)',
            action: () => pasteNode(label, 'new'),
            isDivider: true,
          },
          { label: 'Remove Gate', action: () => removeNode(parentName, label, 'gate') },
          { label: 'Delete Gate', action: () => DeleteNode(parentName, label) },
        );

        break;

      case 'comp':
        options = [
          {
            label: 'Edit Component Node',
            action: () =>
              addWindow(
                `Edit Component Node: ${label}`,
                <LogicNodeFormContextProvider>
                  <LogicNodeForm
                    logicNodeData={parentNode}
                    component={label}
                    nodeType="comp"
                    editing={true}
                  />
                </LogicNodeFormContextProvider>,
              ),
          },
          { label: 'Go to Diagram', action: () => goToDiagram(node.data.label), isDivider: true },
          { label: 'Remove Component', action: () => removeNode(parentName, label, 'comp') },
        ];
        break;

      default:
        break;
    }

    setMenuOptions(options);
  };

  const pasteNode = async (nodeToUpdate: string, type?: string) => {
    if (!document.hasFocus()) {
      alert('Please click on the document to focus before reading the clipboard.');
      return;
    }
    const pastedData = await navigator.clipboard.readText();
    // Parse the pasted data
    let pastedObject;
    try {
      pastedObject = JSON.parse(pastedData);
    } catch (error) {
      console.error('Failed to parse pasted data:', error);
      return;
    }
    const node = getLogicNodeByName(nodeToUpdate);
    if (node) {
      // Run this check to always make sure there is no circular references.
      if (couldCreateInfiniteLoop(node, pastedObject.name)) {
        setNodeExistsAlert(true);
        return;
      }
      // If the node was deleted after copying it this will handle the recreation of it.
      if (type === 'new' || !logicNodeList.value.some((node) => node.name === pastedObject.name)) {
        const gateNodes = logicNodeList.value.filter((node) =>
          new RegExp(`^Copy of ${pastedObject.name}`).test(node.name),
        ); // Find all existing logic nodes with the name
        let newGateNumber = 1;
        if (gateNodes.length > 0) {
          const existingNumbers = gateNodes.map((node) => {
            const numberStr = node.name.match(/\((\d+)\)/);
            return numberStr ? parseInt(numberStr[1]) : 0;
          });
          newGateNumber = Math.max(...existingNumbers) + 1;
        }
        const newNode: LogicNode = {
          ...pastedObject,
          ...(type === 'new' && {
            id: uuidv4(),
            name: `Copy of ${pastedObject.name} (${newGateNumber})`,
          }),
        };
        await createLogicNode(newNode);
        node.gateChildren = [...node.gateChildren, newNode.name];
      } else {
        const pastedNodeName = pastedObject.name;
        node.gateChildren = [...node.gateChildren, pastedNodeName];
      }
      updateLogicNode(node);
    }
  };

  const couldCreateInfiniteLoop = (parentNode: LogicNode, newNodeName: string): boolean => {
    return (
      parentNode.name === newNodeName ||
      getAllGateChildrenNames(parentNode).includes(newNodeName) ||
      getAncestors(parentNode).includes(newNodeName)
    );
  };

  const getAncestors = (node: LogicNode): string[] => {
    let ancestors: string[] = [];
    const copiedModel = GetModelItemsReferencing(
      node.name,
      MainItemTypes.LogicNode,
      -1,
      undefined,
      new Set<MainItemTypes>([MainItemTypes.LogicNode]),
    );
    copiedModel.LogicNodeList.forEach((node) => {
      ancestors.push(node.name);
    });
    return ancestors;
  };
  const getAllGateChildren = (node: LogicNode): LogicNode[] => {
    let gateChildren: LogicNode[] = [];
    let queue: LogicNode[] = [node];
    while (queue.length > 0) {
      const currentNode = queue.pop();
      currentNode?.gateChildren.forEach((childName) => {
        const childNode = getLogicNodeByName(childName);
        if (childNode) {
          gateChildren.push(childNode);
          queue.push(childNode);
        }
      });
    }
    return gateChildren;
  };

  const getAllGateChildrenNames = (node: LogicNode): string[] => {
    let gateChildrenNames = getAllGateChildren(node).map((node) => node.name);
    return gateChildrenNames;
  };

  const handleDoubleClick = (type: string, text: string) => {
    if (type === 'description') {
      setEditingDescription(true);
      setEditedDescription(text);
    } else {
      setEditingTitle(true);
      setEditedTitle(text);
    }
  };

  const handleDescriptionBlur = useCallback(
    (type: string, label: string) => {
      setEditingDescription(false);

      if (type === 'gate' || type === 'root') {
        const updatedLogicNode = getLogicNodeByName(label);
        if (updatedLogicNode) {
          updateLogicNode({
            ...updatedLogicNode,
            desc: editedDescription,
          });
        }
      }

      if (type === 'comp') {
        const diagramToUpdate = getDiagramByDiagramName(label);
        if (diagramToUpdate) {
          updateDiagram({
            ...diagramToUpdate,
            desc: editedDescription,
          });
        }
      }

      setEditedDescription('');
    },
    [
      nodes,
      getLogicNodeByName,
      getDiagramByDiagramName,
      updateLogicNode,
      updateDiagram,
      editedDescription,
    ],
  );

  const handleTitleBlur = useCallback(
    (type: string, label: string) => {
      setEditingTitle(false);

      if (type === 'gate' || type === 'root') {
        const LogicNodeToUpdate = getLogicNodeByName(label);
        console.log(LogicNodeToUpdate);
        if (LogicNodeToUpdate) {
          updateLogicNode({
            ...LogicNodeToUpdate,
            name: editedTitle,
          });
        }
      }

      if (type === 'comp') {
        const diagramToUpdate = getDiagramByDiagramName(label);
        if (diagramToUpdate) {
          updateDiagram({
            ...diagramToUpdate,
            name: editedTitle,
          });
        }
      }

      setEditedTitle('');
    },
    [
      nodes,
      getLogicNodeByName,
      getDiagramByDiagramName,
      updateLogicNode,
      updateDiagram,
      editedTitle,
    ],
  );

  useEffect(() => {
    if (nodes && !loading) {
      const { nodes: formattedNodes } = dagreFormatNodes(nodes, edges);
      setNodes(formattedNodes); // Update the nodes state with the dagre formatted nodes
    }
  }, [nodes, loading]);

  useEffect(() => {
    if (!rootNode) {
      return;
    }
    const updatedLogicNode = getLogicNodeByName(rootNode.name);
    if (updatedLogicNode) {
      buildLogicTree(updatedLogicNode);
    }
  }, [logicNodeList.value]);

  useEffect(() => {
    if (nodeExistsAlert) {
      const timer = setTimeout(() => {
        setNodeExistsAlert(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [nodeExistsAlert]);

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
    editingTitle,
    editedTitle,
    nodeExistsAlert,
    canDeleteNode,
    recurseAndDeleteChildren,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    handleLoad,
    buildLogicTree,
    setEditedDescription,
    setEditedTitle,
    handleDoubleClick,
    handleDescriptionBlur,
    handleTitleBlur,
    onNodeContextMenu,
    closeContextMenu,
    goToDiagram,
    removeNode,
    setNodeExistsAlert,
    couldCreateInfiniteLoop,
  };
};

export default useLogicNodeTreeDiagram;
