import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";

export default function AreaChart({ config, height }) {
  if (!config) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          ⏳ Loading chart...
        </Typography>
      </Box>
    );
  }

  const options = {
    chart: {
      type: "area",
      height: height,
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, Poppins, sans-serif",
      },
      events: {
        render: function () {
          const chart = this;

          // Purane lines hatao (refresh ke liye)
          if (chart.customLines) {
            chart.customLines.forEach((line) => line.destroy());
          }
          chart.customLines = [];

          chart.series.forEach((series) => {
            series.points.forEach((point) => {
              if (point.graphic) {
                const x = point.plotX + chart.plotLeft;
                const yTop = point.plotY + chart.plotTop;
                const yBottom = chart.plotHeight + chart.plotTop;

                // ✅ dotted vertical line
                const line = chart.renderer
                  .path(["M", x, yTop, "L", x, yBottom])
                  .attr({
                    "stroke-width": 1,
                    stroke: "#9CA3AF", // grey dotted line
                    dashstyle: "Dash", // ✅ dotted
                  })
                  .add();

                chart.customLines.push(line);
              }
            });
          });
        },
      },
    },
    title: { text: "" },
    navigation: { buttonOptions: { enabled: false } },
    credits: { enabled: false },

    xAxis: {
      categories: config.categories,
      labels: {
        style: {
          fontWeight: "normal",
          fontSize: "0.625rem",
          color: "#000",
        },
        rotation: 0,
        useHTML: true,
        formatter: function () {
          return this.value.split(" ").join("<br>");
        },
      },
      crosshair: true,
      lineColor: "#9ca3af",
    },

    yAxis: {
      min: 0,
      max: config.maxValue,
      tickInterval: 15,
      tickAmount: 5,
      gridLineWidth: 0,
      lineColor: "#9ca3af",
      lineWidth: 1,
      labels: {
        style: {
          color: "#374151", // ✅ gray-700
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      title: { text: "" },
    },

    tooltip: {
      shared: true,
      backgroundColor: "rgba(8, 8, 8, 0.95)",
      borderRadius: 8,
      borderColor: "#E5E7EB",
      shadow: true,
      style: { fontSize: "0.8rem", color: "#f7f7f8ff" },
      formatter: function () {
        let s = `<b>${this.key}</b><br/>`;
        this.points.forEach((p) => {
          s += `${p.series.name}: ${p.y}${
            p.series.type === "line" ? "" : "%"
          }<br/>`;
        });
        return s;
      },
    },

    plotOptions: {
      area: {
        stacking: "normal",
        fillOpacity: 0.5,
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 4,
          fillColor: "#fff",
          lineWidth: 2,
          lineColor: "#550080", // auto pick series color
        },
        states: {
          hover: {
            lineWidth: 2.5,
          },
        },
        // dataLabels: {
        //   style: {
        //     textOutline: false,
        //     fontSize: "0.7rem",
        //   },
        //   enabled: true,
        //   verticalAlign: "bottom",
        //   formatter: function () {
        //     if (this) {
        //       return this.y + "%";
        //     }
        //   },
        // },
        dataLabels: {
          enabled: true,
          format: "{y}%",
          align: "center",
          verticalAlign: "top", // keeps all labels above
          y: 0, // adjust spacing from point
          style: {
            textOutline: false,
            fontSize: "0.7rem",
          },
          allowOverlap: true, // prevents auto-adjustment
          crop: false,
          overflow: "none",
        },
      },
      series: {
        cursor: "pointer",
        animation: { duration: 1000, easing: "easeOutCubic" },
        marker: { states: { hover: { radius: 6 } } },
      },
    },

    legend: {
      enabled: false,
    },

    colors: [
      {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, "rgba(124, 58, 237, 0.6)"], // violet top
          [1, "rgba(124, 58, 237, 0.05)"], // transparent bottom
        ],
      },
      {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, "rgba(20, 184, 166, 0.6)"], // teal top
          [1, "rgba(20, 184, 166, 0.05)"], // transparent bottom
        ],
      },
    ],

    series: config.series, // ✅ backend se ready data
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
