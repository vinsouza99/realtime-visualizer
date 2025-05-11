import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// LineChart component for displaying face distance data over time
const LineChart = ({ data, width = 600, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set margins
    const margin = { top: 40, right: 50, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the main group element
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.timestamp)))
      .range([0, innerWidth]);

    // Add a 10% buffer to y-scale for better visualization
    const yMin = d3.min(data, (d) => d.distance) * 0.9;
    const yMax = d3.max(data, (d) => d.distance) * 1.1;

    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    // Create the line generator
    const line = d3
      .line()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(d.distance))
      .curve(d3.curveMonotoneX); // Smooth curve

    // Add the line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4dabf7")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line)
      .transition() // Call Transition Method
      .duration(4000) // Set Duration timing (ms)
      .ease(d3.easeLinear); //;

    // Add data points
    g.selectAll(".data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d) => xScale(new Date(d.timestamp)))
      .attr("cy", (d) => yScale(d.distance))
      .attr("r", 4)
      .attr("fill", "#228be6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mouseover", function (event, d) {
        // Enlarge point on hover
        d3.select(this).transition().duration(200).attr("r", 6);

        // Show tooltip
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div style="padding: 8px;">
              <div>Time: ${new Date(d.timestamp).toLocaleTimeString()}</div>
              <div>Distance: ${d.distance.toFixed(2)} cm</div>
            </div>
          `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("r", 4);

        tooltip.style("opacity", 0);
      });

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("z-index", "10")
      .style("opacity", 0);

    // Add x-axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%H:%M:%S"))
      );

    // Style x-axis
    xAxis.selectAll("line").style("stroke", "#ddd");
    xAxis.selectAll("path").style("stroke", "#ddd");

    // Add y-axis
    const yAxis = g.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => `${d} cm`)
    );

    // Style y-axis
    yAxis.selectAll("line").style("stroke", "#ddd");
    yAxis.selectAll("path").style("stroke", "#ddd");

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .style("stroke", "#eee")
      .style("stroke-opacity", "0.5");

    // Add x-axis label
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Time");

    // Add y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Distance (cm)");

    // Add average line if we have enough data
    if (data.length > 1) {
      const avgDistance = d3.mean(data, (d) => d.distance);

      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(avgDistance))
        .attr("y2", yScale(avgDistance))
        .attr("stroke", "#fa5252")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4")
        .transition() // Call Transition Method
        .duration(4000) // Set Duration timing (ms)
        .ease(d3.easeLinear);

      g.append("text")
        .attr("x", innerWidth - 5)
        .attr("y", yScale(avgDistance) - 5)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .style("fill", "#fa5252")
        .text(`Avg: ${avgDistance.toFixed(1)} cm`);
    }

    // Handle tooltip cleanup when component unmounts
    return () => {
      d3.selectAll(".d3-tooltip").remove();
    };
  }, [data, width, height]);

  return (
    <div className="line-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChart;
