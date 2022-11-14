import type SankeyTimeline from './SankeyTimeline';
import type TimelineNode from './TimelineNode';
import { LinkLayout } from './types';

/**
 * Represents a link between two nodes in the graph.
 */
export default class TimelineLink {
  public flow: number;

  public graph: SankeyTimeline;

  public id: number;

  public layout: LinkLayout = {
    curve: [],
    path: '',
    width: 0,
  };

  public source: TimelineNode;

  public target: TimelineNode;

  /**
   * Constructs Timelinelink.
   *
   * @param graph - The graph that this link belongs to.
   * @param id - The link id.
   * @param source - The source node.
   * @param target - The target node.
   * @param flow - The link flpw.
   */
  public constructor(
    graph: SankeyTimeline,
    id: number,
    source: TimelineNode,
    target: TimelineNode,
    flow: number,
  ) {
    this.graph = graph;
    this.id = id;
    this.source = source;
    this.target = target;
    this.flow = flow;
  }

  /**
   * Gets if the link is circular.
   *
   * @returns If the link is circular.
   */
  public get isCircular(): boolean {
    if (this.isSelfLinking) {
      return true;
    }
    let isCircular = false;
    this.graph.circuits.forEach((circuit) => {
      const lastLink = circuit.slice(-2);
      if (lastLink[0] === this.source.id && lastLink[1] === this.target.id) {
        isCircular = true;
      }
    });
    return isCircular;
  }

  /**
   * If the link is self-linking.
   *
   * @returns If the link is self-linking.
   */
  public get isSelfLinking(): boolean {
    return this.source.id === this.target.id;
  }
}
