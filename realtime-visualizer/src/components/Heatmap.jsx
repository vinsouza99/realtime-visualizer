import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Heatmap = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const gridSize = 40;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    const heatmapData = Array.from({ length: rows * cols }, (_, i) => ({
      x: (i % cols) * gridSize,
      y: Math.floor(i / cols) * gridSize,
      count: 0,
    }));

    // Accumulate counts
    data.forEach((position) => {
      if (
        position.facePoints.length === 0 ||
        !position.facePoints[0]?.x ||
        !position.facePoints[0]?.y
      )
        return; // Skip if no face points
      const x = position.facePoints[0].x;
      const y = position.facePoints[0].y;
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
      const index = row * cols + col;
      if (heatmapData[index]) heatmapData[index].count += 1;
    });

    const colorScale = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([0, d3.max(heatmapData, (d) => d.count) || 1]);

    svg
      .selectAll("rect")
      .data(heatmapData)
      .join("rect")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", gridSize)
      .attr("height", gridSize)
      .attr("fill", (d) => colorScale(d.count))
      .attr("stroke", "#eee")
      .attr("stroke-width", 0.5);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default Heatmap;
