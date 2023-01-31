import { select, selectAll } from 'd3-selection';
import type TimelineNode from './TimelineNode';
import * as sankeyTimeline from './index';

type Node = {
  count: number;
  entries: {
    cnt: number;
  }[];
  exits: {
    cnt: number;
    name: string;
    otherState: string;
  }[];
  layout?: {
    default: {
      x: number;
      y: number;
    };
    timeline: {
      y: number;
    };
  };
  name: string;
  timelineNode?: TimelineNode;
  timeMean: string;
  timeStdDeviation: string;
};

type Link = {
  count: number;
  name: string;
};

type TimelineOptions = {
  fileName: string;
  keyStates: {
    name: string;
    paths: Node[];
  }[];
  options?: {
    fontSize: number;
    maxNodeHeight: number;
    maxLinkWidth: number;
  };
  otherStatePaths: Node[];
};

/**
 * Preprocesses path results for the selected key states.
 *
 * @param input The original data.
 * @param selectedKeyStates Key states to include.
 * @returns The processed data.
 */
function preprocess(
  input: TimelineOptions,
  selectedKeyStates: string[],
): [Record<string, Node>, Record<string, Record<string, number>>] {
  const nodes: Record<string, Node> = {};
  const links: Record<string, Record<string, number>> = {};
  input.keyStates
    .filter((keyState) => selectedKeyStates.indexOf(keyState.name) >= 0)
    .forEach((keyState) => {
      keyState.paths.forEach((path) => {
        if (!nodes[path.name]) {
          nodes[path.name] = {...path};
          links[path.name] = {};
        } else {
          nodes[path.name].count += path.count;
        }
        path.exits.forEach((link) => {
          if (!links[path.name][link.otherState]) {
            links[path.name][link.otherState] = link.cnt;
          } else {
            links[path.name][link.otherState] += link.cnt;
          }
        });
      });
    });
  return [nodes, links];
}

const keyStates: string[] = [];

function toggleKeyState(stateName: string) {
  const idx = keyStates.indexOf(stateName);
  if (idx < 0) {
    keyStates.push(stateName);
  } else {
    keyStates.splice(idx, 1);
  }
}

/**
 * Reads the data & displays the Sankey diagram.
 */
export default function main() {
  let timeline = new sankeyTimeline.SankeyTimeline();
  const data: TimelineOptions = (window as any).data;
  const keyStateOptions = document.getElementById('keyStateOptions');
  data.keyStates.forEach((keyState) => {
    // TODO: are key state names unique?
    keyStates.push(keyState.name);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.setAttribute('data-state', keyState.name);
    checkbox.addEventListener('change', function handleCheck() {
      toggleKeyState(this.getAttribute('data-state') as string);
      console.log(keyStates);
    });
    const label = document.createTextNode(keyState.name);
    keyStateOptions?.appendChild(checkbox);
    keyStateOptions?.appendChild(label);
  });
  const [nodes, links] = preprocess(data, keyStates);
  console.log(nodes);
  const renderer = new sankeyTimeline.Renderer(timeline);
  renderer.options.height = window.innerHeight;
  renderer.options.width = window.innerWidth;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = 1;
  if (data.options) {
    renderer.options.fontSize = data.options.fontSize;
    renderer.options.maxNodeHeight = data.options.maxNodeHeight;
    renderer.options.maxLinkWidth = data.options.maxLinkWidth;
  } else {
    renderer.options.maxNodeHeight = window.innerHeight / 7;
    renderer.options.maxLinkWidth = renderer.options.maxNodeHeight / 2;
  }

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
    /**
     * Process a step in a path.
     *
     * @param path - The focused path object.
     * @param paths - All paths.
     */
    function processPath(path: Node, paths: Node[], processedPaths: string[]) {
      if (processedPaths.indexOf(path.name) < 0) {
        path.exits.forEach((exitPath) => {
          if (
            !links[path.name][exitPath.otherState]
          ) {
            links[path.name][exitPath.otherState] = exitPath.cnt;
          }
          processPath(
            paths.find((p) => p.name === exitPath.otherState) as Node,
            paths,
            [...processedPaths, path.name],
          );
        });
      }
    }

    data.keyStates.forEach((keyState) => {
      processPath(
        keyState.paths.find((path) => path.entries.length === 0) as Node,
        keyState.paths,
        [],
      );
    });
    if (otherStates) {
      data.otherStatePaths
        .filter((state) => state.entries.length === 0)
        .forEach((state) => {
          processPath(state, data.otherStatePaths, []);
        });
    }
    timeline.clear();
    Object.keys(nodes).forEach((n) => {
      const node = nodes[n];
      let start = timestampToSeconds(node.timeMean) - 2500;
      if (start < 0) {
        start = 0;
      }
      const timelineNode = timeline.createNode(node.name, {
        endTime: timestampToSeconds(node.timeMean) + 2500,
        meanTime: timestampToSeconds(node.timeMean),
        startTime: start,
        stdDeviation: timestampToSeconds(node.timeStdDeviation),
      });
      timelineNode.data = node;
      if (node.layout) {
        timelineNode.persist = node.layout;
      }
      nodes[n].timelineNode = timelineNode;
    });
    Object.keys(nodes).forEach((n) => {
      links[n].forEach((link) => {
        timeline.createLink(
          nodes[n].timelineNode as TimelineNode,
          nodes[link.name].timelineNode as TimelineNode,
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
    const pathResults = data;
    pathResults.keyStates.forEach((path, k) => {
      path.paths.forEach((state, s) => {
        pathResults.keyStates[k].paths[s].layout = timeline.getNodesByLabel(
          state.name,
        )[0].persist;
        delete pathResults.keyStates[k].paths[s].timelineNode;
      });
    });
    pathResults.options = {
      fontSize: renderer.options.fontSize,
      maxNodeHeight: renderer.options.maxNodeHeight,
      maxLinkWidth: renderer.options.maxLinkWidth,
    };
    const link = document.createElement('a');
    const file = new Blob([JSON.stringify(pathResults)], {
      type: 'text/plain',
    });
    link.href = URL.createObjectURL(file);
    link.download = data.fileName;
    link.click();
    URL.revokeObjectURL(link.href);
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
