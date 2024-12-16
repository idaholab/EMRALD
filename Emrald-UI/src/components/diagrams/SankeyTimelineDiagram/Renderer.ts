import { Bezier } from 'bezier-js';
import { color, type RGBColor } from 'd3-color';
import { drag } from 'd3-drag';
import { easeCubicIn } from 'd3-ease';
import { type BaseType, select, selectAll, type Selection } from 'd3-selection';
import { type Transition, transition } from 'd3-transition';
import colors from './colors';
import type SankeyTimeline from './SankeyTimeline';
import type TimelineLink from './TimelineLink';
import type TimelineNode from './TimelineNode';
import type { Coordinate, TimelineGraph } from './types';
import { hasDist } from './util';

/**
 * Renders the chart using D3.
 */
export default class Renderer {
  private graph: TimelineGraph = {
    links: [],
    nodes: [],
  };

  public options = {
    axis: {
      color: 'rgba(0,0,0,0.25)',
      fontSize: 8,
      height: 2,
      margin: 8,
      tick: {
        height: 12,
        width: 3,
      },
    },
    background: 'white',
    curve: {
      height: 50,
      width: 200,
    },
    distHandle: {
      color: 'rgb(0,0,0)',
      width: 3,
    },
    distributions: true,
    dynamicLinkWidth: true,
    dynamicNodeHeight: false,
    fadeOpacity: 0.3,
    fontColor: 'white',
    fontSize: 20,
    height: window.innerHeight,
    labels: {
      fontSize: 1,
      borderWidth: 6,
    },
    layout: 'default',
    linkTitle: (d: TimelineLink) =>
      `${d.source.label} → ${d.target.label}\n${d.flow}`,
    margin: 60,
    maxLinkWidth: 50,
    maxNodeHeight: 100,
    meanBar: {
      color: 'rgba(0,0,0,0.25)',
      width: 3,
    },
    nodeTitle: (d: TimelineNode): string => d.label,
    ticks: 25,
    transitionSpeed: 75,
    width: window.innerWidth,
  };

  private maxRight = 0;

  private range: [number, number];

  private shift = 0;

  private container!: Selection<BaseType, HTMLElement, BaseType, any>;

  /**
   * Constructs Renderer.
   * @param timeline - The timeline to render.
   * @param container - The SVG element to render within.
   */
  public constructor(
    private timeline: SankeyTimeline,
    svgRef: React.RefObject<SVGSVGElement>,
  ) {
    this.range = [
      this.options.margin,
      this.options.width - this.options.margin,
    ];
    this.container = select<BaseType, HTMLElement>(svgRef.current);
  }

  /**
   * Calculates a bezier curve for the given link.
   * @param link - The link to calculate for.
   * @returns The bezier curve.
   */
  private calculateCurve(link: TimelineLink) {
    const y = link.source.layout.y + link.source.layout.height / 2;
    const x = link.source.layout.x + link.source.layout.width;
    const y1 = link.target.layout.y + link.target.layout.height / 2;
    return [
      [x, y],
      [x + this.options.curve.width, y],
      [link.target.layout.x - this.options.curve.width, y1],
      [link.target.layout.x, y1],
    ];
  }

  /**
   * Calculates timeline link paths based on node's X and Y coordinates.
   */
  private calculateLinkPaths(): void {
    this.graph.links.forEach((link, l) => {
      let width = this.options.maxLinkWidth;
      if (this.timeline.maxFlow !== 0 && this.options.dynamicLinkWidth) {
        width *= link.flow / this.timeline.maxFlow;
      }
      this.graph.links[l].layout = {
        path: this.getCurvePath(link),
        width,
      };
    });
  }

