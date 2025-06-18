import React, { type RefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { select } from 'd3-selection';
import colors from './colors';
import type TimelineNode from './TimelineNode';
import type TimelineLink from './TimelineLink';
import SankeyTimeline from './SankeyTimeline';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  type PaperProps,
  Select,
  TextField,
} from '@mui/material';
import Renderer from './Renderer';
import './style.css';

export interface Node {
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
  timeMin?: number;
  timeMax?: number;
}

export interface Link {
  actDesc: string;
  count: number;
  desc: string;
  evDesc: string;
  name: string;
}

export interface TimelineOptions {
  name: string;
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
}

interface SankeyTimelineProps {
  data: TimelineOptions;
}

// Nodes & link currently being displayed in the timeline
let nodes: Record<string, Node> = {};
let links: Record<string, Record<string, Link>> = {};

// Maps the IDs for nodes assigned by Renderer to the name of the node
const nodeIdMap: Record<number, string> = {};

// The timeline & renderer
const timeline = new SankeyTimeline();
let renderer: Renderer | null = null;

// Stores nodes that exist in the results file but are not currently displayed in the timeline to preverse their positions & colors
let nodeCache: Record<string, Node> = {};

/**
 * Renders or re-renders the timeline.
 *
 * @param data - The path results data.
 * @param svgRef - The SVG element to render in.
 * @param options - User-controlled rendering options.
 * @param keyStatesRecord - A record of enabled key states.
 * @param width - The width of the rendering area.
 * @param height - The height of the rendering area.
 */
