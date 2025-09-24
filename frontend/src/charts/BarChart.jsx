import React from "react";
import { Box, Typography } from "@mui/material";

export default function BarChart() {
  return (
    <Box
      sx={{
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        📊 Bar Chart Placeholder
      </Typography>
    </Box>
  );
}
