import type SankeyTimeline from './SankeyTimeline';
import type TimelineLink from './TimelineLink';
import { NodeLayout, NodeTimes } from './types';
import { sum } from './util';

/**
 * Represents a node in the timeline.
 */
export default class TimelineNode {
  public data: any;

  public graph: SankeyTimeline;

  public id: number;

  public incomingLinks: TimelineLink[] = [];

  public label: string;

  public layout: NodeLayout = {
    baseRow: 0,
    color: '',
    column: -1,
    height: 0,
    row: -1,
    width: 0,
    x: 0,
    y: 0,
  };

  public outgoingLinks: TimelineLink[] = [];

  public persist: {
    default: {
      x?: number;
      y?: number;
    };
    timeline: {
      y?: number;
    };
  } = {
    default: {},
    timeline: {},
  };

  public textHeight = 0;

  public textWidth = 0;

  public times: NodeTimes;

  /**
   * Constructs TimelineNode.
   *
   * @param graph - The containing graph.
   * @param id - The node's id.
   * @param label - The node's label.
   * @param times - Node timing data (either start + end time or median + std deviation).
   */
  public constructor(
    graph: SankeyTimeline,
    id: number,
    label: string,
    times: NodeTimes,
  ) {
    this.graph = graph;
    this.id = id;
    this.label = label;
    this.times = times;
  }

  /**
   * Adds an incoming link.
   *
   * @param link - The incoming link.
   * @returns This.
   */
  public addIncomingLink(link: TimelineLink): TimelineNode {
    this.incomingLinks.push(link);
    return this;
  }

  /**
   * Adds a link leaving this node.
   *
   * @param link - The outgoing link.
   * @returns This.
   */
  public addOutgoingLink(link: TimelineLink): TimelineNode {
    this.outgoingLinks.push(link);
    return this;
  }

  /**
   * Gets all links through the node.
   *
   * @returns All links through the node.
   */
  public get links(): TimelineLink[] {
    return this.incomingLinks.concat(this.outgoingLinks);
  }

  /**
   * Sets the layout color.
   *
   * @param color The color to set.
   */
  public setColor(color: string) {
    this.layout.color = color;
  }

  /**
   * Sets the layout column.
   *
   * @param col The column to set.
   */
  public setColumn(col: number) {
    this.layout.column = col;
  }

  /**
   * Sets the layout row.
   *
   * @param row The row to set.
   */
  public setRow(row: number) {
    this.layout.row = row;
  }

  /**
   * Gets the "size" of the node based on associated links.
   *
   * @returns The size of the node.
   */
  public get size(): number {
    return Math.max(
      sum(this.incomingLinks, (link) => link.flow),
      sum(this.outgoingLinks, (link) => link.flow),
    );
  }
}
