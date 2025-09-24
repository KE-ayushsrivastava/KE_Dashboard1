import React from "react";
import { Box, Typography } from "@mui/material";

export default function PieChart() {
  return (
    <Box
      sx={{
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f0f8ff",
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        🥧 Pie Chart Placeholder
      </Typography>
    </Box>
  );
}
