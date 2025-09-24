import React from "react";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
import LineChart from "../charts/LineChart";
import AreaChart from "../charts/AreaChart";
import ColumnChart from "../charts/ColumnChart";
import StackColumnChart from "../charts/StackColumnChart";
import ColumnXChart from "../charts/ColumnXChart";

const tabDetails = {
  KPI: [
    {
      id: 1,
      title: "Experienced Index",
      width: 6,
      questionType: "Single_Select",
      chartType: "Area",
      variableName: "QA2",
      chartHeight: 220,
      component: <AreaChart />,
    },
    {
      id: 2,
      title: "Overall Satisfaction",
      width: 6,
      questionType: "Single_Select",
      chartType: "ColumnX",
      variableName: "QA1",
      chartHeight: 220,
      component: ColumnXChart,
    },
    {
      id: 3,
      title: "NPS",
      width: 6,
      questionType: "NPS",
      chartType: "Stack_Column",
      variableName: "QA2",
      chartHeight: 220,
      component: <StackColumnChart />,
    },
    {
      id: 4,
      title: "Likely to Repurchase",
      width: 6,
      questionType: "Single_Select",
      chartType: "Column",
      variableName: "QA4",
      chartHeight: 220,
      component: <ColumnChart />,
    },
  ],
  "Pre-Sales": [
    {
      id: 5,
      title: "Pre-Sales Satisfaction",
      width: 6,
      questionType: "Single_Select",
      chartType: "Column",
      component: <ColumnChart />,
    },
    {
      id: 6,
      title: "Experience with Website",
      width: 6,
      questionType: "Single_Select",
      chartType: "Column",
      component: <ColumnChart />,
    },
    {
      id: 7,
      title:
        "Availability of Dealer Staff for interaction at pre- decided time and place",
      width: 12,
      questionType: "Single_Select",
      chartType: "Column",
      component: <ColumnChart />,
    },
  ],
  Facility: [
    {
      id: 8,
      title: "Facility Usage",
      width: 6,
      questionType: "Single_Select",
      chartType: "Column",
      component: <BarChart />,
    },
    {
      id: 9,
      title: "Maintenance Cost",
      width: 6,
      questionType: "Single_Select",
      chartType: "Column",
      component: <PieChart />,
    },
  ],
};

export default tabDetails;