  /**
   * Given the bounds of the container to render in,
   * construct a clone of the graph with all measurements adjusted to fit in the given range.
   */
  private calculateLayout() {
    const cols: TimelineNode[][] = [];
    const colWidths: number[] = [];
    const colXs: number[] = [];
    const maxCols: number[] = [];
    let maxColumn = -1;
    let maxRow = -1;
    /**
     * Assigns columns along a path.
     *
     * @param source The current source node.
     * @param currentCol The current row number.
     */
    const assignColumns = (source: TimelineNode, currentCol: number) => {
      if (source.layout.column < 0) {
        if (currentCol >= cols.length) {
          cols.push([]);
          maxCols.push(0);
          colWidths.push(0);
          colXs.push(0);
        }
        if (currentCol > maxColumn) {
          maxColumn = currentCol;
        }
        source.setColumn(currentCol);
        cols[currentCol].push(source);
        if (source.textWidth > colWidths[currentCol]) {
          colWidths[currentCol] = source.textWidth;
        }
        source.outgoingLinks.forEach((link) => {
          assignColumns(link.target, currentCol + 1);
        });
      }
    };
    this.timeline.sourceNodes.forEach((sourceNode) => {
      assignColumns(sourceNode, 0);
    });
    for (let i = 1; i < colWidths.length; i += 1) {
      colXs[i] = colXs[i - 1] + colWidths[i - 1];
    }
    cols.forEach((col) => {
      for (let r = 0; r < col.length; r += 1) {
        col[r].layout.row = r;
        if (r > maxRow) {
          maxRow = r;
        }
      }
    });
    let currentColor = 0;
    this.graph.nodes.forEach((node) => {
      if (typeof node.color === 'string') {
        node.setColor(node.color);
      } else {
        node.setColor(colors[currentColor]);
        currentColor += 1;
        if (currentColor >= colors.length) {
          currentColor = 0;
        }
      }
      if (this.options.layout === 'default') {
        if (node.persist) {
          node.layout.x = node.persist.default.x;
          node.layout.y = node.persist.default.y;
        } else {
          node.layout.x = colXs[node.layout.column];
          node.layout.y =
            (node.layout.row / (maxRow + 1)) * this.options.height;
        }
      } else if (this.options.layout === 'timeline') {
        node.layout.x =
          this.getTimeX(node.times.meanTime) - node.layout.width / 2;
        if (node.persist) {
          node.layout.y = node.persist.timeline.y;
        } else {
          node.layout.y =
            (node.layout.row / (maxRow + 1)) * this.options.height;
        }
      }
      if (node.layout.x + node.layout.width > this.maxRight) {
        this.maxRight = node.layout.x + node.layout.width;
      }
    });
  }

  /**
   * Shifts the layout to prevent things from going off the left hand side.
   */
  private calculateShift() {
    let minX = Infinity;
    this.graph.links.forEach((link) => {
      const x = this.getCurveExtrema(link)[0];
      if (x < minX) {
        minX = x;
      }
    });
    if (minX < 0) {
      const shift = 0 - minX;
      this.graph.nodes.forEach((node, n) => {
        this.graph.nodes[n].layout.x += shift;
        let right = this.graph.nodes[n].layout.x;
        if (hasDist(node.times) && this.options.distributions) {
          node.layout.distribution = [
            {
              x:
                shift +
                this.getTimeX(
                  node.times.meanTime - (node.times.stdDeviation || 0),
                ),
              y: node.layout.y,
            },
            {
              x:
                shift +
                this.getTimeX(
                  node.times.meanTime + (node.times.stdDeviation || 0),
                ),
              y: node.layout.y,
            },
          ];
        }
        right = (this.graph.nodes[n].layout.distribution as Coordinate[])[1].x;
        if (right > this.maxRight) {
          this.maxRight = node.layout.x + node.layout.width;
        }
      });
      this.shift = shift;
    }
  }

  /**
   * Places nodes in their initial positions.
   */
  private initializeLayout() {
    this.graph.nodes.forEach((node, n) => {
      const x = this.getTimeX(node.times.meanTime);
      let height = this.options.maxNodeHeight;
      if (this.options.dynamicNodeHeight) {
        height *= node.size / this.timeline.maxSize;
      }
      this.graph.nodes[n].layout = {
        baseRow: 0,
        color: node.color || '',
        column: -1,
        height,
        row: -1,
        width: node.layout.width,
        x,
        y: 0,
      };
    });
  }

