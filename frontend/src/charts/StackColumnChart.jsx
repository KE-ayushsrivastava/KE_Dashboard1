import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";

export default function StackColumnChart({ config, height }) {
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
      type: "column",
      height: height,
      style: {
        fontFamily: "Inter, Poppins, sans-serif",
      },
    },
    title: { text: "" },
    navigation: { buttonOptions: { enabled: false } },
    credits: { enabled: false },

    xAxis: {
      categories: config.categories,
      lineColor: "#9ca3af", // ✅ bottom axis line
      lineWidth: 1,
      labels: {
        style: { fontWeight: "normal", fontSize: "0.625rem", color: "#000" },
        rotation: 0,
        useHTML: true,
        formatter: function () {
          return this.value.split(" ").join("<br>");
        },
      },
      crosshair: true,
    },

    yAxis: {
      min: 0,
      max: config.maxValue,
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
      stackLabels: {
        enabled: false, // ✅ hide stack labels
      },
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
      column: {
        stacking: "normal",
      },
      series: {
        cursor: "pointer",
        dataLabels: {
          style: { textOutline: false, fontSize: "0.7rem" },
          enabled: false,
          formatter: function () {
            return this.series.type === "line" ? "" : this.y + "%";
          },
        },
      },
    },

    legend: { enabled: false },

    series: [
      ...config.series, // ✅ existing stacked series (Promoter/Passive/Detractor)
      {
        name: "NPS",
        type: "line",
        data: config.nps, // ✅ overlayed NPS line
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 4,
          fillColor: "#fff",
          lineWidth: 2,
          lineColor: "#f97316", // auto pick series color
        },
        states: {
          hover: {
            lineWidth: 2.5,
          },
        },
        color: "#f97316", // dark line for contrast
        yAxis: 0, // same axis
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y;
          },
          style: {
            fontSize: "0.7rem",
            fontWeight: "bold",
            color: "#fff",
            textOutline: "0px contrast",
            fontFamily: "Inter, Arial, sans-serif",
          },
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
