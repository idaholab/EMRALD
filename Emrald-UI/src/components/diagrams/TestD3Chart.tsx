import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TestD3Chart: React.FC = () => {
  const randomNumbers = Array.from({ length: 30 }, () => Math.floor(Math.random() * 101));
  const [data] = useState<number[]>(randomNumbers);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const w = 500;
      const h = 250;
      const svg = d3
        .select(svgRef.current)
        .attr('width', w)
        .attr('height', h)
        .style('margin-top', '50')
        .style('overflow', 'visible');

      const xScale = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, w]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data) || 1])
        .range([h, 0]);

      // Explicitly specify the types for lineGenerator and data
      const lineGenerator = d3
        .line<number>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveCardinal);

      const xAxis = d3
        .axisBottom(xScale)
        .ticks(data.length)
        .tickFormat((i) => (Number(i) + 1).toString()); 

      const yAxis = d3.axisLeft(yScale).ticks(5);
      
      svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`); // Move x-axis to the bottom

      svg.append('g').call(yAxis);

      svg
        .append('path')
        .datum(data) // Use datum to bind the entire array
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    }
  }, [data]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TestD3Chart;