  /**
   * Calculates the width of the nodes to accomodate the size of their text.
   */
  private calculateLabelSizes() {
    this.container
      .append('g')
      .selectAll('g')
      .data(this.timeline.graph.nodes)
      .join('g')
      .append('text')
      .data(this.timeline.graph.nodes)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('x', '-1000')
      .style('font-size', `${this.options.fontSize}px`)
      .text((d: TimelineNode) => d.label)
      .each(function (d: TimelineNode) {
        d.textHeight = this.getBBox().height;
        d.textWidth = this.getBBox().width;
        d.layout.width = d.textWidth;
      });
  }

  /**
   * Renders the graph.
   */
  public render() {
    this.graph = this.timeline.graph;
    this.range = [
      this.options.margin,
      this.options.width - this.options.margin,
    ];
    this.container
      .style('background', this.options.background)
      .style('width', Math.max(this.options.width, this.maxRight))
      .style('height', this.options.height)
      .style('top', '23px')
      .style('position', 'relative');
    this.calculateLabelSizes();
    this.initializeLayout();
    this.calculateLayout();
    this.calculateLinkPaths();
    this.calculateShift();
    this.calculateLinkPaths(); // Reposition links after shifting
    if (this.options.layout === 'timeline') {
      this.createAxis();
    }
    this.createLinks();
    this.createNodes();
    this.expandToContent();
    this.createLabelBoxes();
    if (this.options.layout === 'timeline') {
      this.createDistributionHandles();
    }
    this.createNodeLabels();
    this.createLinkLabels();
    return this.container;
  }

  /**
   * Creates the axis.
   */
  private createAxis() {
    const axisContainer = this.container.append('g').style('width', '100%');
    axisContainer
      .append('rect')
      .attr('width', '100%')
      .attr('height', this.options.axis.height)
      .attr('fill', this.options.axis.color);
    const tickInterval = Math.round(
      (this.timeline.maxTime - this.timeline.minTime) / this.options.ticks,
    );
    for (
      let i = this.timeline.minTime;
      i <= this.timeline.maxTime + 1;
      i += 1
    ) {
      if (i % tickInterval === 0) {
        const x = this.getTimeX(i);
        const renderer = this;
        axisContainer
          .append('text')
          .text(new Date(Math.round(i) * 1000).toISOString().slice(11, 19))
          .attr('font-size', this.options.axis.fontSize)
          .attr('x', function () {
            return renderer.shift + x - this.getBBox().width / 2;
          })
          .attr(
            'y',
            this.options.axis.height +
              this.options.axis.tick.height +
              this.options.axis.margin,
          );
        axisContainer
          .append('rect')
          .style(
            'height',
            this.options.axis.tick.height - this.options.axis.height,
          )
          .style('width', this.options.axis.tick.width)
          .attr('x', this.shift + x)
          .attr('y', this.options.axis.height)
          .attr('fill', this.options.axis.color);
      }
    }
  }

  /**
   * Creates links.
   */
  private createLinks() {
    const links = this.container
      .append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(this.graph.links)
      .join('g')
      .attr('stroke', (d: TimelineLink) =>
        (color(d.source.layout.color) as RGBColor).toString(),
      )
      .attr('class', 'link')
      .style('mix-blend-mode', 'multiply');

    links
      .append('path')
      .attr('d', (d: TimelineLink) => d.layout.path)
      .attr('stroke-width', (d: TimelineLink) => Math.max(1, d.layout.width));

    links.append('title').text(this.options.linkTitle);
  }

