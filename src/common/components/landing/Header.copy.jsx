import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";

const pages = ["صفحه1", "صفحه2", "صفحه3"];

export default function ResponsiveNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img width={80} src="apple-touch-icon-180x180.png" alt="logo" />
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={page} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: "center" }}>
            <LoginIcon />
            <Typography sx={{ ml: 1 }}>ورود</Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }} dir="rtl">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          {/* لوگو دسکتاپ */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
          >
            <img width={80} src="apple-touch-icon-180x180.png" alt="logo" />
          </Typography>

          {/* همبرگر موبایل */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* منوی دسکتاپ */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center" }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,
                  mx: 1,
                  color: "#a4b3ceff",
                  fontSize: "20px",
                  "&:hover": { backgroundColor: "#054ab3ff" },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* دکمه ورود دسکتاپ */}
          <IconButton
            onClick={() => console.log("ورود")}
            color="inherit"
            sx={{
              width: "6%",
              height: 40,
              borderRadius: 2,
              display: { xs: "none", sm: "flex" },
              justifyContent: "space-between",
              backgroundColor: "#023189ff",
              "&:hover": { backgroundColor: "#054ab3ff" },
            }}
          >
            <LoginIcon />
            <Typography sx={{ fontSize: "16px" }}>ورود</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer موبایل */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
