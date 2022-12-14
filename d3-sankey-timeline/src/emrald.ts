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
  let timeline = new sankeyTimeline.SankeyTimeline();
  const data: {
    keyStates: {
      paths: Node[];
    }[];
    otherStatePaths: Node[];
  } = (window as any).data;
  const renderer = new sankeyTimeline.Renderer(timeline);
  renderer.options.height = window.innerHeight;
  renderer.options.width = window.innerWidth;
  renderer.options.maxNodeHeight = window.innerHeight / 7;
  renderer.options.maxLinkWidth = renderer.options.maxNodeHeight / 2;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = 1;

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
    }\nRow: ${d.layout.row},Col: ${d.layout.column}`;

  /**
   * Creates the node and link objects.
   *
   * @param otherStates If true, otherStatePaths will be included.
   */
  function createPaths(otherStates = false) {
    const nodes: Record<string, Node> = {};
    const links: Record<string, Link[]> = {};

    const processedPaths: string[] = [];
    /**
     * Process a step in a path.
     *
     * @param path - The focused path object.
     * @param paths - All paths.
     */
    function processPath(path: Node, paths: Node[]) {
      if (processedPaths.indexOf(path.name) < 0) {
        processedPaths.push(path.name);
        if (!nodes[path.name]) {
          nodes[path.name] = path;
        }
        if (!links[path.name]) {
          links[path.name] = [];
        }
        path.exits.forEach((exitPath) => {
          if (
            links[path.name]
              .map((link) => link.name)
              .indexOf(exitPath.otherState) < 0
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
    }

    data.keyStates.forEach((keyState) => {
      processPath(
        keyState.paths.find((path) => path.entries.length === 0) as Node,
        keyState.paths,
      );
    });
    if (otherStates) {
      data.otherStatePaths
        .filter((state) => state.entries.length === 0)
        .forEach((state) => {
          processPath(state, data.otherStatePaths);
        });
    }
    timeline.clear();
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
    Object.keys(nodes).forEach((n) => {
      links[n].forEach((link) => {
        timeline.createLink(
          nodes[n].timelineNode,
          nodes[link.name].timelineNode,
          link.count,
        );
      });
    });
  }

  createPaths();
  renderer.render(select('svg'));

  /**
   * Forcibly re-renders the diagram.
   */
  function reRender() {
    selectAll('svg > *').remove();
    renderer.render(select('svg'));
  }

  (window as any).toggleTimelineMode = (value: boolean) => {
    if (value) {
      renderer.options.layout = 1;
    } else {
      renderer.options.layout = 0;
    }
    reRender();
  };

  (window as any).toggleOtherStatesMode = (value: boolean) => {
    createPaths(value);
    reRender();
  };

  (window as any).zoomIn = () => {
    renderer.options.fontSize *= 1.1;
    renderer.options.maxNodeHeight *= 1.1;
    renderer.options.maxLinkWidth *= 1.1;
    reRender();
  };

  (window as any).zoomOut = () => {
    renderer.options.fontSize *= 0.9;
    renderer.options.maxNodeHeight *= 0.9;
    renderer.options.maxLinkWidth *= 0.9;
    reRender();
  };

  (window as any).saveDiagram = () => {
    
  };

  window.addEventListener('resize', () => {
    renderer.options.width = window.innerWidth;
    renderer.options.height = window.innerHeight;
    renderer.options.maxNodeHeight = window.innerHeight / 7;
    renderer.options.maxLinkWidth = renderer.options.maxNodeHeight / 2;
    renderer.options.fontSize = 25;
    reRender();
  });
}
