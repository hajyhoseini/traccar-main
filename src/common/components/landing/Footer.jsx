import {
  Box,
  Typography,
  Grid,
  Container,
  Link,
  IconButton,
  Button,
} from "@mui/material";
import { useEffect, useRef } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

// animations
const fadeInScaleAnimation = `
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-grid {
    animation: fadeInScale 0.6s ease-out;
  }
`;

const pages = ["دستگاه‌ها", "محصولات", "اسناد", "منابع", "قیمت‌ها"];

function Footer({
  logoSrc = "/images/2.png",
  bg = `linear-gradient(rgba(1, 39, 95, 0.97), rgba(5, 46, 108, 0.73)), url(/images/splash-map.png)`,
  color = "#ffffff",
  compact = false,
}) {
  const gridRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-grid");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    gridRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      gridRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  const navigate = useNavigate();

  const enterSite = () => {
    sessionStorage.setItem("landingShown", "true");
    navigate("/login");
  };

  return (
    <>
      <style>{fadeInScaleAnimation}</style>
      <Box
        component="footer"
        dir="rtl"
        sx={{
          background: bg,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: color,
          pt: compact ? { xs: 3, sm: 4 } : { xs: 4, sm: 5, md: 6 },
          pb: compact ? { xs: 3, sm: 4 } : { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={{ xs: 2, sm: 1, md: 4 }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            {/* 1*/}
            <Grid
              size={{ xs: 12, sm: 5, md: 6 }}
              display={"flex"}
              justifyContent={{ xs: "space-between", md: "flex-start" }}
            >
              <Grid ref={(el) => (gridRefs.current[0] = el)}>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3 }}
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                >
                  {/* DTS (لوگو + توضیحات) */}
                  <Grid size={{ xs: 10, md: 12 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      textAlign="center"
                      gap={1.5}
                      dir="rtl"
                      sx={{ width: "100%" }}
                    >
                      {/* لوگو */}
                      {logoSrc ? (
                        <Box
                          component="img"
                          src={logoSrc}
                          alt="DTS"
                          sx={{
                            height: {
                              xs: 70,
                              sm: 80,
                              md: 90,
                              lg: 100,
                              xl: 110,
                            },
                            width: "auto",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: {
                              xs: "1.2rem",
                              sm: "1.3rem",
                              md: "1.4rem",
                              lg: "1.6rem",
                              xl: "1.8rem",
                            },
                          }}
                        >
                          DTS
                        </Typography>
                      )}

                      {/* شعار */}
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: {
                            xs: "1rem", // ≈ 16px
                            sm: "1.05rem",
                            md: "1.25rem", // ≈ 20px
                            lg: "1.3rem",
                            xl: "1.4rem",
                          },
                          maxWidth: {
                            xs: "90%",
                            sm: "85%",
                            md: "75%",
                            lg: "70%",
                            xl: "65%",
                          },
                          lineHeight: 1.6,
                        }}
                      >
                        نسل جدید سامانه‌های مدیریت ناوگان
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* لینک ها*/}
              <Grid
                size={{ xs: 8, sm: 5, md: 3 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center" },
                  gap: 1.2,
                  dir: "rtl",
                }}
              >
                {/* هدر بخش */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                    mb: 1,
                    color: "white",
                    textAlign: { xs: "center" },
                  }}
                >
                  لینک‌ها
                </Typography>

                {/* لیست لینک‌ها */}
                <Box
                  component="nav"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center" },
                    gap: 0.8,
                  }}
                >
                  {pages.map((page, index) => (
                    <Link
                      key={index}
                      href={`#${page}`} // میتونی تغییر بدی یا وصلش کنی به روت‌ها
                      underline="none"
                      sx={{
                        color: "#effaffff",
                        fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                        width: "90px",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        p: 0.3,
                        "&:hover": {
                          color: "#b2e3f7ff",
                          bgcolor: "rgba(255,255,255,0.1)",
                          borderRadius: "5px",
                        },
                      }}
                    >
                      {page}
                    </Link>
                  ))}
                </Box>
              </Grid>

              {/* ارتباط با مشتریان */}
              <Grid
                size={{ md: 3 }}
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  alignItems: { md: "center" },
                  textAlign: { xs: "center" },
                }}
              >
                {/* عنوان */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                    mb: 2,
                  }}
                >
                  ارتباط با مشتریان
                </Typography>

                {/* تلفن */}
                <Box>
                  <Link
                    href="tel:+982145702221"
                    underline="none"
                    sx={{
                      display: "inline-block",
                      color: "#def6ffff",
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      transition: "all 0.3s ease",
                      width: "160px",
                      textAlign: "center",
                      py: 0.5,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#b2e3f7ff",
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "5px",
                      },
                    }}
                  >
                    تلفن: +98 21 45702221
                  </Link>
                </Box>

                {/* ایمیل */}
                <Box>
                  <Link
                    href="mailto:info@DTSAI.ir"
                    underline="none"
                    sx={{
                      display: "inline-block", // 👈 اینجا هم
                      color: "#e3f6fdff",
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      transition: "all 0.3s ease",
                      width: "160px",
                      textAlign: "center",
                      py: 0.5,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#b2e3f7ff",
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "5px",
                      },
                    }}
                  >
                    ایمیل : info@DTSAI.ir
                  </Link>
                </Box>
              </Grid>
            </Grid>

            {/* 2 */}
            <Grid
              mt={{ xs: 2, sm: 0 }}
              size={{ xs: 12, sm: 7, md: 6 }}
              display={"flex"}
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent={{ xs: "space-between", md: "flex-end" }}
            >
              <Box
                display={"flex"}
                justifyContent={{ xs: "space-between" }}
                order={{xs:1, md:3}}
              >
                {/* ارتباط با مشتریان */}
                <Grid
                  size={{ xs: 12, sm: 12, md: 5 }}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "center" },
                    textAlign: { xs: "center" },
                  }}
                >
                  {/* عنوان */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                      mb: 2,
                    }}
                  >
                    ارتباط با مشتریان
                  </Typography>

                  {/* تلفن */}
                  <Box>
                    <Link
                      href="tel:+982145702221"
                      underline="none"
                      sx={{
                        display: "inline-block",
                        color: "#def6ffff",
                        fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                        transition: "all 0.3s ease",
                        width: "160px",
                        textAlign: "center",
                        py: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                          color: "#b2e3f7ff",
                          bgcolor: "rgba(255,255,255,0.1)",
                          borderRadius: "5px",
                        },
                      }}
                    >
                      تلفن: +98 21 45702221
                    </Link>
                  </Box>

                  {/* ایمیل */}
                  <Box>
                    <Link
                      href="mailto:info@DTSAI.ir"
                      underline="none"
                      sx={{
                        display: "inline-block", // 👈 اینجا هم
                        color: "#e3f6fdff",
                        fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                        transition: "all 0.3s ease",
                        width: "160px",
                        textAlign: "center",
                        py: 0.5,
                        borderRadius: 1,
                        "&:hover": {
                          color: "#b2e3f7ff",
                          bgcolor: "rgba(255,255,255,0.1)",
                          borderRadius: "5px",
                        },
                      }}
                    >
                      ایمیل : info@DTSAI.ir
                    </Link>
                  </Box>
                </Grid>

                {/* محدوده تحت پوشش + آیکون‌ها */}
                <Grid
                  size={{ xs: 12, sm: 12, md: 12 }}
                  ref={(el) => (gridRefs.current[1] = el)}
                  display="flex"
                  flexDirection="column"
                  alignItems={{ xs: "center" }}
                  dir="rtl"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.85rem",
                        md: "0.9rem",
                      },
                      textAlign: "right",
                    }}
                  >
                    محدوده تحت پوشش
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 1, sm: 1.5 },
                      mb: 2,
                      justifyContent: { xs: "center", sm: "flex-end" },
                    }}
                  >
                    {["تهران", "قم", "کرج", "قزوین"].map((city) => (
                      <Typography
                        key={city}
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                          textAlign: "right",
                        }}
                      >
                        {city}
                      </Typography>
                    ))}
                  </Box>
                  <Box
                    display="flex"
                    justifyContent={{ xs: "center", sm: "flex-end" }}
                    gap={{ xs: 0.5, sm: 1, md: 1.5 }}
                  >
                    {[
                      {
                        href: "https://www.facebook.com",
                        icon: <FacebookIcon />,
                        label: "facebook",
                      },
                      {
                        href: "https://twitter.com",
                        icon: <TwitterIcon />,
                        label: "twitter",
                      },
                      {
                        href: "https://www.instagram.com",
                        icon: <InstagramIcon />,
                        label: "instagram",
                      },
                      {
                        href: "https://www.youtube.com",
                        icon: <YouTubeIcon />,
                        label: "youtube",
                      },
                      {
                        href: "https://www.linkedin.com",
                        icon: <LinkedInIcon />,
                        label: "linkedin",
                      },
                    ].map((social) => (
                      <IconButton
                        key={social.label}
                        aria-label={social.label}
                        href={social.href}
                        size="small"
                        sx={{
                          color: color,
                          "&:hover": {
                            color: "#87CEEB",
                            transform: "scale(1.15)",
                            transition:
                              "transform 0.2s ease-in-out, color 0.2s",
                          },
                          fontSize: {
                            xs: "1rem",
                            sm: "1.1rem",
                            md: "1.2rem",
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Box>
                </Grid>
              </Box>

              {/* دکمه */}
              <Grid
                mt={{ xs: 4, md: 0 }}
                size={{ xs: 12, md: 5 }}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={{ xs: "center" }}
                alignItems={{ xs: "center" }}
                order={{xs:3 , md:1}}
              >
                <Box>
                  <Button
                    onClick={enterSite}
                    size="large"
                    fullWidth={{ xs: true }}
                    sx={{
                      py: 1.5,
                      fontSize: { sm: "16px" },
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
