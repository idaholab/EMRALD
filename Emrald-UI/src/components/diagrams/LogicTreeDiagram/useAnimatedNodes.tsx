import { timer } from 'd3';
import { useEffect, useState } from 'react';
import { type Node, useReactFlow } from 'reactflow';

export interface UseAnimatedNodeOptions {
  animationDuration?: number;
}

export function useAnimatedNodes(
  nodes: Node[],
  { animationDuration = 300 }: UseAnimatedNodeOptions = {},
) {
  const [tmpNodes, setTmpNodes] = useState(nodes);
  const { getNode } = useReactFlow();

  useEffect(() => {
    const transitions = nodes.map(node => ({
      id: node.id,
      from: getNode(node.id)?.position ?? node.position,
      to: node.position,
      node,
    }));

    const t = timer(elapsed => {
      const s = elapsed / animationDuration;

      setTmpNodes(
        transitions.map(({ node, from, to }) => ({
          ...node,
          position: {
            x: from.x + (to.x - from.x) * s,
            y: from.y + (to.y - from.y) * s,
          },
        })),
      );

      if (elapsed > animationDuration) {
        // it's important to set the final nodes here to avoid glitches
        setTmpNodes(nodes);
        t.stop();
      }
    });

    return () => {
      t.stop();
    };
  }, [nodes, getNode, animationDuration]);

  return { nodes: tmpNodes };
}
