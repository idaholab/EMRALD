import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

function TreeDiagram() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Define the tree data
    const data: TreeNode = {
      name: 'Root',
      children: [
        {
          name: 'Node 1',
          children: [{ name: 'Node 1.1' }, { name: 'Node 1.2', children: [
            {name: 'Node 1.2.1'},
            {name: 'Node 1.2.2'},
          ] }],
        },
        {
          name: 'Node 2',
          children: [
            {
              name: 'Node 2.1',
              children: [
                { name: 'Node 2.1.1', children: [{ name: 'Node 2.1.1.1' }] },
                { name: 'Node 2.1.2', children: [{ name: 'Node 2.1.2.1' }] },
                { name: 'Node 2.1.3', children: [{ name: 'Node 2.1.3.1' }] },
              ],
            },
            { name: 'Node 2.2' },
          ],
        },
      ],
    };

    // Specify chart dimensions and other constants
    const width = 1200;
    const marginTop = 100;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 100;
    const dx = 200;
    const dy =
      (width - marginRight - marginLeft) / (1 + d3.hierarchy(data).height);

    // Create an SVG element using D3
    const svg = d3
      .select(svgRef.current!)
      .attr('width', width)
      .attr('height', dx)
      .attr('viewBox', [-marginLeft, -marginTop, width, dx])
      .attr(
        'style',
        'max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;',
      );

    // Define the tree layout and link shape
    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    const diagonal = d3
      .linkHorizontal<TreeNode, d3.HierarchyPointNode<TreeNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

    // Create containers for links and nodes
    const gLink = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = svg
      .append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    function update(event: any, source: d3.HierarchyPointNode<TreeNode>) {
      const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition = svg
        .transition()
        .duration(duration)
        .attr('height', height)
        .attr('viewBox', [-marginLeft, left.x - marginTop, width, height])
        .tween(
          'resize',
          window.ResizeObserver ? null : () => () => svg.dispatch('toggle'),
        );

      // Update the nodes…
      const node = gNode.selectAll('g').data(nodes, (d) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      nodeEnter
        .append('circle')
        .attr('r', 2.5)
        .attr('fill', (d) => (d._children ? '#555' : '#999'))
        .attr('stroke-width', 10);

      nodeEnter
        .append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d._children ? -6 : 6))
        .attr('text-anchor', (d) => (d._children ? 'end' : 'start'))
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white');

      // Transition nodes to their new position.
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', (d) => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links…
      const link = gLink.selectAll('path').data(links, (d) => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition).attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Initial setup
    const root = d3.hierarchy(data);
    root.x0 = dx / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    update(null, root);
  }, []);

  return <svg ref={svgRef}></svg>;
}

export default TreeDiagram;
