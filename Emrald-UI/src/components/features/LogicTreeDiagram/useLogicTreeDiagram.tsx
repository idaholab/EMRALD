import { useCallback, useEffect, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  Edge,
  Node,
} from 'reactflow';
import { useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { currentLogicNode } from './LogicTreeDiagram';

const useLogicNodeTreeDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [test, setTest] = useState([]);
  const { getLogicNodeByName } = useLogicNodeContext();

  // Build the state nodes
  // const getStateNodes = () => {
  //   if (currentDiagram.value.states) {
  //     let stateNodes = currentDiagram.value.states.map((state) => {
  //       let stateDetails = getStateByStateName(state);
  //       const { x, y } = stateDetails.geometryInfo || { x: 0, y: 0 };
  //       return {
  //         id: `state-${stateDetails.id}`,
  //         position: { x, y },
  //         type: 'custom',
  //         data: {
  //           label: state,
  //           state: stateDetails
  //         }
  //       };
  //     });
  //     setNodes(stateNodes);
  //   }
  // }

  // // Initialize the edges for the state nodes
  // useEffect(() => {
  //   if (nodes && !loading) {
  //     getEdges(nodes); // Only call getEdges when nodes are available and loading is false
  //   }
  // }, [nodes, loading]);

  // // Initialize the state nodes
  // useEffect(() => {
  //   getStateNodes();
  //   setLoading(false);
  // }, [currentDiagram.value]);

  useEffect(() => {
    console.log(currentLogicNode.value);
  }, [])
  

  return {
    test
  };
};

export default useLogicNodeTreeDiagram;