  /**
   * Creates the nodes.
   */
  private createNodes() {
    type TransitionType = Transition<BaseType, null, null, undefined>;
    const { options } = this;
    const _timeline = this.timeline;
    const renderer = this;
    this.container
      .append('g')
      .selectAll('g')
      .data(this.graph.nodes)
      .join('g')
      .attr('x', (d: TimelineNode) => d.layout.x)
      .attr('y', (d: TimelineNode) => d.layout.y)
      .attr('height', (d: TimelineNode) => d.layout.height)
      .attr('width', (d: TimelineNode) => d.layout.width)
      .attr('class', 'node')
      .on('mouseover', function (event: DragEvent, d: TimelineNode) {
        const fade = transition()
          .duration(options.transitionSpeed)
          .ease(easeCubicIn) as any as TransitionType;
        const target = select(this);
        target.selectAll('.distHandle').transition(fade).style('opacity', 1);
        let shortestPath: number[] = [];
        const paths: number[][] = _timeline.getPath(d.id);
        paths.forEach((path) => {
          if (shortestPath.length === 0 || path.length < shortestPath.length) {
            shortestPath = path;
          }
        });
        selectAll('.node').each(function (n: unknown) {
          const node = n as TimelineNode;
          if (paths.flat().indexOf(node.id) < 0) {
            select(this).transition(fade).style('opacity', options.fadeOpacity);
          }
        });
        const pathLinks: number[] = [];
        paths.forEach((path) => {
          pathLinks.push(..._timeline.getLinksInPath(path));
        });
        selectAll('.link').each(function (l: unknown) {
          const link = l as TimelineLink;
          if (pathLinks.indexOf(link.id) < 0) {
            select(this).transition(fade).style('opacity', options.fadeOpacity);
          }
        });
      })
      .on('mouseleave', function (e) {
        const fade = transition()
          .duration(options.transitionSpeed)
          .ease(easeCubicIn) as any as TransitionType;
        selectAll('.node, .link').transition(fade).style('opacity', 1);
        selectAll('.distHandle')
          .transition(fade)
          .style('opacity', options.fadeOpacity);
      })
      .call(
        drag<any, TimelineNode>()
          .on('drag', (event: DragEvent, d: TimelineNode) => {
            if (!d.persist) {
              d.persist = {
                default: {
                  x: 0,
                  y: 0,
                },
                timeline: {
                  y: 0,
                },
              };
            }
            let x = event.x;
            let y = event.y;
            if (x < 0) {
              x = 0;
            }
            if (y < 0) {
              y = 0;
            }
            if (options.layout !== 'timeline') {
              d.layout.x = x;
              d.layout.y = y;
              d.persist.default.x = x;
              d.persist.default.y = y;
            } else {
              d.layout.y = y;
              d.persist.timeline.y = y;
            }
            const top = d.layout.y + d.layout.height;
            if (top > this.options.height) {
              this.options.height = top;
              this.container.style('height', top);
            }
            const right = d.layout.x + d.layout.width;
            if (right > this.options.width) {
              this.options.width = right;
              this.container.style('width', right);
            }
          })
          .on('drag.update', () => {
            selectAll<BaseType, TimelineNode>('.node').each(function (
              d: TimelineNode,
            ) {
              const element = select<BaseType, TimelineNode>(this);
              element
                .select('.nodeFill')
                .attr('x', () => d.layout.x)
                .attr('y', () => d.layout.y);
              element
                .select('text')
                .attr('x', () => d.layout.x + d.layout.width / 2)
                .attr('y', () => d.layout.y + d.layout.height / 2);
              element
                .select('.meanValue')
                .attr('x', () => d.layout.x + d.layout.width / 2)
                .attr('y', () => d.layout.y - options.meanBar.width);
              element
                .select('.labelBox')
                .attr('x', () => d.layout.x)
                .attr(
                  'y',
                  () => d.layout.y + d.layout.height / 2 - d.textHeight / 2,
                );
              selectAll<BaseType, TimelineLink>('.link').each(function (l) {
                l.layout.path = renderer.getCurvePath(l);
                const current = select(this);
                current.select('path').attr('d', l.layout.path);
                const midpoint = renderer.getCurveMidpoint(l);
                current
                  .selectAll<SVGTextElement, unknown>('text')
                  .attr('x', midpoint.x)
                  .attr('y', function () {
                    let y = midpoint.y;
                    if (l.isSelfLinking) {
                      y =
                        y -
                        renderer.options.curve.height +
                        this.getBBox().height / 2;
                    }
                    return y;
                  });
              });
              element.select('.distHandleLeft').attr('y', () => d.layout.y);
              element
                .select('.distHandleCenter')
                .attr('y', () => d.layout.y + d.layout.height / 2);
              element.select('.distHandleRight').attr('y', () => d.layout.y);
            });
          }),
      );
  }

