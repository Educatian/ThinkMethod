import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VisualizationData, VisualizationNode } from '../types';

interface ResearchDesignVisualizationProps {
  data: VisualizationData;
}

// Color schemes for different node types
const nodeColors = {
  start: { fill: '#10b981', stroke: '#059669', gradient: ['#34d399', '#059669'] },
  end: { fill: '#10b981', stroke: '#059669', gradient: ['#34d399', '#059669'] },
  process: { fill: '#0ea5e9', stroke: '#0284c7', gradient: ['#38bdf8', '#0284c7'] },
  decision: { fill: '#f97316', stroke: '#ea580c', gradient: ['#fb923c', '#ea580c'] },
  io: { fill: '#8b5cf6', stroke: '#7c3aed', gradient: ['#a78bfa', '#7c3aed'] },
};

const ResearchDesignVisualization: React.FC<ResearchDesignVisualizationProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svgElement = svgRef.current;

    const width = container.clientWidth || 800;
    const height = Math.max(400, container.clientHeight || 400);

    d3.select(svgElement).selectAll("*").remove();

    const svg = d3.select(svgElement)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const defs = svg.append('defs');

    // Drop shadow
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 2);
    filter.append('feOffset').attr('dx', 1).attr('dy', 2).attr('result', 'offsetBlur');
    filter.append('feFlood').attr('flood-color', 'rgba(0,0,0,0.15)');
    filter.append('feComposite').attr('in2', 'offsetBlur').attr('operator', 'in');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradients
    Object.entries(nodeColors).forEach(([type, colors]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${type}`)
        .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', colors.gradient[0]);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', colors.gradient[1]);
    });

    // Arrow marker
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10).attr('refY', 0)
      .attr('markerWidth', 8).attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', '#64748b');

    // Clone data
    const nodes = data.nodes.map((n, i) => ({ ...n, index: i }));
    const links = data.links.map(l => ({ ...l }));

    // === HIERARCHICAL LAYOUT ===
    // Calculate levels for each node based on graph structure
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const levels: Map<string, number> = new Map();
    const inDegree: Map<string, number> = new Map();

    nodes.forEach(n => inDegree.set(n.id, 0));
    links.forEach(l => {
      const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
      inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
    });

    // BFS to assign levels
    const queue: string[] = [];
    nodes.forEach(n => {
      if (inDegree.get(n.id) === 0 || n.type === 'start') {
        levels.set(n.id, 0);
        queue.push(n.id);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLevel = levels.get(current) || 0;
      links.forEach(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        if (sourceId === current) {
          const existingLevel = levels.get(targetId);
          if (existingLevel === undefined || existingLevel < currentLevel + 1) {
            levels.set(targetId, currentLevel + 1);
            queue.push(targetId);
          }
        }
      });
    }

    // Ensure all nodes have a level
    nodes.forEach(n => {
      if (!levels.has(n.id)) levels.set(n.id, 0);
    });

    // Group nodes by level
    const levelGroups: Map<number, any[]> = new Map();
    nodes.forEach(n => {
      const level = levels.get(n.id) || 0;
      if (!levelGroups.has(level)) levelGroups.set(level, []);
      levelGroups.get(level)!.push(n);
    });

    const numLevels = Math.max(...Array.from(levels.values())) + 1;
    const levelHeight = height / (numLevels + 1);

    // Position nodes
    levelGroups.forEach((nodesInLevel, level) => {
      const y = (level + 1) * levelHeight;
      const levelWidth = width / (nodesInLevel.length + 1);
      nodesInLevel.forEach((n, i) => {
        n.x = (i + 1) * levelWidth;
        n.y = y;
      });
    });

    // Draw links
    const linkGroup = svg.append('g').attr('class', 'links');

    linkGroup.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .attr('d', (d: any) => {
        const source = nodeMap.get(typeof d.source === 'string' ? d.source : d.source.id);
        const target = nodeMap.get(typeof d.target === 'string' ? d.target : d.target.id);
        if (!source || !target) return '';

        const sx = source.x, sy = source.y;
        const tx = target.x, ty = target.y;

        // Curved path for better visibility
        const midY = (sy + ty) / 2;
        return `M${sx},${sy + 25} C${sx},${midY} ${tx},${midY} ${tx},${ty - 25}`;
      });

    // Draw nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    // Node shapes
    node.each(function (d: any) {
      const g = d3.select(this);
      const type = d.type || 'process';
      const colors = nodeColors[type as keyof typeof nodeColors] || nodeColors.process;

      if (type === 'start' || type === 'end') {
        g.append('circle')
          .attr('r', 22)
          .attr('fill', `url(#gradient-${type})`)
          .attr('stroke', colors.stroke)
          .attr('stroke-width', 2)
          .attr('filter', 'url(#drop-shadow)');
      } else if (type === 'decision') {
        g.append('path')
          .attr('d', 'M0,-28 L35,0 L0,28 L-35,0 Z')
          .attr('fill', `url(#gradient-decision)`)
          .attr('stroke', colors.stroke)
          .attr('stroke-width', 2)
          .attr('filter', 'url(#drop-shadow)');
      } else if (type === 'io') {
        g.append('path')
          .attr('d', 'M-40,-20 L40,-20 L30,20 L-50,20 Z')
          .attr('fill', `url(#gradient-io)`)
          .attr('stroke', colors.stroke)
          .attr('stroke-width', 2)
          .attr('filter', 'url(#drop-shadow)');
      } else {
        g.append('rect')
          .attr('width', 100)
          .attr('height', 40)
          .attr('rx', 6)
          .attr('x', -50)
          .attr('y', -20)
          .attr('fill', `url(#gradient-process)`)
          .attr('stroke', colors.stroke)
          .attr('stroke-width', 2)
          .attr('filter', 'url(#drop-shadow)');
      }
    });

    // Labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '9px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .each(function (d: any) {
        const text = d3.select(this);
        const type = d.type || 'process';
        const words = d.label.split(' ');

        if (type === 'start' || type === 'end') {
          text.attr('fill', '#475569').attr('dy', 38).text(d.label);
        } else {
          const maxChars = type === 'decision' ? 8 : 12;
          const lines: string[] = [];
          let line = '';
          words.forEach(word => {
            if ((line + ' ' + word).trim().length > maxChars && line) {
              lines.push(line.trim());
              line = word;
            } else {
              line = (line + ' ' + word).trim();
            }
          });
          if (line) lines.push(line);

          const displayLines = lines.slice(0, 2);
          const lineHeight = 11;
          const startY = -(displayLines.length - 1) * lineHeight / 2 + 3;

          displayLines.forEach((l, i) => {
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', i === 0 ? startY : lineHeight)
              .text(l);
          });
        }
      });

    // Hover effect
    node.style('cursor', 'pointer')
      .on('mouseenter', function () {
        d3.select(this).select('circle, rect, path').style('opacity', 0.85);
      })
      .on('mouseleave', function () {
        d3.select(this).select('circle, rect, path').style('opacity', 1);
      });

  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default ResearchDesignVisualization;
