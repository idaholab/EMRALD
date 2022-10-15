import { select, selectAll } from 'd3-selection';
import type TimelineNode from './TimelineNode';
import * as sankeyTimeline from './index';

type Node = {
  entries: {
    cnt: number;
  }[];
  exits: {
    cnt: number;
    otherState: string;
  }[];
  name: string;
  timelineNode: TimelineNode;
  timeMean: string;
  timeStdDeviation: string;
};

type Link = {
  count: number;
  name: string;
};

/**
 * Reads the data & displays the Sankey diagram.
 */
export default function main() {
  const timeline = new sankeyTimeline.SankeyTimeline();
  const data: {
    keyStates: {
      paths: Node[];
    }[];
  } = (window as any).data;
  const renderer = new sankeyTimeline.Renderer(timeline);
  renderer.options.height = 750;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = 1;

  const nodes: Record<string, Node> = {};
  const links: Record<string, Link[]> = {};

  /**
   * Converts the timestamp string from the data into a number of seconds since the start.
   *
   * @param timestamp - The timestamp to convert.
   * @returns The number of seconds since 0 of the timestamp.
   */
  function timestampToSeconds(timestamp: string) {
    const t = timestamp.split(':').map((x) => Number(x));
    return t[2] + t[1] * 60 + t[0] * 3600;
  }

  renderer.options.nodeTitle = (d: TimelineNode) =>
    `Name: ${d.label}\nCount: ${d.data.count}\nRate 5th: ${
      d.data.cRate5th
    }\nRate 95th: ${d.data.cRate95th}\nContribution Rate: ${
      d.data.contributionRate
    }\nMin Time: ${d.data.timeMin}\nMax Time: ${d.data.timeMax}\nMean Time: ${
      d.data.timeMean
    } (${timestampToSeconds(d.data.timeMean)} s)\nStandard Deviation: ${
      d.data.timeStdDeviation
    }`;

  /**
   * Process a step in a path.
   *
   * @param path - The focused path object.
   * @param paths - All paths.
   */
  function processPath(path: Node, paths: Node[]) {
    if (!nodes[path.name]) {
      nodes[path.name] = path;
    }
    if (!links[path.name]) {
      links[path.name] = [];
    }
    path.exits.forEach((exitPath) => {
      if (
        links[path.name].map((link) => link.name).indexOf(exitPath.otherState) <
        0
      ) {
        links[path.name].push({
          count: exitPath.cnt,
          name: exitPath.otherState,
        });
      }
      processPath(
        paths.find((p) => p.name === exitPath.otherState) as Node,
        paths,
      );
    });
  }

  // Find nodes and link sin the data.
  data.keyStates.forEach((keyState) => {
    processPath(
      keyState.paths.find((path) => path.entries.length === 0) as Node,
      keyState.paths,
    );
  });

  // Create corresponding nodes timeline.
  Object.keys(nodes).forEach((n) => {
    const node = nodes[n];
    let start = timestampToSeconds(node.timeMean) - 2500;
    if (start < 0) {
      start = 0;
    }
    nodes[n].timelineNode = timeline.createNode(node.name, {
      endTime: timestampToSeconds(node.timeMean) + 2500,
      meanTime: timestampToSeconds(node.timeMean),
      startTime: start,
      stdDeviation: timestampToSeconds(node.timeStdDeviation),
    });
    nodes[n].timelineNode.data = node;
  });

  // Now that the TimelineNodes have been created, create links between them.
  Object.keys(nodes).forEach((n) => {
    links[n].forEach((link) => {
      timeline.createLink(
        nodes[n].timelineNode,
        nodes[link.name].timelineNode,
        link.count,
      );
    });
  });

  renderer.render(select('svg'));

  (window as any).toggleTimelineMode = (value: boolean) => {
    if (value) {
      renderer.options.layout = 1;
    } else {
      renderer.options.layout = 0;
    }
    selectAll('svg > *').remove();
    renderer.render(select('svg'));
  };
}
