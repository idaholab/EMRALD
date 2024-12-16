import React, { useRef, useState } from 'react';
import { select, selectAll } from 'd3-selection';
import colors from './colors';
import type TimelineNode from './TimelineNode';
import TimelineLink from './TimelineLink';
import SankeyTimeline from './SankeyTimeline';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import Renderer from './Renderer';

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
  color?: string;
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
    customColors: string[];
    fontSize: number;
    lastEditedNode?: string;
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

type SankeyTimelineProps = {
  data: TimelineOptions;
};

export const SankeyTimelineDiagram: React.FC<SankeyTimelineProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [state, setState] = useState({
    otherStates: false,
    timelineMode: false,
  });

  const timeline = new SankeyTimeline();
  let customColors: string[] = [];

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
            nodes[path.name].combined.n.push(path.count / path.contributionRate);
            nodes[path.name].combined.x.push(timestampToSeconds(path.timeMean));
            nodes[path.name].combined.s.push(timestampToSeconds(path.timeStdDeviation));
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
  });

  const processed = preprocess(data, keyStates);
  nodes = processed[0];
  links = processed[1];
  const renderer = new Renderer(timeline, svgRef);
  renderer.options.height = window.innerHeight;
  renderer.options.width = window.innerWidth;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = 'default';
  if (data.options) {
    customColors = data.options.customColors;
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
    return new Date(seconds * 1000).toISOString().slice(11, 19);
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
    if (nTotal - count === 0) {
      return timestampToSeconds(node.timeStdDeviation);
    }
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
    }\nMin Time: ${d.data.timeMin}\nMax Time: ${d.data.timeMax}\nMean Time: ${secondsToTimestamp(
      combinedMean(d.data),
    )}\nStandard Deviation: ${secondsToTimestamp(combinedStd(d.data))}\nRow: ${d.layout.row},Col: ${
      d.layout.column
    }`;
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
      const timelineNode = timeline.createNode(
        node.name,
        {
          endTime: combinedMean(node) + 2500,
          meanTime: combinedMean(node),
          startTime: start,
          stdDeviation: combinedStd(node),
        },
        node.color,
      );
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
  let lastEditedNode = `${timeline.graph.nodes[0].id}`;
  if (data.options?.lastEditedNode) {
    lastEditedNode = data.options.lastEditedNode;
  }
  renderer.render();

  /**
   * Forcibly re-renders the diagram.
   */
  function reRender() {
    select(svgRef.current).selectChildren().remove();
    renderer.render();
  }

  const { timelineMode, otherStates } = state;

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          label="Show Timeline"
          control={
            <Checkbox
              checked={timelineMode}
              onChange={(e, value) => {
                if (timelineMode) {
                  renderer.options.layout = 'default';
                } else {
                  renderer.options.layout = 'timeline';
                }
                reRender();
                setState({
                  ...state,
                  timelineMode: value,
                });
              }}
            />
          }
        ></FormControlLabel>
        <FormControlLabel
          label="Show Other State Paths"
          control={
            <Checkbox
              checked={otherStates}
              onChange={(e, value) => {
                createPaths(value);
                reRender();
                setState({
                  ...state,
                  otherStates: value,
                });
              }}
            />
          }
        ></FormControlLabel>
      </FormGroup>
      <Button
        onClick={() => {
          renderer.options.fontSize *= 1.1;
          renderer.options.labels.borderWidth *= 1.1;
          renderer.options.labels.fontSize *= 1.1;
          renderer.options.maxNodeHeight *= 1.1;
          renderer.options.maxLinkWidth *= 1.1;
          reRender();
        }}
      >
        Zoom In
      </Button>
      <Button
        onClick={() => {
          renderer.options.fontSize *= 0.9;
          renderer.options.labels.borderWidth *= 0.9;
          renderer.options.labels.fontSize *= 0.9;
          renderer.options.maxNodeHeight *= 0.9;
          renderer.options.maxLinkWidth *= 0.9;
          reRender();
        }}
      >
        Zoom Out
      </Button>
      <Button
        onClick={() => {
          const pathResults = data;
          pathResults.keyStates.forEach((path, k) => {
            path.paths.forEach((state, s) => {
              const n = timeline.getNodesByLabel(state.name)[0];
              pathResults.keyStates[k].paths[s].layout = n.persist;
              pathResults.keyStates[k].paths[s].color = n.color;
              delete pathResults.keyStates[k].paths[s].timelineNode;
            });
          });
          pathResults.options = {
            customColors,
            fontSize: renderer.options.fontSize,
            lastEditedNode: lastEditedNode,
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
        }}
      >
        Save
      </Button>
      <svg ref={svgRef}></svg>
      <FormGroup>
        {keyStates.map((name) => {
          return <FormControlLabel key={name} label={name} control={<Checkbox />} />;
        })}
      </FormGroup>
    </div>
  );

  /**
   * Helper function to populate the color pickers.
   *
   * @param parent - The node to creat the options in.
   * @param colors - The colors to create options for.
   * @param targetNode - The node to update when a color is picked.
   *
  function createColorOptions(parent: HTMLDivElement, colors: string[], targetNode: TimelineNode) {
    parent.innerHTML = '';
    colors.forEach((color) => {
      const option = document.createElement('div');
      option.classList.add('color-option');
      option.style.backgroundColor = color;
      option.setAttribute('title', color);
      option.addEventListener('click', () => {
        renderer.setNodeColor(targetNode.id, color);
      });
      parent.appendChild(option);
    });
  }

  const colorInput = $<HTMLInputElement>('color-custom-input');

  /**
   * Selects which node to edit when the dropdown is changed.
   * @param id - The selected ID.
   *
  function selectNodeToEdit(id: string) {
    lastEditedNode = id;
    (document.getElementById('node-options') as HTMLSelectElement).value = id;
    createColorOptions($('color-options'), colors, timeline.getNode(Number(id)));
    createColorOptions($('color-custom-options'), customColors, timeline.getNode(Number(id)));
    $('set-custom-color').onclick = () => {
      const color = colorInput.value;
      renderer.setNodeColor(Number(id), color);
      if (customColors.indexOf(color) < 0) {
        customColors.push(color);
      }
    };
  }

  (window as any).showNodeMenu = () => {
    $('node-menu-container').style.display = 'block';
    $('node-options').innerHTML = '';
    timeline.graph.nodes
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      })
      .forEach((node) => {
        const option = document.createElement('option');
        option.innerText = node.label;
        option.setAttribute('value', `${node.id}`);
        $('node-options').appendChild(option);
      });
    selectNodeToEdit(lastEditedNode);
    $<HTMLSelectElement>('node-options').addEventListener('change', function () {
      selectNodeToEdit(this.value);
    });
  };

  colorInput.addEventListener('keyup', () => {
    colorInput.style.color = colorInput.value;
  });

  $('close-menu').addEventListener('click', () => {
    reRender();
    $('node-menu-container').style.display = 'none';
  });

  /**
   * Enables dragging an element.
   * Adapted from https://www.w3schools.com/howto/howto_js_draggable.asp.
   *
   * @param elmnt - The element to drag.
   *
  function dragElement(elmnt: HTMLDivElement) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if ($(elmnt.id + '-handle')) {
      // if present, the header is where you move the DIV from:
      $(elmnt.id + '-handle').onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: MouseEvent) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = `${e.clientY}px`;
      elmnt.style.left = `${e.clientX}px`;
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  dragElement($('node-menu'));
  */
};
