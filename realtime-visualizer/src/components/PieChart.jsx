import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { capitalizeText } from "../utils.js";

const PieChart = ({ data, containerWidth = 300, containerHeight = 300 }) => {
  const svgRef = useRef();
  const [width, setWidth] = useState(containerWidth * 0.75);
  const [height, setHeight] = useState(containerHeight * 0.75);
  const radius = Math.min(width, height) / 2;

  useEffect(() => {
    if (containerWidth <= 720) {
      setHeight(containerHeight * 0.75);
      setWidth(containerWidth * 0.75);
    } else {
      setHeight(300);
      setWidth(300);
    }
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const validData = data.filter((item) => item.value > 0);
    if (validData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.attr("width", width).attr("height", height);

    const g = svg
      .selectAll("g.chart-group")
      .data([null])
      .join("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8)
      .cornerRadius(3);

    const labelArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const emotionColors = {
      happy: "#66c2a5",
      sad: "#8da0cb",
      angry: "#fc8d62",
      surprised: "#e78ac3",
      disgusted: "#a6d854",
      fearful: "#ffd92f",
      neutral: "#e5c494",
    };

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const getColor = (d) =>
      emotionColors[d.data.label.toLowerCase()] || colorScale(d.data.label);

    const arcs = g
      .selectAll("path.arc")
      .data(pie(validData), (d) => d.data.label);

    arcs.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "arc")
          .attr("fill", getColor)
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.9)
          .attr("d", arc)
          .each(function (d) {
            this._current = d;
          }),
      (update) =>
        update
          .transition()
          .duration(750)
          .attrTween("d", function (d) {
            const i = d3.interpolate(this._current, d);
            this._current = i(1);
            return (t) => arc(i(t));
          }),
      (exit) => exit.transition().duration(750).style("opacity", 0).remove()
    );

    const labelGroups = g
      .selectAll("g.label-group")
      .data(pie(validData), (d) => d.data.label)
      .join((enter) => {
        const group = enter.append("g").attr("class", "label-group");

        group
          .append("text")
          .attr("class", "label")
          .attr("text-anchor", (d) =>
            labelArc.centroid(d)[0] > 0 ? "start" : "end"
          )
          .attr("dy", ".35em")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("fill", "#000");

        group
          .append("text")
          .attr("class", "value")
          .attr("dy", "1.2em")
          .style("font-size", "11px")
          .style("fill", "#555");

        return group;
      });

    labelGroups
      .select(".label")
      .transition()
      .duration(750)
      .attr("transform", (d) => {
        const [x, y] = labelArc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .text((d) => capitalizeText(d.data.label));

    labelGroups
      .select(".value")
      .transition()
      .duration(750)
      .attr("transform", (d) => {
        const [x, y] = labelArc.centroid(d);
        return `translate(${x}, ${y + 15})`;
      })
      .text((d) => {
        const totalValue = d3.sum(validData, (d) => d.value);
        const percent = Math.round((d.data.value / totalValue) * 100);
        return `${d.data.value} (${percent}%)`;
      });
  }, [data, width, height]);

  return (
    <div className="pie-chart-container">
      <svg style={{ overflow: "visible" }} ref={svgRef}></svg>
      {data && data.length > 0 && (
        <div
          className="total-count"
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          Total detections: {data.reduce((sum, item) => sum + item.value, 0)}
        </div>
      )}
    </div>
  );
};

export default PieChart;
