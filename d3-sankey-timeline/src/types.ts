import type TimelineLink from './TimelineLink';
import type TimelineNode from './TimelineNode';

export interface TimelineGraph {
  links: TimelineLink[];
  nodes: TimelineNode[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface NodeLayout extends Coordinate {
  column: number;
  distribution?: Coordinate[];
  height: number;
  row: number;
  width: number;
}

export interface LinkLayout {
  curve: number[][];
  path: string;
  width: number;
}
export interface NodeTimes {
  endTime: number;
  meanTime?: number;
  startTime: number;
  stdDeviation?: number;
}

export type Layout = 'default' | 'fixed';
