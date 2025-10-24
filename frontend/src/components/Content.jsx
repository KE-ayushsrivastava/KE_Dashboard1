import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import "../custom.css";
import Filters from "./Filters";
import { filterConfig } from "../config/filtersData";
import CardX from "./CardX";
import tabDetails from "../config/tabDetails";

export default function Content({ children }) {
  const [selectedTab, setSelectedTab] = useState("KPI");

  // store API-returned configs for each question
  const [charts, setCharts] = useState([]);

  // ✅ Tab change handler
  const handleTabSelect = (tab) => setSelectedTab(tab);

  // ✅ Filters state
  const [filters, setFilters] = useState(
    filterConfig.reduce((acc, f) => ({ ...acc, [f.key]: [] }), {})
  );

  const updateFilter = (key, values) => {
    const safeValues = Array.isArray(values) ? values : values ? [values] : [];
    setFilters((prev) => ({ ...prev, [key]: safeValues }));
  };

  const handleApply = async (overrideFilters) => {
    const activeFilters = overrideFilters || filters;
    try {
      console.log("Applied Filters:", { ...filters, selectedTab });
      const questions = tabDetails[selectedTab] || [];

      const results = await Promise.all(
        questions.map(async (q) => {
          const params = new URLSearchParams();
          params.set("questionType", q.questionType);
          params.set("chartType", q.chartType);
          params.set("variableName", q.variableName);
          params.set("valueRange", q.valueRange);

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

  useEffect(() => {
    handleApply();
  }, [selectedTab]);

  const handleReset = () => {
    const cleared = filterConfig.reduce(
      (acc, f) => ({ ...acc, [f.key]: [] }),
      {}
    );
    setFilters(cleared);
    handleApply(cleared);
  };

  const questions = tabDetails[selectedTab] || [];
  console.log("q" + selectedTab);
  const getWidthPercent = (width) => {
    // assuming 12-column layout logic
    const colSpan = Math.min(width || 4, 12);
    return `${(colSpan / 12) * 100}%`;
  };

  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Dropdown replacing Sidebar */}

      {/* Main Content */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: 1,
          width: "100%",
        }}
      >
        {/* Filters Section */}
        <Box>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 8px;",
            }}
          >
            <CardContent sx={{ padding: "10px !important" }}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                {/* Left side – Filters & Buttons */}
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {filterConfig.map((f) => (
                    <Box
                      key={f.key}
                      sx={{
                        m: 0.2,
                        flex: "1 1 1 22%",
                      }}
                    >
                      <Filters
                        label={f.label}
                        options={f.options}
                        selected={filters[f.key]}
                        setSelected={(vals) => updateFilter(f.key, vals)}
                        field={f.key}
                      />
                    </Box>
                  ))}

                  <Box sx={{ display: "flex", gap: 0.5, m: 0.2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApply()}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>

                {/* Right side – Dropdown */}
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{
                      minWidth: 100,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                    size="small"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                  >
                    <InputLabel
                      id="tab-select-label"
                      sx={{ fontSize: 12, top: 2 }}
                    >
                      Select Tab
                    </InputLabel>
                    <Select
                      labelId="tab-select-label"
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      value={selectedTab}
                      label="Select Tab"
                      onChange={(e) => handleTabSelect(e.target.value)}
                      sx={{ fontSize: 12 }}
                      MenuProps={{
                        disableScrollLock: true, // Optional: prevent scroll issue
                        PaperProps: {
                          onMouseEnter: () => setOpen(true), // Keep menu open while hovering
                          onMouseLeave: () => setOpen(false),
                        },
                      }}
                    >
                      <MenuItem value="KPI" sx={{ fontSize: 12 }}>
                        KPI
                      </MenuItem>
                      <MenuItem value="Pre-Sales" sx={{ fontSize: 12 }}>
                        Pre-Sales
                      </MenuItem>
                      <MenuItem value="Facility" sx={{ fontSize: 12 }}>
                        Facility
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {children}

        {/* Dynamic Cards */}
        {/* <Grid container spacing={1} sx={{ mt: 1 }}>
          {charts.length > 0
            ? charts.map((c) => (
                <CardX
                  key={c.id}
                  width={c.width}
                  height={c.chartHeight}
                  title={c.title}
                >
                  {c.chartType === "ColumnX"
                    ? (() => {
                        const ChartComp = c.component;
                        return (
                          <ChartComp config={c.config} height={c.chartHeight} />
                        );
                      })()
                    : React.cloneElement(c.component, {
                        config: c.config,
                        height: c.chartHeight,
                      })}
                </CardX>
              ))
            : questions.map((q) => (
                <CardX
                  key={q.id}
                  width={q.width}
                  height={q.chartHeight}
                  title={q.title}
                >
                  {React.isValidElement(q.component)
                    ? React.cloneElement(q.component, {
                        config: q.config,
                        height: q.chartHeight,
                      })
                    : React.createElement(q.component, {
                        config: q.config,
                        height: q.chartHeight,
                      })}
                </CardX>
              ))}
        </Grid>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={1}
          sx={{
            width: "100%",
            alignItems: "start",
            mt: 1,
          }}
        >
          {(charts.length > 0 ? charts : questions).map((item) => (
            <Box
              key={item.id}
              sx={{
                width: getWidthPercent(item.width),
                display: "inline-block",
              }}
            >
              <CardX
                width={item.width}
                height={item.chartHeight}
                title={item.title}
                sx={{
                  height: item.chartHeight,
                  width: "100%",
                }}
              >
                {item.chartType === "ColumnX"
                  ? (() => {
                      const ChartComp = item.component;
                      return (
                        <ChartComp
                          config={item.config}
                          height={item.chartHeight}
                        />
                      );
                    })()
                  : React.isValidElement(item.component)
                  ? React.cloneElement(item.component, {
                      config: item.config,
                      height: item.chartHeight,
                    })
                  : React.createElement(item.component, {
                      config: item.config,
                      height: item.chartHeight,
                    })}
              </CardX>
            </Box>
          ))}
        </Masonry> */}
        {selectedTab === "Facility" ? (
          <Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={1}
            sx={{
              width: "100%",
              alignItems: "start",
              mt: 0.5,
            }}
          >
            {(charts.length > 0 ? charts : questions).map((item) => (
              <Box
                key={item.id}
                sx={{
                  width: getWidthPercent(item.width),
                  display: "inline-block",
                }}
              >
                <CardX
                  width={item.width}
                  height={item.chartHeight}
                  title={item.title}
                  sx={{
                    height: item.chartHeight,
                    width: "100%",
                  }}
                >
                  {item.chartType === "ColumnX"
                    ? (() => {
                        const ChartComp = item.component;
                        return (
                          <ChartComp
                            config={item.config}
                            height={item.chartHeight}
                          />
                        );
                      })()
                    : React.isValidElement(item.component)
                    ? React.cloneElement(item.component, {
                        config: item.config,
                        height: item.chartHeight,
                      })
                    : React.createElement(item.component, {
                        config: item.config,
                        height: item.chartHeight,
                      })}
                </CardX>
              </Box>
            ))}
          </Masonry>
        ) : (
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
                      ? (() => {
                          const ChartComp = c.component;
                          return (
                            <ChartComp
                              config={c.config}
                              height={c.chartHeight}
                            />
                          );
                        })()
                      : React.cloneElement(c.component, {
                          config: c.config,
                          height: c.chartHeight,
                        })}
                  </CardX>
                ))
              : questions.map((q) => (
                  <CardX
                    key={q.id}
                    width={q.width}
                    height={q.chartHeight}
                    title={q.title}
                  >
                    {React.isValidElement(q.component)
                      ? React.cloneElement(q.component, {
                          config: q.config,
                          height: q.chartHeight,
                        })
                      : React.createElement(q.component, {
                          config: q.config,
                          height: q.chartHeight,
                        })}
                  </CardX>
                ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
