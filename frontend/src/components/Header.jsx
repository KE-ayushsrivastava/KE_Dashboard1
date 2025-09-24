import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function Header({ logoText = "LOGO", onLogout, onMenuClick, open }) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {/* Hamburger / collapse icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>

        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {logoText}
        </Typography>

        <Button
          variant="contained"
          color="secondary" // or "secondary" depending on your theme
          size="small"
          onClick={onLogout}
          sx={{
            borderRadius: "20px",
            px: 3,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
