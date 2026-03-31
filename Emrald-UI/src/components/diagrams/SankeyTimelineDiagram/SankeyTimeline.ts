import type { NodeTimes, TimelineGraph } from './types';
import findCircuits from 'elementary-circuits-directed-graph';
import { TimelineLink } from './TimelineLink';
import { TimelineNode } from './TimelineNode';
import { getKeyTimes } from './util';

/**
 * Creates a Sankey diagram along a timeline.
 */
export class SankeyTimeline {
  public keyTimes: number[] = [];

  private links: Record<number, TimelineLink> = {};

  private nextLinkId = 0;

  private nextNodeId = 0;

  private nodes: Record<number, TimelineNode> = {};

  /**
   * Gets a list of circuits (self-closing loops) in the graph.
   *
   * @returns The circuits in the graph.
   */
  public get circuits() {
    const adjList: number[][] = [];
    for (const link of Object.values(this.links)) {
      const source = link.source.id;
      const target = link.target.id;
      if (!adjList[source]) {
        adjList[source] = [];
      }
      if (!adjList[target]) {
        adjList[target] = [];
      }
      if (!adjList[source].includes(target)) {
        adjList[source].push(target);
      }
    }
    return findCircuits(adjList);
  }

  /**
   * Gets an object containing the nodes and links in the graph.
   *
   * @returns The graph object.
   */
  public get graph(): TimelineGraph {
    return {
      links: Object.values(this.links),
      nodes: Object.values(this.nodes).toSorted(
        (a, b) => a.links.length - b.links.length,
      ),
    };
  }

  /**
   * Maximum link flow in the graph.
   *
   * @returns The largest flow value in the graph.
   */
  public get maxFlow() {
    let maxFlow = 0;
    for (const link of Object.values(this.links)) {
      if (link.flow > maxFlow) {
        maxFlow = link.flow;
      }
    }
    return maxFlow;
  }

  /**
   * Maximum node size in the graph.
   *
   * @returns The maximum node size in the graph.
   */
  public get maxSize() {
    let maxSize = 0;
    for (const node of Object.values(this.nodes)) {
      if (node.size > maxSize) {
        maxSize = node.size;
      }
    }
    return maxSize;
  }

  /**
   * Gets the maximum key time in the graph.
   *
   * @returns The maximum key time in the graph.
   */
  public get maxTime() {
    return this.keyTimes.at(-1) ?? 0;
  }

  /**
   * Gets the smallest key time in the graph.
   *
   * @returns The smallest key time in the graph.
   */
  public get minTime() {
    return this.keyTimes[0] ?? 0;
  }

  /**
   * Gets nodes with no outputs.
   *
   * @returns Nodes with no outputs.
   */
  public get sinkNodes() {
    return Object.values(this.nodes).filter(
      node => node.outgoingLinks.length === 0,
    );
  }

  /**
   * Gets nodes with no inputs.
   *
   * @returns Nodes with no inputs.
   */
  public get sourceNodes() {
    return Object.values(this.nodes).filter(
      node => node.incomingLinks.length === 0,
    );
  }

  /**
   * Clears all nodes and links from the timeline.
   */
  public clear() {
    this.nodes = {};
    this.links = {};
    this.keyTimes = [];
    this.nextLinkId = 0;
    this.nextNodeId = 0;
  }

  /**
   * Creates a link between two nodes.
   *
   * @param source - The source node.
   * @param target - The target node.
   * @param flow - The link flow amount.
   * @returns The created link.
   */
  public createLink(source: TimelineNode, target: TimelineNode, flow = 0) {
    const link = new TimelineLink(this, this.nextLinkId, source, target, flow);
    source.addOutgoingLink(link);
    target.addIncomingLink(link);
    this.links[this.nextLinkId] = link;
    this.nextLinkId += 1;
    return link;
  }

  /**
   * Creates a new node in the timeline.
   *
   * @param label - The label for the node.
   * @param times - Node timing data (either start + end time or median + std deviation).
   * @param color - The color of the node, if specified.
   * @returns The created TimelineNode object.
   */
  public createNode(label: string, times: NodeTimes, color?: string) {
    const node = new TimelineNode(this, this.nextNodeId, label, times, color);
    this.nodes[this.nextNodeId] = node;
    this.addKeyTimes(...getKeyTimes(times));
    this.nextNodeId += 1;
    return node;
  }

  /**
   * Gets the IDs of links in the given path.
   *
   * @param path - The path to find links in.
   * @returns Links between the nodes in the path.
   */
  public getLinksInPath(path: number[]) {
    const links: number[] = [];
    for (let i = path.length - 1; i > 0; i -= 1) {
      const l = this.nodes[path[i] ?? 0]?.outgoingLinks.find(
        link => link.target.id === path[i - 1],
      )?.id;
      if (l !== undefined) {
        links.push(l);
      }
    }
    return links;
  }

  /**
   * Gets a node by ID.
   * @param id - The ID of the node to get.
   * @returns The node.
   */
  public getNode(id: number) {
    return this.nodes[id];
  }

  /**
   * Returns all nodes with the given label.
   *
   * @param label - The label of nodes to find.
   * @returns The nodes with the given label, if any.
   */
  public getNodesByLabel(label: string) {
    return Object.values(this.nodes).filter(node => node.label === label);
  }

  /**
   * Gets the possible paths of nodes leading to the node with the given ID.
   *
   * @param id - The node to get the path for.
   * @param exclude - Used for recursion.
   * @returns The possible paths to the node.
   */
  public getPath(id: number, exclude: number[] = []) {
    const target = this.nodes[id];
    const possiblePaths: number[][] = [];
    if (target?.incomingLinks.length === 0) {
      possiblePaths.push([id]);
    } else {
      for (const link of target?.incomingLinks.filter(
        link => !exclude.includes(link.id),
      ) ?? []) {
        if (link.isCircular) {
          exclude.push(link.id);
        }
        for (const path of this.getPath(link.source.id, exclude)) {
          possiblePaths.push([id].concat(path));
        }
      }
    }
    return possiblePaths;
  }

  /**
   * Sets the display color of a node.
   *
   * @param targetNode - The node to set the color of.
   * @param color - The color to set.
   */
  public setNodeColor(targetNode: number, color: string) {
    this.nodes[targetNode]?.setColor(color);
  }

  /**
   * Adds key times if they don't already exist.
   *
   * @param times - The times to add.
   */
  private addKeyTimes(...times: number[]) {
    for (const time of times) {
      if (!this.keyTimes.includes(time)) {
        this.keyTimes.push(time);
        this.keyTimes.sort((a, b) => a - b);
      }
    }
  }
}