  /**
   * Ensures the SVG is wide enough that nodes aren't going off the right hand side.
   */
  private expandToContent() {
    this.graph.nodes.forEach((node) => {
      const right = node.layout.x + node.layout.width;
      if (right > this.options.width) {
        this.options.width = right + this.options.margin;
        this.container.style('width', this.options.width);
      }
    });
    this.graph.links.forEach((link) => {
      const right = this.getCurveExtrema(link)[1];
      if (right > this.options.width) {
        this.options.width = right + this.options.margin;
        this.container.style('width', this.options.width);
      }
    });
  }

  /**
   * Creates the label boxes.
   */
  private createLabelBoxes() {
    const nodes = selectAll<BaseType, TimelineNode>('.node');
    nodes
      .append('rect')
      .attr('class', 'labelBox')
      .style('fill', 'rgba(0,0,0,0.2)')
      .attr('x', (d) => d.layout.x)
      .attr('y', (d) => d.layout.y + d.layout.height / 2 - d.textHeight / 2)
      .attr('width', (d) => d.textWidth)
      .attr('height', (d) => d.textHeight);
    nodes
      .append('rect')
      .attr('class', 'nodeFill')
      .attr('fill', (d: TimelineNode) => d.layout.color)
      .attr('x', (d: TimelineNode) => d.layout.x)
      .attr('y', (d: TimelineNode) => d.layout.y)
      .attr('height', (d: TimelineNode) => d.layout.height)
      .attr('width', (d: TimelineNode) => d.layout.width);
    nodes.append('title').text((d: TimelineNode) => this.options.nodeTitle(d));
  }

