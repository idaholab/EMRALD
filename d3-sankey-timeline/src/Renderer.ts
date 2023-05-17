import { Bezier } from 'bezier-js';
import { color, RGBColor } from 'd3-color';
import { drag } from 'd3-drag';
import { easeCubicIn } from 'd3-ease';
import { BaseType, select, selectAll, Selection } from 'd3-selection';
import { Transition, transition } from 'd3-transition';
import colors from './colors';
import SankeyTimeline from './SankeyTimeline';
import type TimelineLink from './TimelineLink';
import TimelineNode from './TimelineNode';
import type { TimelineGraph } from './types';
import { hasDist } from './util';

// The typings for d3-transition are incompatible with d3-selection, so we have to use ts-ignore when using transitions.

/**
 * Renders the chart using D3.
 */
export default class Renderer {
  private graph: TimelineGraph = {
    links: [],
    nodes: [],
  };

  public options = {
    axisColor: 'rgba(0,0,0,0.25)',
    axisFontSize: 8,
    axisHeight: 2,
    axisMargin: 8,
    axisTickHeight: 12,
    axisTickWidth: 3,
    buttonRadius: 2,
    buttonSpacing: 6,
    curveHeight: 50,
    curveWidth: 200,
    distHandleWidth: 3,
    distributions: true,
    dynamicLinkWidth: true,
    dynamicNodeHeight: false,
    endColor: '#FF9800',
    fadeOpacity: 0.3,
    fontColor: 'white',
    fontSize: 20,
    height: window.innerHeight,
    layout: 'default',
    linkTitle: (d: TimelineLink) =>
      `${d.source.label} → ${d.target.label}\n${d.flow}`,
    margin: 60,
    marginTop: 25,
    maxLinkWidth: 50,
    maxNodeHeight: 100,
    meanBarColor: 'rgba(0,0,0,0.25)',
    meanBarWidth: 3,
    menuWidth: 500,
    nodeTitle: (d: TimelineNode): string => d.label,
    startColor: '#9C27B0',
    ticks: 25,
    transitionSpeed: 75,
    width: window.innerWidth,
  };

  public timeline: SankeyTimeline;

  /**
   * Constructs Renderer.
   *
   * @param timeline - The timeline to render.
   */
  public constructor(timeline: SankeyTimeline) {
    this.timeline = timeline;
  }

  /**
   * Calculates timeline link paths based on node's X and Y coordinates.
   */
  private calculateLinkPaths(): void {
    this.graph.links.forEach((link, l) => {
      const y = link.source.layout.y + link.source.layout.height / 2;
      const y1 = link.target.layout.y + link.target.layout.height / 2;
      const curve = [
        [link.source.layout.x + link.source.layout.width, y],
        [
          link.source.layout.x +
            link.source.layout.width +
            this.options.curveWidth,
          y,
        ],
        [link.target.layout.x - this.options.curveWidth, y1],
        [link.target.layout.x, y1],
      ];
      let path;
      if (link.isSelfLinking) {
        path = `M${link.source.layout.x + link.source.layout.width - 5},${y}C${
          link.source.layout.x +
          link.source.layout.width +
          this.options.curveWidth
        },${y - this.options.curveHeight},${
          link.target.layout.x - this.options.curveWidth
        },${y1 - this.options.curveHeight},${link.target.layout.x + 5},${y1}`;
      } else {
        // TODO: Have curveHeight option effect non-circular curve paths
        // TODO: If the curve width is larger than the nodes it connects to,
        // adjust the curve to be the size of the node at the connection point
        path = `M${curve[0][0]},${curve[0][1]}C${curve[1][0]},${curve[1][1]},${curve[2][0]},${curve[2][1]},${curve[3][0]},${curve[3][1]}`;
      }
      let width = this.options.maxLinkWidth;
      if (this.timeline.maxFlow !== 0 && this.options.dynamicLinkWidth) {
        width *= link.flow / this.timeline.maxFlow;
      }
      this.graph.links[l].layout = {
        curve,
        path,
        width,
      };
      return l;
    });
  }

  /**
   * Calculates the distribution data layout for nodes in the graph.
   */
  private calculateDistributionLayout() {
    this.graph.nodes.forEach((node) => {
      if (hasDist(node.times) && this.options.distributions) {
        node.layout.distribution = [
          {
            x: this.getTimeX(
              (node.times.meanTime || 0) - (node.times.stdDeviation || 0),
            ),
            y: node.layout.y,
          },
          {
            x: this.getTimeX(
              (node.times.meanTime || 0) + (node.times.stdDeviation || 0),
            ),
            y: node.layout.y,
          },
        ];
      }
    });
  }

