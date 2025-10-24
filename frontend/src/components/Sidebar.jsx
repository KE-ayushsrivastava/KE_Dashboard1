import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";
import LogoutIcon from "@mui/icons-material/Logout";
import sidebarBg from "../assets/img/sidebar_bg.png";
import orgLogo from "../assets/img/kelogo.png";
import orgLogo2 from "../assets/img/kelogo2.png";

export const drawerWidth = 210;
export const collapsedWidth = 72;

const iconMap = {
  KPI: <DashboardIcon />,
  "Pre-Sales": <TrendingUpIcon />,
  Facility: <BusinessIcon />,
};

export default function Sidebar({
  tabs = ["KPI", "Pre-Sales", "Facility"],
  onSelect = () => {},
  open = true,
  activeTab,
  toggleDrawer,
}) {
  const width = open ? drawerWidth : collapsedWidth;

  return (
    <Box component="nav" sx={{ width, flexShrink: 0 }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width,
            boxSizing: "border-box",
            height: `100%`,
            overflowX: "hidden",
            whiteSpace: "nowrap",
            backgroundImage: `url(${sidebarBg}),linear-gradient(#415fff, #324ee4)`, // ✅ image
            backgroundSize: "cover", // ✅ cover entire sidebar
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
        open
      >
        {/* Logo */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#FFF" }}>
            <img
              src={open ? orgLogo : orgLogo2}
              alt="Organization Logo"
              style={{
                maxHeight: open ? "40px" : "32px", // ✅ adjust size when closed
                transition: "all 0.3s ease-in-out", // ✅ smooth resize
              }}
            />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <List disablePadding>
            {tabs.map((tab) => (
              <Tooltip
                key={tab}
                title={open ? "" : tab}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => onSelect(tab)}
                  selected={activeTab === tab}
                  sx={{
                    mx: 1,
                    my: 1,
                    py: 0,
                    borderRadius: "8px", // ✅ better look
                    backgroundColor:
                      activeTab === tab ? "#fff !important" : "transparent", // let bg-image show
                    color: activeTab === tab ? "#415FFF" : "#fff",
                    "&:hover": {
                      backgroundColor:
                        activeTab === tab ? "#fff !important" : "#FFF",
                      color: activeTab === tab ? "#415FFF" : "#415FFF",
                      "& .MuiListItemIcon-root": {
                        color: "#415FFF", // ✅ change icon color on hover
                      },
                      "& .MuiListItemText-root": {
                        color: "#415FFF", // ✅ change text color on hover
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      justifyContent: "center",
                      color: activeTab === tab ? "#415FFF" : "#FFF",
                    }}
                  >
                    {iconMap[tab] ?? <DashboardIcon />}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={tab}
                      primaryTypographyProps={{
                        fontSize: "0.95rem", // ✅ professional font size
                        fontWeight: activeTab === tab ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Box>
        <Box sx={{ mb: 2, borderTop: "1px solid #ccc" }}>
          <Tooltip
            key="Logout"
            title={open ? "" : "Logout"}
            placement="right"
            arrow
          >
            <ListItemButton
              sx={{
                mx: 1,
                my: 1,
                py: 0,
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#FFF",
                  color: "#415FFF",
                  "& .MuiListItemIcon-root": {
                    color: "#415FFF", // ✅ change icon color on hover
                  },
                  "& .MuiListItemText-root": {
                    color: "#415FFF", // ✅ change text color on hover
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: "center",
                  color: "#FFF",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>
    </Box>
  );
}