  /**
   * Creates distribution handles.
   */
  private createDistributionHandles() {
    const nodes = selectAll<BaseType, TimelineNode>('.node');
    // Left handle
    nodes
      .append('rect')
      .attr('x', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[0].x;
        }
        return 0;
      })
      .attr('y', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[0].y;
        }
        return 0;
      })
      .attr('class', 'distHandle distHandleLeft')
      .attr('height', (d: TimelineNode) => d.layout.height)
      .attr('width', () => this.options.distHandle.width)
      .attr('fill', this.options.distHandle.color)
      .style('opacity', this.options.fadeOpacity);
    // Right handle
    nodes
      .append('rect')
      .attr('x', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[1].x;
        }
        return 0;
      })
      .attr('y', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[1].y;
        }
        return 0;
      })
      .attr('class', 'distHandle distHandleRight')
      .attr('height', (d: TimelineNode) => d.layout.height)
      .attr('width', () => this.options.distHandle.width)
      .attr('fill', this.options.distHandle.color)
      .style('opacity', this.options.fadeOpacity);
    // Center line
    nodes
      .append('rect')
      .attr('x', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[0].x;
        }
        return 0;
      })
      .attr('y', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.y + d.layout.height / 2;
        }
        return 0;
      })
      .attr('class', 'distHandle distHandleCenter')
      .attr('height', () => this.options.distHandle.width)
      .attr('width', (d: TimelineNode) => {
        if (d.layout.distribution) {
          return d.layout.distribution[1].x - d.layout.distribution[0].x;
        }
        return 0;
      })
      .attr('fill', this.options.distHandle.color)
      .style('opacity', this.options.fadeOpacity);

    // Mean value bar
    nodes
      .append('rect')
      .attr('x', (d: TimelineNode) => d.layout.x + d.layout.width / 2)
      .attr('y', (d: TimelineNode) => d.layout.y - this.options.meanBar.width)
      .attr('class', 'meanValue')
      .attr('width', this.options.meanBar.width)
      .attr(
        'height',
        (d: TimelineNode) => d.layout.height + this.options.meanBar.width * 2,
      )
      .attr('fill', this.options.meanBar.color);
  }

  /**
   * Creates the visible node labels.
   */
  private createNodeLabels() {
    selectAll<BaseType, TimelineNode>('.node')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'label')
      .style('fill', this.options.fontColor)
      .style('font-size', `${this.options.fontSize}px`)
      .text((d: TimelineNode) => d.label)
      .attr('x', (d: TimelineNode) => d.layout.x + d.layout.width / 2)
      .attr('y', (d: TimelineNode) => d.layout.y + d.layout.height / 2);
  }

  /**
   * Creates link labels.
   */
  private createLinkLabels() {
    const renderer = this;
    selectAll<BaseType, TimelineLink>('.link')
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', this.options.labels.borderWidth)
      .text((d: TimelineLink) => d.data.count)
      .attr('x', (link: TimelineLink) => this.getCurveMidpoint(link).x)
      .attr('y', function (link: TimelineLink) {
        let y = renderer.getCurveMidpoint(link).y;
        if (link.isSelfLinking) {
          y = y - renderer.options.curve.height + this.getBBox().height / 2;
        }
        return y;
      });
    selectAll<BaseType, TimelineLink>('.link')
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('stroke', 'white')
      .style('stroke-width', this.options.labels.fontSize)
      .text((d: TimelineLink) => d.data.count)
      .attr('x', (link: TimelineLink) => this.getCurveMidpoint(link).x)
      .attr('y', function (link: TimelineLink) {
        let y = renderer.getCurveMidpoint(link).y;
        if (link.isSelfLinking) {
          y = y - renderer.options.curve.height + this.getBBox().height / 2;
        }
        return y;
      });
  }

  /**
   * Wraps a curve in the Bezier library.
   * @param link - The link to calculate for.
   * @returns The Bezier curve.
   */
  private getBezierCurve(link: TimelineLink) {
    const curve = this.calculateCurve(link);
    return new Bezier([
      curve[0][0],
      curve[0][1],
      curve[1][0],
      curve[1][1],
      curve[2][0],
      curve[2][1],
      curve[3][0],
      curve[3][1],
    ]);
  }

  /**
   * Calculates the midpoint of a link's bezier curve.
   *
   * @param link - The link to calculate for.
   * @returns The x and y coordinates of the midpoint.
   */
  private getCurveMidpoint(link: TimelineLink) {
    return this.getBezierCurve(link).getLUT()[50];
  }

  /**
   * Gets the minimum and maximum x coordinates of points of the curve.
   * @param link - The link to calculate the curve for.
   * @returns The [minimum, maximum] x coordinates.
   */
  private getCurveExtrema(link: TimelineLink) {
    const curve = this.getBezierCurve(link).getLUT();
    let min = Infinity;
    let max = -Infinity;
    curve.forEach((point) => {
      if (point.x > max) {
        max = point.x;
      }
      if (point.x < min) {
        min = point.x;
      }
    });
    min -= 28;
    return [min, max];
  }

  /**
   * Calcualtes the SVG path string for a curve.
   * @param link - The link to calculate for.
   * @returns The path string.
   */
  private getCurvePath(link: TimelineLink) {
    const curve = this.calculateCurve(link);
    // TODO: Have curveHeight option effect non-circular curve paths
    // TODO: If the curve width is larger than the nodes it connects to,
    // adjust the curve to be the size of the node at the connection point
    let path = `M${curve[0][0]},${curve[0][1]}C${curve[1][0]},${curve[1][1]},${curve[2][0]},${curve[2][1]},${curve[3][0]},${curve[3][1]}`;
    if (link.isSelfLinking) {
      path = `M${curve[0][0] - 5},${curve[0][1]}C${curve[1][0]},${
        curve[1][1] - this.options.curve.height
      },${curve[2][0]},${curve[2][1] - this.options.curve.height},${
        curve[3][0] + 5
      },${curve[3][1]}`;
    }
    return path;
  }

  /**
   * Scales the given time value to the range specified in options.
   *
   * @param time - The original x coordinate.
   * @returns - The scaled x coordinate.
   */
  private getTimeX(time: number): number {
    return (
      (this.range[1] - this.range[0]) *
        (time / (this.timeline.maxTime - this.timeline.minTime)) +
      this.range[0]
    );
  }

  /**
   * Sets the display color of a node.
   *
   * @param targetNode - The node to set the color of.
   * @param color - The color to set.
   */
  public setNodeColor(targetNode: number, color: string) {
    this.timeline.setNodeColor(targetNode, color);
    selectAll<BaseType, TimelineNode>('.nodeFill').attr(
      'fill',
      (d) => d.layout.color,
    );
  }
}
