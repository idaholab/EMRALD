import { color, HSLColor, RGBColor } from 'd3-color';
import { drag } from 'd3-drag';
import { easeCubicIn } from 'd3-ease';
import { interpolateHsl } from 'd3-interpolate';
import { BaseType, select, selectAll, Selection } from 'd3-selection';
import { Transition, transition } from 'd3-transition';
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

  private maxRow = 0;

  public options = {
    axisColor: 'rgba(0,0,0,0.25)',
    axisFontSize: 8,
    axisHeight: 2,
    axisMargin: 8,
    axisTickHeight: 12,
    axisTickWidth: 3,
    curveHeight: 50,
    curveWidth: 200,
    distHandleWidth: 3,
    distributions: true,
    dynamicLinkWidth: true,
    dynamicNodeHeight: false,
    endColor: 'orange',
    fadeOpacity: 0.3,
    fontColor: 'white',
    fontSize: 25,
    height: window.innerHeight,
    layout: 0,
    margin: 60,
    marginTop: 25,
    maxLinkWidth: 50,
    maxNodeHeight: 100,
    meanBarColor: 'rgba(0,0,0,0.25)',
    meanBarWidth: 3,
    nodeTitle: (d: TimelineNode): string => d.label,
    startColor: 'purple',
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
    const rows: number[] = [];
    let maxColumn = -1;
    let maxRow = -1;
    /**
     * Assigns columns along a path.
     *
     * @param source The current source node.
     * @param currentCol The current row number.
     */
    function assignColumns(source: TimelineNode, currentCol: number) {
      if (source.layout.column < 0) {
        if (currentCol >= cols.length) {
          cols.push([]);
          rows.push(0);
        }
        if (currentCol > maxColumn) {
          maxColumn = currentCol;
        }
        source.setColumn(currentCol);
        cols[currentCol].push(source);
        source.outgoingLinks.forEach((link) => {
          assignColumns(link.target, currentCol + 1);
        });
      }
    }
    /**
     * Assigns rows along a path.
     *
     * @param source The current source node.
     * @param baseRow The row the original source is assigned to.
     */
    function assignRows(source: TimelineNode, baseRow: number) {
      if (source.layout.row < 0) {
        let row = baseRow;
        source.layout.baseRow = baseRow;
        if (rows[source.layout.column] > baseRow) {
          row = rows[source.layout.column] + 1;
        }
        source.setRow(row);
        if (row > maxRow) {
          maxRow = row;
        }
        rows[source.layout.column] = row;
        source.outgoingLinks.forEach((link) => {
          assignRows(link.target, baseRow);
        });
      }
    }
    this.timeline.sourceNodes.forEach((sourceNode) => {
      assignColumns(sourceNode, 0);
    });
    let row = 0;
    cols[0].forEach((node) => {
      assignRows(node, row);
      row += 1;
    });
    const adjusted: number[] = [];
    this.graph.nodes.forEach((node) => {
      if (this.options.layout === 1) {
        if (
          typeof node.persist.default.x === 'number' &&
          typeof node.persist.default.y === 'number'
        ) {
          node.layout.x = node.persist.default.x;
          node.layout.y = node.persist.default.y;
        } else {
          node.layout.x =
            (node.layout.column / (maxColumn + 1)) * this.options.width -
            node.layout.width / 2;
          node.layout.y =
            (node.layout.row / (maxRow + 1)) * this.options.height;
        }
      } else if (this.options.layout === 0) {
        node.layout.x =
          this.getTimeX(node.times.meanTime || 0) - node.layout.width / 2;
        if (typeof node.persist.timeline.y === 'number') {
          node.layout.y = node.persist.timeline.y;
        } else if (adjusted.indexOf(node.id) < 0) {
          node.layout.y = this.options.axisTickHeight;
          adjusted.push(node.id);
          this.findNodeOverlaps(node)
            .map((overlap) => overlap.node)
            .forEach((o) => {
              if (adjusted.indexOf(o.id) < 0 && o.id !== node.id) {
                adjusted.push(o.id);
                o.layout.y += this.options.maxNodeHeight;
              }
            });
        }
      }
    });
    this.calculateLinkPaths();
    this.calculateDistributionLayout();
    this.maxRow = row;
    return this.graph;
  }

  /**
   * Finds nodes that overlap with the given node.
   *
   * @param node - The node to find overlaps for.
   * @param strict - If true, borders touching will be considered an overlap.
   * @returns Other nodes that overlap with the given node.
   */
  private findNodeOverlaps(node: TimelineNode, strict = true) {
    const overlaps: { node: TimelineNode; range: [number, number] }[] = [];
    this.graph.nodes.forEach((o) => {
      if (
        (strict &&
          ((o.layout.x + o.layout.width >= node.layout.x &&
            o.layout.x <= node.layout.x) ||
            (node.layout.x + node.layout.width >= o.layout.x &&
              node.layout.x <= o.layout.x))) ||
        (!strict &&
          ((o.layout.x + o.layout.width > node.layout.x &&
            o.layout.x <= node.layout.x) ||
            (node.layout.x + node.layout.width > o.layout.x &&
              node.layout.x <= o.layout.x)))
      ) {
        overlaps.push({
          node: o,
          range: [o.layout.y, o.layout.y + o.layout.height],
        });
      }
    });
    return overlaps;
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
        column: -1,
        height,
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
    if (this.options.layout === 0) {
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

    const gradient = interpolateHsl(
      color(this.options.startColor) as HSLColor,
      color(this.options.endColor) as HSLColor,
    );

    // Create links
    const links = svg
      .append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(graph.links)
      .join('g')
      .attr('stroke', (d: TimelineLink) =>
        (
          color(gradient(d.source.layout.baseRow / this.maxRow)) as RGBColor
        ).toString(),
      )
      .attr('class', 'link')
      .style('mix-blend-mode', 'multiply');

    links
      .append('path')
      .attr('d', (d: TimelineLink) => d.layout.path)
      .attr('stroke-width', (d: TimelineLink) => Math.max(1, d.layout.width));

    links
      .append('title')
      .text(
        (d: TimelineLink) => `${d.source.label} → ${d.target.label}\n${d.flow}`,
      );

    // Create nodes
    type TransitionType = Transition<BaseType, null, null, undefined>;
    const { options } = this;
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
      // TODO: Make this renderer-agnostic
      .on('mouseover', (event: DragEvent, d: TimelineNode) => {
        let shortestPath: number[] = [];
        const paths: number[][] = this.timeline.getPath(d.id);
        paths.forEach((path) => {
          if (shortestPath.length === 0 || path.length < shortestPath.length) {
            shortestPath = path;
          }
        });
        selectAll('.node').each(function (n: unknown) {
          const node = n as TimelineNode;
          if (paths.flat().indexOf(node.id) < 0) {
            select(this)
              .transition(
                transition()
                  .duration(options.transitionSpeed)
                  .ease(easeCubicIn) as any as TransitionType,
              )
              .style('opacity', options.fadeOpacity);
          }
        });
        const pathLinks: number[] = [];
        paths.forEach((path) => {
          pathLinks.push(...this.timeline.getLinksInPath(path));
        });
        selectAll('.link').each(function (l: unknown) {
          const link = l as TimelineLink;
          if (pathLinks.indexOf(link.id) < 0) {
            select(this)
              .transition(
                transition()
                  .duration(options.transitionSpeed)
                  .ease(easeCubicIn) as any as TransitionType,
              )
              .style('opacity', options.fadeOpacity);
          }
        });
      })
      .on('mouseleave', () => {
        selectAll('.node, .link')
          .transition(
            transition()
              .duration(this.options.transitionSpeed)
              .ease(easeCubicIn) as any as TransitionType,
          )
          .style('opacity', 1);
      })
      .call(
        drag<any, TimelineNode>()
          .on('drag', (event: DragEvent, d: TimelineNode) => {
            if (options.layout !== 0) {
              d.layout.x = event.x;
              d.layout.y = event.y;
              d.persist.default.x = event.x;
              d.persist.default.y = event.y;
            } else {
              d.layout.y = event.y;
              d.persist.timeline.y = event.y;
            }
          })
          .on('drag.update', () => {
            selectAll<BaseType, TimelineNode>('.node').each(function (
              d: TimelineNode,
            ) {
              const element = select(this);
              element
                .select('rect')
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
              selectAll<BaseType, TimelineLink>('.link').each(function (
                l: TimelineLink,
              ) {
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
                select(this).select('path').attr('d', l.layout.path);
              });
              element.select('.distHandleLeft').attr('y', () => d.layout.y);
              element
                .select('.distHandleCenter')
                .attr('y', () => d.layout.y + d.layout.height / 2);
              element.select('.distHandleRight').attr('y', () => d.layout.y);
            });
          }),
      );
    nodes
      .append('rect')
      .attr('fill', (d: TimelineNode) => gradient(d.layout.baseRow / this.maxRow))
      .attr('x', (d: TimelineNode) => d.layout.x)
      .attr('y', (d: TimelineNode) => d.layout.y)
      .attr('height', (d: TimelineNode) => d.layout.height)
      .attr('width', (d: TimelineNode) => d.layout.width);
    nodes.append('title').text((d: TimelineNode) => this.options.nodeTitle(d));

    if (this.options.layout === 0) {
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
        .attr('class', 'distHandleLeft')
        .attr('height', (d: TimelineNode) => d.layout.height)
        .attr('width', () => this.options.distHandleWidth)
        .attr('fill', (d: TimelineNode) => gradient(d.id / graph.nodes.length));
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
        .attr('class', 'distHandleRight')
        .attr('height', (d: TimelineNode) => d.layout.height)
        .attr('width', () => this.options.distHandleWidth)
        .attr('fill', (d: TimelineNode) => gradient(d.id / graph.nodes.length));
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
        .attr('class', 'distHandleCenter')
        .attr('height', () => this.options.distHandleWidth)
        .attr('width', (d: TimelineNode) => {
          if (d.layout.distribution) {
            return d.layout.distribution[1].x - d.layout.distribution[0].x;
          }
          return 0;
        })
        .attr('fill', (d: TimelineNode) => gradient(d.id / graph.nodes.length));

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
}
