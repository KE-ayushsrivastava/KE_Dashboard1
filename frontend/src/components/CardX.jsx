import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const CardX = ({ width, title, height, children }) => {
  console.log(height);
  return (
    <Grid item xs={12} size={width}>
      <Card
        sx={{
          borderRadius: 3, // ✅ smoother corners
          // ✅ softer shadow
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          height: `${height + 30}px`,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            transform: "translateY(-2px)", // ✅ subtle lift
          },
          paddingBottom: "0px !important",
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            p: 1,
            paddingBottom: "0px !important",
            paddingTop: "0px !important",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif", // ✅ new font
              fontWeight: 500,
              fontSize: "0.85rem",
              color: "#333",
              borderBottom: "1px solid #ccc",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CardX;
