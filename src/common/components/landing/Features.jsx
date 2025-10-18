import { Box, Typography, Grid, Card, CardMedia } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useEffect, useRef } from "react";

// animation for feature box
const fadeInScaleAnimation = `
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-box {
    animation: fadeInScale 0.8s ease-out;
  }
`;

function Features({ featureRefs }) {
  const boxRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-box");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    boxRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      boxRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <>
      <style>{fadeInScaleAnimation}</style>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "100vh" },
          py: { xs: 3, sm: 5 },
        }}
      >
        {/* background layer */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url(/images/route-compressed.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%) blur(5px)",
            zIndex: 0,
          }}
        />
        {/* باکس اول */}
        <Box
          className="box1"
          ref={(el) => (featureRefs.current[0] = el)}
          sx={{
            py: { xs: 3, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            alignItems="center"
            justifyContent="center"
            px={2}
            sx={{
              backgroundColor: "rgba(214, 225, 255, 0.212)",

              transition: "all 0.3s ease",
              "&:hover .card": {
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              },
              "&:hover .cardMedia": {
                transform: "scale(1.11)",
                transition: "transform 0.3s ease",
              },
              "&:hover .rotateIcon": {
                transform: "rotate(0deg)",
                opacity: 1,
              },
              "& .text": {
                transition: "transform .25s ease",
                willChange: "transform",
                display: "inline-block",
              },
              "&:hover .text": {
                transform: "translateX(5px)",
              },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                className="card"
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                  boxShadow: 3,
                  maxWidth: { xs: "100%", sm: 450, md: 500 },
                  mx: "auto",
                }}
              >
                <CardMedia
                  className="cardMedia"
                  component="img"
                  image="/images/tracing_with_ai_3.jpg"
                  alt="مشاهده کامل"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    transform: "scale(1.2)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                  mb: 2,
                  textAlign: "end",
                  color: "black",
                }}
              >
                مشاهده کامل با مدل‌های سفارشی هوش مصنوعی
              </Typography>
              <Box
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: 3,
                  color: "black",
                  display: "flex",
                  textAlign: "end",
                  justifyContent: "flex-end",
                }}
              >
                <Typography className="text">
                  با بینش عمیق در مورد سلامت، موقعیت مکانی و نحوه استفاده از
                  خودرو، بهره‌وری را افزایش دهید
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center",
                    "& .rotateIcon": {
                      transform: "rotate(90deg)",
                      opacity: 0,
                      transition: "all 0.4s ease",
                    },
                  }}
                >
                  <TaskAltIcon className="rotateIcon" sx={{ color: "black" }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* باکس دوم */}
        <Box
          ref={(el) => (featureRefs.current[1] = el)}
          sx={{
            py: { xs: 3, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
            borderRadius: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            alignItems="center"
            justifyContent="center"
            px={2}
            sx={{
              backgroundColor: "rgba(214, 225, 255, 0.212)",
              transition: "all 0.3s ease",
              "&:hover .card": {
                // transform: "scale(1.0)",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              },
              "&:hover .cardMedia": {
                transform: "scale(1.11)",
                transition: "transform 0.3s ease",
              },
              "&:hover .rotateIcon": {
                transform: "rotate(0deg)",
                opacity: 1,
              },
              "& .text": {
                transition: "transform .25s ease",
                willChange: "transform",
                display: "inline-block", // کمک می‌کنه ترنزیشن تمیزتر دیده بشه
              },
              "&:hover .text": {
                transform: "translateX(5px)", // 2px به چپ
              },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                  mb: 2,
                  textAlign: "end",
                  color: "black",
                }}
              >
                با دید بی‌نظیر ، در زمان صرفه‌جویی کنید و هزینه‌ها را کاهش دهید
              </Typography>
              <Box
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: 3,
                  textAlign: "end",
                  color: "black",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "flex-end",
                    "& .rotateIcon": {
                      transform: "rotate(90deg)",
                      opacity: 0,
                      transition: "all 0.4s ease",
                    },
                  }}
                >
                  <Typography className="text">
                    از ساخت‌وساز تا حمل‌ونقل مسافران، هوش مصنوعی راهکارهای دقیق
                    برای نیازهای خاص هر صنعت فراهم می‌کند
                  </Typography>
                  <TaskAltIcon className="rotateIcon" sx={{ color: "black" }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Card
                className="card" ////////////////////
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                  boxShadow: 3,
                  maxWidth: { xs: "100%", sm: 450, md: 500 },
                  mx: "auto",
                }}
              >
                <CardMedia
                  className="cardMedia" ////////////////////
                  component="img"
                  image="/images/tracing_with_ai.jpg"
                  alt="صرفه‌جویی در زمان"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    transform: "scale(1.2)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* باکس سوم */}
        <Box
          ref={(el) => (featureRefs.current[2] = el)}
          sx={{
            py: { xs: 3, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
            borderRadius: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            alignItems="center"
            justifyContent="center"
            px={2}
            sx={{
              backgroundColor: "rgba(214, 225, 255, 0.212)", ////////////////////////////
              transition: "all 0.3s ease",
              "&:hover .card": {
                // transform: "scale(1.0)",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              },
              "&:hover .cardMedia": {
                transform: "scale(1.11)",
                transition: "transform 0.3s ease",
              },
              "&:hover .rotateIcon": {
                transform: "rotate(0deg)",
                opacity: 1,
              },
              "& .text": {
                transition: "transform .25s ease",
                willChange: "transform",
                display: "inline-block", // کمک می‌کنه ترنزیشن تمیزتر دیده بشه
              },
              "&:hover .text": {
                transform: "translateX(5px)", // 2px به چپ
              },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                className="card"
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                  boxShadow: 3,
                  maxWidth: { xs: "100%", sm: 450, md: 500 },
                  mx: "auto",
                }}
              >
                <CardMedia
                  className="cardMedia" ////////////////////
                  component="img"
                  image="/images/tracing_with_ai_1-1.avif"
                  alt=" هشدار ها  "
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    transform: "scale(1.2)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                // dir="rtl"
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  color: "black",
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                  mb: 2,
                  textAlign: "end",
                }}
              >
                هشدارها
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                component="div"
                sx={{
                  color: "black",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: 3,
                  "& p": { margin: 0, mb: 1 },
                  textAlign: "end",
                }}
              >
                <span>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "flex-end",
                      "& .rotateIcon": {
                        transform: "rotate(90deg)",
                        opacity: 0,
                        transition: "all 0.4s ease",
                      },
                    }}
                  >
                    <p className="text">
                      این نرم‌افزار اعلان‌های فوری، از جمله پشتیبانی از
                      اعلان‌های فوری، ایمیل و سایر روش‌ها را ارائه می‌دهد
                    </p>
                    <TaskAltIcon
                      className="rotateIcon"
                      sx={{ color: "black" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "flex-end",
                      "& .rotateIcon": {
                        transform: "rotate(90deg)",
                        opacity: 0,
                        transition: "all 0.4s ease",
                      },
                    }}
                  >
                    <p className="text">
                      این ویژگی‌ها نرم‌افزار را قادر می‌سازد تا کاربران را از
                      رفتارهای نامناسب رانندگی
                    </p>
                    <TaskAltIcon
                      className="rotateIcon"
                      sx={{ color: "black" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "flex-end",
                      "& .rotateIcon": {
                        transform: "rotate(90deg)",
                        opacity: 0,
                        transition: "all 0.4s ease",
                      },
                    }}
                  >
                    <p className="text">
                      افت سوخت، رویدادهای تعمیر و نگهداری، نقض محدودیت‌های
                      جغرافیایی و انواع مختلف هشدارهای دیگر مطلع کند
                    </p>
                    <TaskAltIcon
                      className="rotateIcon"
                      sx={{ color: "black" }}
                    />
                  </Box>
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {/* {باکس چهارم} */}
        <Box
          ref={(el) => (featureRefs.current[1] = el)}
          sx={{
            py: { xs: 3, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
            borderRadius: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            alignItems="center"
            justifyContent="center"
            px={2}
            sx={{
              backgroundColor: "rgba(214, 225, 255, 0.212)",
              transition: "all 0.3s ease",
              "&:hover .card": {
                // transform: "scale(1.0)",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
              },
              "&:hover .cardMedia": {
                transform: "scale(1.11)",
                transition: "transform 0.3s ease",
              },
              "&:hover .rotateIcon": {
                transform: "rotate(0deg)",
                opacity: 1,
              },
              "& .text": {
                transition: "transform .25s ease",
                willChange: "transform",
                display: "inline-block", // کمک می‌کنه ترنزیشن تمیزتر دیده بشه
              },
              "&:hover .text": {
                transform: "translateX(5px)", // 2px به چپ
              },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                  mb: 2,
                  textAlign: "end",
                  color: "black",
                }}
              >
                بهینه‌سازی مسیرها و کاهش هزینه سوخت{" "}
              </Typography>
              <Box
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  mb: 3,
                  textAlign: "end",
                  color: "black",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "flex-end",
                    "& .rotateIcon": {
                      transform: "rotate(90deg)",
                      opacity: 0,
                      transition: "all 0.4s ease",
                    },
                  }}
                >
                  <Typography className="text">
                    سامانه DTS با تحلیل داده‌های لحظه‌ای و الگوریتم‌های هوشمند،
                    مسیرهای بهینه را پیشنهاد می‌دهد تا هم مصرف سوخت کاهش یابد و
                    هم زمان سفر کوتاه‌تر شود{" "}
                  </Typography>
                  <TaskAltIcon className="rotateIcon" sx={{ color: "black" }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Card
                className="card"
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                  boxShadow: 3,
                  maxWidth: { xs: "100%", sm: 450, md: 500 },
                  mx: "auto",
                }}
              >
                <CardMedia
                  className="cardMedia"
                  component="img"
                  image="/images/Reduce fuel consumption.jpg"
                  alt="  بهینه‌سازی مسیروهزینه سوخت  "
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    transform: "scale(1.2)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Features;
