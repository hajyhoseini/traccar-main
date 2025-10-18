import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import PermDeviceInformationIcon from "@mui/icons-material/PermDeviceInformation";

const pages = ["دستگاه‌ها", "محصولات", "اسناد", "منابع", "قیمت ها"];

const fadeInScaleAnimation = `
  @keyframes fadeInScale {
    0% { opacity: 0; transform: scale(0); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

function Header({ onIconClick }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const enterSite = () => {
    sessionStorage.setItem("landingShown", "true");
    navigate("/login");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle}>
      <Typography variant="h6" align="center" sx={{ my: 2 }}>
        <img width={80} src="/images/apple-touch-icon-180x180.png" alt="logo" />
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
          <ListItemButton onClick={enterSite} sx={{ justifyContent: "center" }}>
            <LoginIcon />
            <Typography sx={{ ml: 1 }}>ورود</Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <style>{fadeInScaleAnimation}</style>

      {/* کل Container */}
      <Box
        sx={{
          height: { xs: "45vh", sm: "65vh", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(rgba(0,82,204,0.1), rgba(0,82,204,0.2)), url(/images/Hero-Desktop@2x.png)`,
          backgroundSize: "cover",
          color: "#fff",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 0 },
        }}
      >
        {/* Navbar */}
        <AppBar
          position="absolute"
          sx={{
            backgroundColor: "rgba(5, 46, 108, 0.79)",
            transition: "background-color 0.3s ease", // انتقال نرم
            direction: "ltr",
            borderRadius: "0px 0px 20px 20px",
            height: { xs: "60px", sm: "80px" },
          }}
        >
          <Toolbar
            sx={{
              display: { xs: "flex" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "inherit",
                justifyContent: { xs: "space-between", md: "flex-start" },
                alignItems: "center",
              }}
            >
              {/* نویگیشن در حالت دسکتاپ */}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: "bold",
                }}
              >
                <img
                  width={90}
                  src="/images/apple-touch-icon-180x180.png"
                  alt="logo"
                />
              </Typography>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  justifyContent: "flex-start",
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page}
                    sx={{
                      my: 2,
                      mx: { sm: "5px", md: "15px" },
                      fontSize: { sm: "16px", md: "20px" },
                      color: "#061b17ff",
                      backgroundColor: "#43cbea",
                      "&:hover": {
                        backgroundColor: "#46aabeff",
                        color: "#c6fff4ff",
                      },
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              {/* نویگیشن در حالت موبایل */}
              <Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  width: { xs: "120px" },
                  display: { xs: "flex", sm: "none" },
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => onIconClick(0)}
                  sx={{ display: { sm: "none" } }}
                >
                  <PsychologyAltIcon />
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => onIconClick(1)}
                  sx={{ display: { sm: "none" } }}
                >
                  <ChecklistRtlIcon />
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => onIconClick(2)}
                  sx={{ display: { sm: "none" } }}
                >
                  <PermDeviceInformationIcon />
                </IconButton>
              </Box>
            </Box>

            {/* دکمه ورود دسکتاپ */}
            <IconButton
              onClick={enterSite}
              sx={{
                width: { xs: "12%", md: "8%", lg: "7%" },
                height: 40,
                borderRadius: 2,
                display: { xs: "none", sm: "flex" },
                justifyContent: "space-between",
                fontSize: { sm: "16px", md: "20px" },
                color: "#061b17ff",
                backgroundColor: "#43cbea",
                "&:hover": {
                  backgroundColor: "#46aabeff",
                  color: "#c6fff4ff",
                },
              }}
            >
              <LoginIcon />
              <Typography sx={{ fontSize: "20px" }}>ورود</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer موبایل */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          {drawer}
        </Drawer>

        {/* Hero header */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 4, md: 3 },
          }}
        >
          {/* متن و دکمه */}
          <Grid
            item
            xs={12} // موبایل
            sm={6} // تبلت
            md={5} // دسکتاپ
                        // border={"1px solid white"}

          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{ width: "100%" }}
            >
              <Box sx={{ width: { xs: "140px", sm: "180px", md: "200px" } }}>
                <img
                  src="/images/2.png"
                  style={{ width: "100%", height: "auto" }}
                  alt="logo"
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.8rem" },
                  mb: 2,
                }}
              >
                موقعیت‌یابی زنده، امن و سریع
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                کاملاً بهینه و حرفه‌ای
              </Typography>

              <Button
                onClick={enterSite}
                size="large"
                fullWidth={{ xs: true, md: false }}
                sx={{
                  py: 1.5,
                  fontSize: { sm: "16px", md: "20px" },
                  color: "#061b17ff",
                  backgroundColor: "#43cbea",
                  "&:hover": {
                    backgroundColor: "#46aabeff",
                    color: "#c6fff4ff",
                  },
                }}
              >
                ورود به صفحه کاربری
                <LoginIcon sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Grid>

          {/* hero_image */}
          <Grid
            item
            xs={0} // موبایل: نمایش داده نشود
            sm={6} // تبلت
            md={7} // دسکتاپ
            display={{ xs: "none", sm: "block" }}
            // border={"1px solid white"}
          >
            <Box
              sx={{
                maxWidth: { sm: "100%", md: "100%" },
                mx: "auto",
              }}
            >
              <img
                width="112%"
                src="/images/hero_image_gimini.png"
                alt="hero_image"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Header;
