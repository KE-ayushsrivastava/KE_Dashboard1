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
      type: "line",
      height: height,
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, Poppins, sans-serif",
      },
    },
    title: { text: "" },
    navigation: { buttonOptions: { enabled: false } },
    credits: { enabled: false },

    xAxis: {
      categories: config.categories,
      labels: {
        style: {
          fontWeight: "400",
          fontSize: "0.75rem",
          color: "#6B7280",
        },
        useHTML: true,
        formatter: function () {
          return this.value.split(" ").join("<br>");
        },
      },
      crosshair: true,
      lineColor: "#000",
    },

    yAxis: {
      min: 0,
      max: config.maxValue,
      title: { text: "" },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      tickInterval: 15,
      //stickAmount: 5, // ✅ always 6 ticks only
      labels: {
        style: {
          fontSize: "0.75rem",
          color: "#6B7280",
        },
      },
    },

    tooltip: {
      shared: true,
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: 8,
      borderColor: "#E5E7EB",
      shadow: true,
      style: { fontSize: "0.8rem", color: "#111827" },
      formatter: function () {
        return (
          `<b>${this.x}</b><br/>` +
          this.points
            .map(
              (p) =>
                `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${p.y}</b>`
            )
            .join("<br/>")
        );
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
        dataLabels: {
          enabled: false, // ✅ less clutter, cleaner look
        },
      },
      series: {
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
