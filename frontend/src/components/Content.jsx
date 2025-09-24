import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import Sidebar, { drawerWidth, collapsedWidth } from "./Sidebar";
import "../custom.css"; // make sure this path matches your project
import Filters from "./Filters";
import { filterConfig } from "../config/filtersData";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CardX from "./CardX"; // ✅ your custom Card component
import tabDetails from "../config/tabDetails";

export default function Content({ children }) {
  const [open, setOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("KPI");

  // store API-returned configs for each question
  const [charts, setCharts] = useState([]);

  const toggleDrawer = () => setOpen((prev) => !prev);

  // keep this simple — just change tab state
  const handleTabSelect = (tab) => setSelectedTab(tab);

  // ✅ Single filters state
  const [filters, setFilters] = useState(
    filterConfig.reduce((acc, f) => ({ ...acc, [f.key]: [] }), {})
  );

  const updateFilter = (key, values) => {
    const safeValues = Array.isArray(values) ? values : values ? [values] : [];
    setFilters((prev) => ({ ...prev, [key]: safeValues }));
  };

  // ✅ normal function (no useCallback needed)
  const handleApply = async (overrideFilters) => {
    const activeFilters = overrideFilters || filters;
    debugger;
    try {
      console.log("Applied Filters:", { ...filters, selectedTab });
      console.log(activeFilters);
      const questions = tabDetails[selectedTab] || [];

      const results = await Promise.all(
        questions.map(async (q) => {
          const params = new URLSearchParams();
          params.set("questionType", q.questionType);
          params.set("chartType", q.chartType);
          params.set("variableName", q.variableName);

          // filters add karo
          Object.entries(activeFilters).forEach(([key, vals]) => {
            if (Array.isArray(vals) && vals.length > 0) {
              params.set(key, vals.join(","));
            }
          });

          const url = `/chart_data?${params.toString()}`;
          console.log("API URL:", url);

          const res = await fetch(url);
          if (!res.ok) {
            console.error("API error for", q.title, await res.text());
            return { ...q, config: null, error: true };
          }
          const config = await res.json();
          return { ...q, config };
        })
      );

      setCharts(results);
    } catch (err) {
      console.error("handleApply error:", err);
    }
  };

  // whenever selectedTab changes → re-run apply
  useEffect(() => {
    handleApply();
  }, [selectedTab]);

  const handleReset = () => {
    const cleared = filterConfig.reduce(
      (acc, f) => ({ ...acc, [f.key]: [] }),
      {}
    );
    setFilters(cleared);
    handleApply(cleared); // 👈 yaha direct cleared filters bhej do
  };

  const questions = tabDetails[selectedTab] || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Body: Sidebar + Main */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar
          tabs={["KPI", "Pre-Sales", "Facility"]}
          onSelect={handleTabSelect}
          activeTab={selectedTab}
          onLogout={() => {}}
          open={open}
          toggleDrawer={toggleDrawer}
        />

        {/* Collapse Button */}
        <IconButton
          className="collapse-btn"
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            top: "4%",
            transform: "translateY(-50%)",
            backgroundColor: "#FFF",
            borderRadius: "50%",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#F0F0F0",
              color: "#415FFF",
            },
            left: open ? `${drawerWidth - 15}px` : `${collapsedWidth - 15}px`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              transition: "transform 0.3s ease",
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <ChevronLeftIcon />
          </Box>
        </IconButton>

        {/* Main content */}
        <Box
          component="main"
          className="main-content"
          sx={{
            flexGrow: 1,
            p: 3,
            pt: 1,
            marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
            width: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${collapsedWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(["margin-left", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          {/* Filters */}
          <Box>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 8px;",
              }}
            >
              <CardContent sx={{ padding: "16px !important" }}>
                <Grid container spacing={1} alignItems="center">
                  {filterConfig.map((f) => (
                    <Grid item xs={12} md={3} key={f.key}>
                      <Filters
                        label={f.label}
                        options={f.options}
                        selected={filters[f.key]}
                        setSelected={(vals) => updateFilter(f.key, vals)}
                        field={f.key}
                      />
                    </Grid>
                  ))}

                  {/* Buttons row */}
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApply()}
                    >
                      Apply
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Active Tab Title */}
          {/* <h2>{selectedTab}</h2> */}
          {children}

          {/* ✅ Dynamic Cards */}
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {charts.length > 0
              ? charts.map((c) => (
                  <CardX
                    key={c.id}
                    width={c.width}
                    height={c.chartHeight}
                    title={c.title}
                  >
                    {c.chartType === "ColumnX"
                      ? // 👇 ColumnXChart ko as JSX render karo
                        (() => {
                          const ChartComp = c.component;
                          return (
                            <ChartComp
                              config={c.config}
                              height={c.chartHeight}
                            />
                          );
                        })()
                      : // 👇 Baaki charts ke liye cloneElement hi rakho
                        React.cloneElement(c.component, {
                          config: c.config,
                          height: c.chartHeight,
                        })}
                  </CardX>
                ))
              : (tabDetails[selectedTab] || []).map((q) => (
                  <CardX
                    key={q.id}
                    width={q.width}
                    height={q.chartHeight}
                    title={q.title}
                  >
                    {React.isValidElement(q.component)
                      ? // Case 1: Already JSX element (e.g. <AreaChart />)
                        React.cloneElement(q.component, {
                          config: q.config,
                          height: q.chartHeight,
                        })
                      : // Case 2: Function reference (e.g. ColumnXChart)
                        React.createElement(q.component, {
                          config: q.config,
                          height: q.chartHeight,
                        })}
                  </CardX>
                ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
