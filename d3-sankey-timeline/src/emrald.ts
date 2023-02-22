import { select, selectAll } from 'd3-selection';
import type TimelineNode from './TimelineNode';
import * as sankeyTimeline from './index';
import TimelineLink from './TimelineLink';

type Node = {
  count: number;
  contributionRate: number;
  entries: {
    cnt: number;
  }[];
  exits: {
    cnt: number;
    desc: string;
    name: string;
    otherState: string;
    evDesc: string;
    actDesc: string;
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
  combined: {
    c: number[];
    n: number[];
    x: number[];
    s: number[];
  };
};

type Link = {
  actDesc: string;
  count: number;
  desc: string;
  evDesc: string;
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
  ): [Record<string, Node>, Record<string, Record<string, Link>>] {
    const nodes: Record<string, Node> = {};
    const links: Record<string, Record<string, Link>> = {};
    input.keyStates
      .filter((keyState) => selectedKeyStates.indexOf(keyState.name) >= 0)
      .forEach((keyState) => {
        keyState.paths.forEach((path) => {
          if (!nodes[path.name]) {
            nodes[path.name] = {
              ...path,
              combined: {
                c: [path.count],
                n: [path.count / path.contributionRate],
                x: [timestampToSeconds(path.timeMean)],
                s: [timestampToSeconds(path.timeStdDeviation)],
              },
            };
          } else {
            nodes[path.name].count += path.count;
            nodes[path.name].combined.c.push(path.count);
            nodes[path.name].combined.n.push(
              path.count / path.contributionRate,
            );
            nodes[path.name].combined.x.push(timestampToSeconds(path.timeMean));
            nodes[path.name].combined.s.push(
              timestampToSeconds(path.timeStdDeviation),
            );
          }
          path.exits.forEach((link) => {
            if (!links[path.name]) {
              links[path.name] = {};
            }
            if (!links[path.name][link.otherState]) {
              links[path.name][link.otherState] = {
                actDesc: link.actDesc,
                count: link.cnt,
                desc: link.desc,
                evDesc: link.evDesc,
                name: link.name,
              };
            } else {
              links[path.name][link.otherState].count += link.cnt;
            }
          });
        });
      });
    return [nodes, links];
  }
  let nodes: Record<string, Node> = {};
  let links: Record<string, Record<string, Link>> = {};
  data.keyStates.forEach((keyState) => {
    // TODO: are key state names unique?
    keyStates.push(keyState.name);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.setAttribute('data-state', keyState.name);
    checkbox.addEventListener('change', function handleCheck() {
      toggleKeyState(this.getAttribute('data-state') as string);
      const newData = preprocess(data, keyStates);
      nodes = newData[0];
      links = newData[1];
      createPaths();
      reRender();
    });
    const label = document.createTextNode(keyState.name);
    keyStateOptions?.appendChild(checkbox);
    keyStateOptions?.appendChild(label);
  });
  const processed = preprocess(data, keyStates);
  nodes = processed[0];
  links = processed[1];
  const renderer = new sankeyTimeline.Renderer(timeline);
  renderer.options.height = window.innerHeight;
  renderer.options.width = window.innerWidth;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = 'default';
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

  /**
   * Converts the number of seconds since the start to a timestamp string.
   *
   * @param seconds - The seconds to convert.
   * @returns The timestamp string.
   */
  function secondsToTimestamp(seconds: number) {
    const hours = seconds % (60 * 3600);
    const minutes = (seconds - hours) % 60;
    return `${hours}:${minutes}:${seconds - hours - minutes}`;
  }

  /**
   * Calculates the combined time mean.
   *
   * @param node - The node to calculate for.
   * @returns The combined time mean.
   */
  function combinedMean(node: Node) {
    let weighedSum = 0;
    let nTotal = 0;
    node.combined.n.forEach((n, i) => {
      weighedSum += n * node.combined.x[i];
      nTotal += n;
    });
    return weighedSum / nTotal;
  }

  /**
   * Calculates the combined standard deviation.
   *
   * @param node - The node to calculate for.
   * @returns The combined standard deviation.
   */
  function combinedStd(node: Node) {
    let weighedSum = 0;
    let nTotal = 0;
    let count = node.combined.n.length;
    node.combined.n.forEach((n, i) => {
      weighedSum += (n - 1) * node.combined.s[i] ** 2;
      nTotal += n;
    });
    return Math.sqrt(weighedSum / (nTotal - count));
  }

  /**
   * Calculates the combined 5th & 95th count rates.
   *
   * @param node - The node to calculate for.
   * @returns The combined 5th & 95th count rates.
   */
  function combined5th95th(node: Node) {
    let cTotal = 0;
    let nTotal = 0;
    node.combined.n.forEach((n, i) => {
      cTotal += node.combined.c[i];
      nTotal += n;
    });
    const p = cTotal / nTotal;
    const cRate5th = p - 1.96 * Math.sqrt((p * (1 - p)) / nTotal);
    const cRate95th = p + 1.96 * Math.sqrt((p * (1 - p)) / nTotal);
    return [cRate5th, cRate95th];
  }

  renderer.options.nodeTitle = (d: TimelineNode) =>
    `Name: ${d.label}\nCount: ${d.data.count}\nRate 5th: ${
      combined5th95th(d.data)[0]
    }\nRate 95th: ${combined5th95th(d.data)[1]}\nContribution Rate: ${
      d.data.contributionRate
    }\nMin Time: ${d.data.timeMin}\nMax Time: ${
      d.data.timeMax
    }\nMean Time: ${secondsToTimestamp(combinedMean(d.data))} (${combinedMean(
      d.data,
    )} s)\nStandard Deviation: ${combinedStd(d.data)}\nRow: ${
      d.layout.row
    },Col: ${d.layout.column}`;
  renderer.options.linkTitle = (d: TimelineLink) =>
    `${d.data.name}\n${d.data.desc}\nAction Description: ${d.data.actDesc}\nEvent Description: ${d.data.evDesc}\nCount: ${d.data.count}`;

  /**
   * Creates the node and link objects.
   *
   * @param otherStates If true, otherStatePaths will be included.
   */
  function createPaths(otherStates = false) {
    /*
    TODO: fix this
    if (otherStates) {
      data.otherStatePaths
        .filter((state) => state.entries.length === 0)
        .forEach((state) => {
          processPath(state, data.otherStatePaths, []);
        });
    }
    */
    timeline.clear();
    Object.keys(nodes).forEach((n) => {
      const node = nodes[n];
      let start = combinedMean(node) - 2500;
      if (start < 0) {
        start = 0;
      }
      const timelineNode = timeline.createNode(node.name, {
        endTime: combinedMean(node) + 2500,
        meanTime: combinedMean(node),
        startTime: start,
        stdDeviation: combinedStd(node),
      });
      timelineNode.data = node;
      if (node.layout) {
        timelineNode.persist = node.layout;
      }
      nodes[n].timelineNode = timelineNode;
    });
    Object.keys(nodes).forEach((n) => {
      if (links[n]) {
        Object.entries(links[n]).forEach(([otherState, data]) => {
          const timelineLink = timeline.createLink(
            nodes[n].timelineNode as TimelineNode,
            nodes[otherState].timelineNode as TimelineNode,
            data.count,
          );
          timelineLink.data = data;
        });
      }
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
      renderer.options.layout = 'default';
    } else {
      renderer.options.layout = 'timeline';
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
