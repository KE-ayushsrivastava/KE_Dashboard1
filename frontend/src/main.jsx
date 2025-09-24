import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./config/theme";
import "@fontsource/inter"; // ✅ add this
import "@fontsource/poppins"; // ✅ add this
import "./custom.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* ✅ resets + applies fonts */}
    <App />
  </ThemeProvider>
);