  /**
   * Given the bounds of the container to render in,
   * construct a clone of the graph with all measurements adjusted to fit in the given range.
   *
   * @returns A graph object with layout properties assigned to nodes and links.
   */
  public calculateLayout(): TimelineGraph {
    this.graph = this.timeline.graph;
    this.initializeLayout();
    const cols: TimelineNode[][] = [];
    const colWidths: number[] = [];
    const colXs: number[] = [];
    const maxCols: number[] = [];
    let maxColumn = -1;
    let maxRow = -1;
    let leftHandAdjustment = 0;
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
        if (currentCol === 0) {
          const nodeAdjustment =
            this.getTimeX(source.times.meanTime || 0) - source.layout.width / 2;
          if (nodeAdjustment < leftHandAdjustment) {
            leftHandAdjustment = nodeAdjustment;
          }
        }
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
        const originalMargin = this.options.margin;
        this.options.margin += -leftHandAdjustment;
        node.layout.x =
          this.getTimeX(node.times.meanTime || 0) - node.layout.width / 2;
        if (node.persist) {
          node.layout.y = node.persist.timeline.y;
        } else {
          node.layout.y =
            (node.layout.row / (maxRow + 1)) * this.options.height;
        }
        this.options.margin = originalMargin;
      }
    });
    this.calculateLinkPaths();
    this.calculateDistributionLayout();
    this.calculateMenuLayouts();
    return this.graph;
  }

  /**
   * Assigns the positions for the menu button circles.
   */
  private calculateMenuLayouts() {
    this.graph.nodes.forEach((d, i) => {
      this.graph.nodes[i].layout.menuY = d.layout.y + this.options.axisMargin;
      const base = d.layout.x + d.layout.width - this.options.axisMargin;
      this.graph.nodes[i].layout.menuX = [
        base - 2 * this.options.buttonSpacing,
        base - this.options.buttonSpacing,
        base,
      ];
    });
  }

  /**
   * Places nodes in their initial positions.
   */
  private initializeLayout() {
    this.graph.nodes.forEach((node, n) => {
      const x = this.getTimeX(node.times.meanTime || 0);
      const width = node.layout.width;
      let height = this.options.maxNodeHeight;
      if (this.options.dynamicNodeHeight) {
        height *= node.size / this.timeline.maxSize;
      }
      this.graph.nodes[n].layout = {
        baseRow: 0,
        color: node.color || '',
        column: -1,
        height,
        menuX: [],
        menuY: 0,
        row: -1,
        width,
        x,
        y: 0,
      };
    });
  }

  /**
   * The chart range.
   *
   * @returns The chart range.
   */
  private get range(): [number, number] {
    return [this.options.margin, this.options.width - this.options.margin];
  }

  /**
   * Renders the graph.
   *
   * @param svg - The SVG element to render within.
   */
  public render(svg: Selection<BaseType, unknown, HTMLElement, any>): void {
    // Create labels
    svg
      .append('g')
      .selectAll('g')
      .data(this.timeline.graph.nodes)
      .join('g')
      .append('text')
      .data(this.timeline.graph.nodes)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', this.options.fontColor)
      .style('font-size', `${this.options.fontSize}px`)
      .text((d: TimelineNode) => d.label)
      .each(function (d: TimelineNode) {
        d.textHeight = this.getBBox().height;
        d.textWidth = this.getBBox().width;
        d.layout.width = d.textWidth;
      });

    const graph = this.calculateLayout();

    // Create the graph element
    svg
      .style('background', '#fff')
      .style('width', this.options.width)
      .style('height', this.options.height);

    // Create the axis
    if (this.options.layout === 'timeline') {
      const axisContainer = svg.append('g').style('width', '100%');
      axisContainer
        .append('rect')
        .attr('width', '100%')
        .attr('height', this.options.axisHeight)
        .attr('fill', this.options.axisColor);
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
          axisContainer
            .append('text')
            .text(Math.round(i))
            .attr('x', x + this.options.axisTickWidth)
            .attr('y', this.options.axisHeight + this.options.axisMargin)
            .attr('font-size', this.options.axisFontSize);
          axisContainer
            .append('rect')
            .style(
              'height',
              this.options.axisTickHeight - this.options.axisHeight,
            )
            .style('width', this.options.axisTickWidth)
            .attr('x', x)
            .attr('y', this.options.axisHeight)
            .attr('fill', this.options.axisColor);
        }
      }
    }

    // Create links
    const links = svg
      .append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(graph.links)
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

    // Create nodes
    type TransitionType = Transition<BaseType, null, null, undefined>;
    const { options } = this;
    const _timeline = this.timeline;
    const renderer = this;
    const nodes = svg
      .append('g')
      .selectAll('g')
      .data(graph.nodes)
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
        target.selectAll('.menu-button').transition(fade).style('opacity', 1);
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
      .on('mouseleave', function () {
        const fade = transition()
          .duration(options.transitionSpeed)
          .ease(easeCubicIn) as any as TransitionType;
        selectAll('.node, .link').transition(fade).style('opacity', 1);
        selectAll('.distHandle')
          .transition(fade)
          .style('opacity', options.fadeOpacity);
        select(this)
          .selectAll('.menu-button')
          .transition(fade)
          .style('opacity', 0);
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
            if (options.layout !== 'timeline') {
              d.layout.x = event.x;
              d.layout.y = event.y;
              d.persist.default.x = event.x;
              d.persist.default.y = event.y;
            } else {
              d.layout.y = event.y;
              d.persist.timeline.y = event.y;
            }
            const top = d.layout.y + d.layout.height;
            if (top > this.options.height) {
              this.options.height = top;
              svg.style('height', top);
            }
            const right = d.layout.x + d.layout.width;
            if (right > this.options.width) {
              this.options.width = right;
              svg.style('width', right);
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
                .attr('y', () => d.layout.y - options.meanBarWidth);
              element
                .select('.labelBox')
                .attr('x', () => d.layout.x)
                .attr(
                  'y',
                  () => d.layout.y + d.layout.height / 2 - d.textHeight / 2,
                );
              selectAll<BaseType, TimelineLink>('.link').each(function (l) {
                const path = l.layout.path.substring(1).split(',');
                if (l.source.id === d.id) {
                  l.layout.path = `M${d.layout.x + d.layout.width},${
                    d.layout.y + d.layout.height / 2
                  }C${d.layout.x + d.layout.width + options.curveWidth},${
                    d.layout.y + d.layout.height / 2
                  },${path[3]},${path[4]},${path[5]},${path[6]}`;
                } else if (l.target.id === d.id) {
                  l.layout.path = `M${path[0]},${path[1].split('C')[0]}C${
                    path[1].split('C')[1]
                  },${path[2]},${d.layout.x - options.curveWidth},${
                    d.layout.y + d.layout.height / 2
                  },${d.layout.x},${d.layout.y + d.layout.height / 2}`;
                }
                const current = select(this);
                current.select('path').attr('d', l.layout.path);
                const midpoint = renderer.getCurveMidpoint(l);
                current
                  .select('text')
                  .attr('x', midpoint.x)
                  .attr('y', midpoint.y);
              });
              renderer.calculateMenuLayouts();
              renderer.positionMenuNodes();
              element.select('.distHandleLeft').attr('y', () => d.layout.y);
              element
                .select('.distHandleCenter')
                .attr('y', () => d.layout.y + d.layout.height / 2);
              element.select('.distHandleRight').attr('y', () => d.layout.y);
            });
          }),
      );
    // Label boxes
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

    // Menu buttons
    for (let i = 0; i < 3; i += 1) {
      nodes
        .append('circle')
        .attr('class', `menu-button menu-button-${i + 1}`)
        .style('opacity', 0)
        .style('fill', this.options.fontColor)
        .attr('r', this.options.buttonRadius);
    }
    nodes
      .append('rect')
      .attr('class', 'menu-button-container')
      .style('cursor', 'pointer')
      .style('fill', 'rgba(0,0,0,0)')
      .attr('height', 2 * this.options.buttonRadius)
      .attr(
        'width',
        this.options.buttonRadius * 6 + this.options.axisMargin * 2,
      )
      .on('click', (event: PointerEvent, d: TimelineNode) => {
        (window as any).showNodeMenu(d);
      });
    this.positionMenuNodes();

    if (this.options.layout === 'timeline') {
      const handleColor = 'rgba(0,0,0)';
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
        .attr('width', () => this.options.distHandleWidth)
        .attr('fill', handleColor)
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
        .attr('width', () => this.options.distHandleWidth)
        .attr('fill', handleColor)
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
        .attr('height', () => this.options.distHandleWidth)
        .attr('width', (d: TimelineNode) => {
          if (d.layout.distribution) {
            return d.layout.distribution[1].x - d.layout.distribution[0].x;
          }
          return 0;
        })
        .attr('fill', handleColor)
        .style('opacity', this.options.fadeOpacity);

      // Mean value bar
      nodes
        .append('rect')
        .attr('x', (d: TimelineNode) => d.layout.x + d.layout.width / 2)
        .attr('y', (d: TimelineNode) => d.layout.y - this.options.meanBarWidth)
        .attr('class', 'meanValue')
        .attr('width', this.options.meanBarWidth)
        .attr(
          'height',
          (d: TimelineNode) => d.layout.height + this.options.meanBarWidth * 2,
        )
        .attr('fill', this.options.meanBarColor);
    }

    // Visible labels
    nodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'label')
      .style('fill', this.options.fontColor)
      .style('font-size', `${this.options.fontSize}px`)
      .text((d: TimelineNode) => d.label)
      .attr('x', (d: TimelineNode) => d.layout.x + d.layout.width / 2)
      .attr('y', (d: TimelineNode) => d.layout.y + d.layout.height / 2);

    links
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', this.options.fontColor)
      .style('font-size', `${this.options.fontSize}px`)
      .text((d: TimelineLink) => d.data.count)
      .attr('x', (link: TimelineLink) => this.getCurveMidpoint(link).x)
      .attr('y', (link: TimelineLink) => this.getCurveMidpoint(link).y);
  }

  /**
   * Calculates the midpoint of a link's bezier curve.
   *
   * @param link - The link to calculate for.
   * @returns The x and y coordinates of the midpoint.
   */
  private getCurveMidpoint(link: TimelineLink) {
    const y = link.source.layout.y + link.source.layout.height / 2;
    const y1 = link.target.layout.y + link.target.layout.height / 2;
    const curve = new Bezier([
      link.source.layout.x + link.source.layout.width,
      y,
      link.source.layout.x + link.source.layout.width + this.options.curveWidth,
      y,
      link.target.layout.x - this.options.curveWidth,
      y1,
      link.target.layout.x,
      y1,
    ]);
    return curve.getLUT()[50];
  }

  /**
   * Scales the given time value to the range specified in options.
   *
   * @param time - The original x coordinate.
   * @returns - The scaled x coordinate.
   */
  private getTimeX(time: number): number {
    let shift = this.timeline.minTime;
    if (this.timeline.minTime < 0) {
      shift = 0 - this.timeline.minTime;
    }
    return (
      (this.range[1] - this.range[0]) *
        ((time + shift) /
          (this.timeline.maxTime + shift - (this.timeline.minTime + shift))) +
      this.range[0]
    );
  }

  /**
   * Repositions the menu nodes.
   */
  private positionMenuNodes() {
    for (let i = 0; i < 3; i += 1) {
      selectAll<BaseType, TimelineNode>(`.menu-button-${i + 1}`)
        .attr('cx', (d) => {
          if (d.textHeight >= d.layout.height) {
            return d.layout.menuX[i] + this.options.axisMargin;
          }
          return d.layout.menuX[i];
        })
        .attr('cy', (d) => {
          if (d.textHeight >= d.layout.height) {
            return (
              d.layout.y +
              d.layout.height / 2 -
              d.textHeight / 2 -
              this.options.buttonRadius
            );
          }
          return d.layout.menuY;
        })
        .style('fill', (d) => {
          if (d.textHeight >= d.layout.height) {
            return 'black';
          }
          return this.options.fontColor;
        });
    }
    selectAll<BaseType, TimelineNode>('.menu-button-container')
      .attr(
        'x',
        (d: TimelineNode) => d.layout.menuX[0] - 2 * this.options.buttonRadius,
      )
      .attr('y', (d: TimelineNode) => {
        if (d.textHeight >= d.layout.height) {
          return (
            d.layout.y +
            d.layout.height / 2 -
            d.textHeight / 2 -
            2 * this.options.buttonRadius
          );
        }
        return d.layout.menuY - this.options.buttonRadius;
      });
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