function render(
  data: TimelineOptions,
  svgRef: RefObject<SVGSVGElement>,
  options: {
    layout: 'default' | 'timeline';
    distributions: boolean;
    fontSize: number;
    borderWidth: number;
    labelFontSize: number;
    maxNodeHeight: number;
    maxLinkWidth: number;
  },
  keyStatesRecord: Record<string, boolean>,
  width: number,
  height: number,
) {
  // An array of enabled key states
  const keyStates: string[] = [];
  Object.entries(keyStatesRecord).forEach(([name, enabled]) => {
    if (enabled) {
      keyStates.push(name);
    }
  });

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
      // Consider only the key states that have been enabled by the user
      .filter((keyState) => selectedKeyStates.includes(keyState.name))
      .forEach((keyState) => {
        // This section looks at every path leading to an enabled key state and creates nodes and links to represent those paths
        keyState.paths.forEach((path) => {
          if (!Object.prototype.hasOwnProperty.call(nodes, path.name)) {
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
            if (!Object.prototype.hasOwnProperty.call(links, path.name)) {
              links[path.name] = {};
            }
            if (!Object.prototype.hasOwnProperty.call(links[path.name], link.otherState)) {
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

  /**
   * Ensures the dragged node positions persist through re-rendering.
   * @param oldNodes - The old node dictionary.
   * @param newNodes - The new node dictionary.
   */
  function mergeNodeLayouts(oldNodes: Record<string, Node>, newNodes: Record<string, Node>) {
    const allNodes = Object.entries(nodeCache).concat(Object.entries(oldNodes));
    nodeCache = {};
    allNodes.forEach(([name, node]) => {
      if (Object.prototype.hasOwnProperty.call(newNodes, name)) {
        newNodes[name].layout = node.layout;
        newNodes[name].color = node.color;
      } else {
        nodeCache[name] = node;
      }
    });
    return newNodes;
  }

  // Process the path results file data into records of links and nodes
  const processed = preprocess(data, keyStates);
  nodes = mergeNodeLayouts(nodes, processed[0]);
  links = processed[1];

  // Create & configure the renderer
  renderer = new Renderer(timeline, svgRef);
  renderer.options.height = height - 86; // 86 is subtracted to compensate for the height of the controls
  renderer.options.width = width;
  renderer.options.dynamicNodeHeight = true;
  renderer.options.layout = options.layout;
  renderer.options.fontSize = options.fontSize;
  renderer.options.labels.borderWidth = options.borderWidth;
  renderer.options.labels.fontSize = options.labelFontSize;
  renderer.options.maxNodeHeight = options.maxNodeHeight;
  renderer.options.maxLinkWidth = options.maxLinkWidth;
  renderer.options.distributions = options.distributions;

  /**
   * Converts a timestamp string into a number of seconds since the start of the simulation.
   *
   * @param timestamp - The timestamp to convert.
   * @returns The number of seconds.
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
    const count = node.combined.n.length;
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

  // Set the title that displays when nodes and links are hovered over
  renderer.options.nodeTitle = (d: TimelineNode) =>
    `Name: ${d.label}\nCount: ${d.data.count.toString()}\nRate 5th: ${
      combined5th95th(d.data)[0].toString()
    }\nRate 95th: ${combined5th95th(d.data)[1].toString()}\nContribution Rate: ${
      d.data.contributionRate.toString()
    }\nMin Time: ${d.data.timeMin?.toString() ?? ''}\nMax Time: ${d.data.timeMax?.toString() ?? ''}\nMean Time: ${secondsToTimestamp(
      combinedMean(d.data),
    )}\nStandard Deviation: ${secondsToTimestamp(combinedStd(d.data))}\nRow: ${d.layout.row.toString()},Col: ${
      d.layout.column.toString()
    }`;
  renderer.options.linkTitle = (d: TimelineLink) =>
    `${d.data.name}\n${d.data.desc}\nAction Description: ${d.data.actDesc}\nEvent Description: ${d.data.evDesc}\nCount: ${d.data.count.toString()}`;

  /**
   * Takes the records of nodes and links and links them together using the SankeyTimeline class.
   */
  function createPaths() {
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
      nodeIdMap[timelineNode.id] = n;
    });
    Object.keys(nodes).forEach((n) => {
      if (Object.prototype.hasOwnProperty.call(links, n)) {
        Object.entries(links[n]).forEach(([otherState, data]) => {
          if (nodes[n].timelineNode !== undefined && nodes[otherState].timelineNode !== undefined) {
            const timelineLink = timeline.createLink(
              nodes[n].timelineNode,
              nodes[otherState].timelineNode,
              data.count,
            );
            timelineLink.data = data;
          }
        });
      }
    });
  }

  createPaths();

  // Listen for nodes being dragged and ensure their positions are saved
  renderer.on('positionChanged', (node, x, y) => {
    const name = nodeIdMap[node];
    if (nodes[name].layout) {
      if (options.layout === 'default') {
        nodes[name].layout.default = { x, y };
      } else {
        nodes[name].layout.timeline = { y };
      }
    } else {
      nodes[name].layout = { default: { x, y }, timeline: { y } };
    }
  });

  // Render the timeline
  renderer.render();
}

/**
 * Enables dragging on the node properties menu.
 */
const PaperComponent: React.FC<PaperProps> = (props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable nodeRef={nodeRef as unknown as RefObject<HTMLDivElement>} handle="#node-menu-title">
      <Paper {...props} ref={nodeRef}></Paper>
    </Draggable>
  );
};

/**
 * A component to display the Sankey Timeline diagram and its controls.
 * @param param0.data - The contents of the path results file.
 */
export const SankeyTimelineDiagram: React.FC<SankeyTimelineProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerElement = useRef<HTMLDivElement>(null);

  let customColors: string[] = [];
  if (data.options) {
    customColors = data.options.customColors;
  }

  // Creates a record of key states for control via checkboxes
  const allKeyStates = data.keyStates.map((state) => state.name);
  const ksRecord: Record<string, boolean> = {};
  allKeyStates.forEach((state) => {
    ksRecord[state] = true;
  });

  const [state, setState] = useState<{
    otherStates: boolean;
    timelineMode: boolean;
    distributions: boolean;
    layout: 'default' | 'timeline';
    fontSize: number;
    borderWidth: number;
    labelFontSize: number;
    maxNodeHeight: number;
    maxLinkWidth: number;
    keyStates: Record<string, boolean>;
    colorOptions: string[];
    nodeDialog: boolean;
    targetNode: number;
    customColorInput: string;
  }>({
    otherStates: false,
    timelineMode: false,
    distributions: false,
    layout: 'default',
    fontSize: data.options ? data.options.fontSize : 20,
    borderWidth: 6,
    labelFontSize: 1,
    maxNodeHeight: data.options ? data.options.maxNodeHeight : window.innerHeight / 7,
    maxLinkWidth: data.options ? data.options.maxLinkWidth : window.innerHeight / 7 / 2,
    keyStates: ksRecord,
    colorOptions: colors.concat(customColors),
    nodeDialog: false,
    targetNode: -1,
    customColorInput: '',
  });

  const {
    timelineMode,
    otherStates,
    distributions,
    layout,
    fontSize,
    borderWidth,
    labelFontSize,
    maxNodeHeight,
    maxLinkWidth,
    keyStates,
    colorOptions,
    nodeDialog,
    targetNode,
    customColorInput,
  } = state;

  useEffect(() => {
    select(svgRef.current).selectChildren().remove();
    render(
      data,
      svgRef as unknown as RefObject<SVGSVGElement>,
      {
        layout,
        distributions,
        fontSize,
        borderWidth,
        labelFontSize,
        maxNodeHeight,
        maxLinkWidth,
      },
      keyStates,
      containerElement.current?.offsetWidth ?? window.innerWidth,
      containerElement.current?.offsetHeight ?? window.innerHeight,
    );
  });

  return (
    <div ref={containerElement}>
      <FormGroup row>
        <FormControlLabel
          label="Show Timeline"
          control={
            <Checkbox
              checked={timelineMode}
              onChange={(_e, value) => {
                setState({
                  ...state,
                  timelineMode: value,
                  layout: value ? 'timeline' : 'default',
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
              onChange={(_e, value) => {
                setState({
                  ...state,
                  otherStates: value,
                });
              }}
            />
          }
        ></FormControlLabel>
        {layout === 'timeline' ? (
          <FormControlLabel
            label="Show Distributions"
            control={
              <Checkbox
                checked={distributions}
                onChange={(_e, value) => {
                  setState({
                    ...state,
                    distributions: value,
                  });
                }}
              />
            }
          ></FormControlLabel>
        ) : (
          <div></div>
        )}
      </FormGroup>
      <Button
        onClick={() => {
          setState({
            ...state,
            fontSize: fontSize * 1.1,
            borderWidth: borderWidth * 1.1,
            labelFontSize: labelFontSize * 1.1,
            maxNodeHeight: maxNodeHeight * 1.1,
            maxLinkWidth: maxLinkWidth * 1.1,
          });
        }}
      >
        Zoom In
      </Button>
      <Button
        onClick={() => {
          setState({
            ...state,
            fontSize: fontSize * 0.9,
            borderWidth: borderWidth * 0.9,
            labelFontSize: labelFontSize * 0.9,
            maxNodeHeight: maxNodeHeight * 0.9,
            maxLinkWidth: maxLinkWidth * 0.9,
          });
        }}
      >
        Zoom Out
      </Button>
      <Button
        onClick={() => {
          const pathResults = data;

          // For each key state, make sure user-set properties are set in the JSON and delete circular references
          pathResults.keyStates.forEach((path, k) => {
            path.paths.forEach((state, s) => {
              const n =
                timeline.getNodesByLabel(state.name)[0] ?? nodeCache[state.name].timelineNode;
              pathResults.keyStates[k].paths[s].layout = n.persist;
              pathResults.keyStates[k].paths[s].color = n.color;
              delete pathResults.keyStates[k].paths[s].timelineNode;
            });
          });

          // Save user preferences to the JSON
          if (renderer !== null) {
            pathResults.options = {
              customColors,
              fontSize: renderer.options.fontSize,
              // lastEditedNode: lastEditedNode,
              maxNodeHeight: renderer.options.maxNodeHeight,
              maxLinkWidth: renderer.options.maxLinkWidth,
            };
          }
          const link = document.createElement('a');
          const file = new Blob([JSON.stringify(pathResults)], {
            type: 'text/plain',
          });
          link.href = URL.createObjectURL(file);
          link.download = data.name;
          link.click();
          URL.revokeObjectURL(link.href);
        }}
      >
        Save
      </Button>
      <Button
        onClick={() => {
          setState({
            ...state,
            nodeDialog: true,
          });
        }}
      >
        Edit Node Properties
      </Button>
      <svg ref={svgRef}></svg>
      <FormGroup row>
        {allKeyStates.map((name) => {
          return (
            <FormControlLabel
              key={name}
              label={name}
              control={
                <Checkbox
                  checked={keyStates[name]}
                  onChange={(_e, value) => {
                    setState({
                      ...state,
                      keyStates: {
                        ...keyStates,
                        [name]: value,
                      },
                    });
                  }}
                />
              }
            />
          );
        })}
      </FormGroup>
      <Dialog
        open={nodeDialog}
        PaperComponent={PaperComponent}
        maxWidth="md"
        fullWidth
        onClose={() => {
          setState({
            ...state,
            nodeDialog: false,
          });
        }}
      >
        <DialogTitle id="node-menu-title" style={{ cursor: 'move' }}>
          Edit Node Properties
        </DialogTitle>
        <DialogContent>
          <br />
          <FormControl>
            <InputLabel id="node-select-label">Edit properties of</InputLabel>
            <Select
              labelId="node-select-label"
              label="Edit properties of"
              value={targetNode}
              autoWidth
              onChange={(e) => {
                setState({
                  ...state,
                  targetNode: e.target.value as number,
                });
              }}
            >
              {Object.values(nodes).map((node) => {
                return (
                  <MenuItem key={node.name} value={node.timelineNode?.id}>
                    {node.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {targetNode >= 0 ? (
            <div>
              <br />
              Set color:
              <div id="color-options">
                {colorOptions.map((color) => {
                  return (
                    <div
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => {
                        renderer?.setNodeColor(targetNode, color);
                        nodes[nodeIdMap[targetNode]].color = color;
                      }}
                    ></div>
                  );
                })}
              </div>
              Or enter a custom color:
              <div
                className="color-option"
                style={{ backgroundColor: customColorInput, width: 50 }}
              ></div>
              <Grid container>
                <TextField
                  label="Custom color"
                  value={customColorInput}
                  onChange={(e) => {
                    setState({
                      ...state,
                      customColorInput: e.target.value,
                    });
                  }}
                ></TextField>
                <Button
                  onClick={() => {
                    renderer?.setNodeColor(targetNode, customColorInput);
                    nodes[nodeIdMap[targetNode]].color = customColorInput;
                  }}
                >
                  Set Color
                </Button>
              </Grid>
            </div>
          ) : (
            <div></div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setState({
                ...state,
                nodeDialog: false,
              });
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
