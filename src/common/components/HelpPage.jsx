import {
  Typography,
  Container,
  List,
  ListItem,
  Box,
  Card,
  Avatar,
  CardMedia,
  Button,
  CardContent,
  Grid,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import SettingsMenu from "../../settings/components/SettingsMenu";
import PageLayout from "./PageLayout";
import { useRef } from "react"; // اضافه کردن useRef
import { useTheme, useMediaQuery } from "@mui/material";

const HelpPage = () => {
  const sectionRefs = useRef({});
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  let title, head, body;

  if (isXs) {
    title = 22;
    head = 16;
    body = 12;
  } else if (isSm) {
    title = 26;
    head = 18;
    body = 13;
  } else if (isMd) {
    title = 30;
    head = 20;
    body = 14;
  }
  const items = [
    { id: "۱", label: " مقدمه ", refKey: "introduction" },
    { id: "۲", label: " ایجاد کاربران جدید ", refKey: "createUsers" },
    { id: "۳", label: " (GPS) اضافه کردن دستگاه ", refKey: "addGPS" },
    { id: "۴", label: " تنظیم حصار جغرافیایی ", refKey: "setGeofence" },
    { id: "۵", label: " اتصال به حصار تعیین شده ", refKey: "connectGeofence" },
    { id: "۶", label: " پیکربندی هشدار های سیستم ", refKey: "configureAlerts" },
    { id: "۷", label: " مدیریت گروهی دستگاه ها ", refKey: "manageGroups" },
    { id: "۸", label: " رویداد ها ", refKey: "events" },
    { id: "۹", label: " (Chart) نمودار  ", refKey: "chart" },
    { id: "۱۰", label: " (Route) مسیر پیموده شده  ", refKey: "route" },
  ];

  // تابع برای اسکرول به بخش مورد نظر
  const scrollToSection = (refKey) => {
    if (sectionRefs.current[refKey]) {
      sectionRefs.current[refKey].scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    {
      id: 1,
      title: "ورود به بخش کاربر",
      desc: "در داشبورد سمت راست به بخش کاربر بروید.",
    },
    {
      id: 2,
      title: "ایجاد کاربر جدید",
      desc: "با کلیک بر روی + در پایین صفحه فرم ایجاد کاربر جدید باز می‌شود.",
    },
    {
      id: 3,
      title: "تعیین سطح دسترسی",
      desc: "نقش‌های کاربری (مدیر، سرپرست، کاربر) را مشخص کنید.",
    },
  ];

  const steps2 = [
    {
      id: 1,
      title: "با کلیک روی علامت اتصالات دستگاه مورد نظر",
      img: "jointogeofence1.png",
    },
    {
      id: 2,
      title: "در داشبورد به بخش دستگاه ها بروید",
      img: "jointogeofence2.png",
    },
    {
      id: 3,
      title: "تعیین اتصال به دستگاه مشخص شده",
      img: "jointogeofence3.png",
    },
  ];

  const steps3 = [
    {
      id: 1,
      title: " در بخش داشبودر به تنظیمات بروید ",
      img: "dashboard.png",
    },
    {
      id: 2,
      title: " هشدارها را تنظیم کنید ",
      img: "hint2.png",
    },
  ];

  const steps4 = [
    {
      id: 1,
      title: " ایجاد گروه ",
      desc: " در تنظیمات به بخش گروه ها رفته و روی + کلیک کرده و نام گروه را وارد کنید ",
    },
    {
      id: 2,
      title: " افزودن دستگاه ها ",
      desc: " دستگاه های مورد نظر را از لیست انتخاب و به گروه اضافه کنید ",
    },
    {
      id: 3,
      title: " تنظیم پارامتر ها ",
      desc: " هشدارها و محدودیت های گروه را تنظیم کنید ",
    },
    {
      id: 4,
      title: " تعیین دسترسی ها ",
      desc: " مشخص کنید کدام کاربران به این گروه دسترسی داشته باشند ",
    },
  ];
  const steps5 = [
    {
      id: 1,
      desc: "  در داشبودر به بخش  گزارشات  بروید   ",
      img: "dashboard.png",
    },
    {
      id: 2,
      desc: " روی  رویدادها   کلیک کنید    ",
      img: "events.png",
    },
    {
      id: 3,
      desc: "  نام دستگاه، گروه، بازه زمانی نوع رویداد و ستون‌ها (موارد بیشتر درمورد دستگاه) را انتخاب کنید    ",
      desc1: "   روی دکمه  نمایش  کلیک کنید ",
      img: "events1.png",
    },
  ];
  const steps6 = [
    {
      id: 1,
      desc: "  در داشبودر به بخش  گزارشات بروید  ",
      img: "dashboard.png",
    },
    {
      id: 2,
      desc: "  روی نمودار کلیک کنید  ",
      img: "reports.png",
    },
    {
      id: 3,
      desc: "  دستگاه موردنظر، بازه زمانی (مثل امروز یا یک هفته)،  و نوع داده‌ای که می‌خواهید نمایش داده شود را انتخاب کنید. ",
      desc1: "   روی دکمه  نمایش  کلیک کنید ",
      img: "reports1.png",
    },
  ];
  const steps7 = [
    {
      id: 1,
      desc: " در داشبودر به بخش  گزارشات  بروید",
      img: "dashboard.png",
    },
    {
      id: 2,
      desc: "   روی مسیر پیموده شده کلیک کنید  ",
      img: "route.png",
    },
    {
      id: 3,
      desc: "  دستگاه موردنظر و بازه زمانی (مثل امروز،دیروز، یا یک هفته) را انتخاب کنید ",
      img: "route1.png",
    },
    {
      id: 4,
      desc: " گزارش را اجرا کنید تا مسیر روی نقشه و جزئیاتش در جدول نمایش داده شود ",
      img: "route2.png",
    },
  ];

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={["deviceShare"]}>
      <Container
        maxWidth={false}
        sx={{
          direction: "rtl",
          height: "100vh",
          width: "100%",
          // overflow: "hidden",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" }, // موبایل column، دسکتاپ row
            height: { xs: "auto", lg: "100vh" }, // موبایل اجازه گسترش، دسکتاپ full height
            overflow: { xs: "visible", lg: "hidden" }, // موبایل visible، دسکتاپ hidden
            // alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          {/* محتوای اصلی صفحه */}
          <Grid
            size={{ xs: 12, lg: 9 }}
            sx={{
              overflowY: "auto",
              height: "100vh",
            }}
          >
            {/* نویگیشن */}
            <Box
              py={5}
              px={5}
              sx={{
                width: "100%",
                display: { xs: "flex", lg: "none" },
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                height: { xs: "auto", lg: "100%" }, // موبایل ارتفاع خودش رو داشته باشه
                textAlign: "right",
              }}
            >
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  color: "#1976d2",
                  fontSize: `${title}px `,
                  fontWeight: "bold",
                }}
              >
                بخش راهنما
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                  textAlign: "left",
                  fontSize: `${body}px`,
                }}
              >
                بخش راهنمای سریع. اطلاعات مورد نیاز برای راهنمایی استفاده از
                سیستم را می‌توانید اینجا پیدا کنید
              </Typography>
              <List sx={{ listStyleType: "none", padding: 0 }}>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    onClick={() => scrollToSection(item.refKey)}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      padding: "8px 0",
                      color: "#1976d2",
                      cursor: "pointer",
                      textAlign: "right",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        marginRight: 0,
                        direction: "rtl",
                        fontSize: `${body}px`,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* مقدمه */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#dcdcdc" }}
              ref={(el) => (sectionRefs.current["introduction"] = el)}
            >
              <Typography
                variant="h2"
                align="center"
                sx={{
                  mb: "10px",
                  fontSize: `${head}px`,
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                مقدمه
              </Typography>
              <Card sx={{ backgroundColor: "inherit", boxShadow: "none" }}>
                <CardMedia
                  component="img"
                  height={{ xs: "auto", lg: "400" }}
                  image="/images/homepage.png"
                  alt="Traccar Map Screenshot"
                  sx={{
                    padding: "8px",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 2,
                      textAlign: "justify",
                      color: "black",
                      fontSize: `${body}px`,
                    }}
                  >
                    این سامانه یک نرم‌افزار متن‌باز برای ردیابی دستگاه‌های GPS
                    است که از بیش از ۱۰۰ پروتکل و مدل دستگاه مختلف پشتیبانی
                    می‌کند. برای استفاده حرفه‌ای، لازم است سرور سامانه را
                    راه‌اندازی کرده، دستگاه‌ها را اضافه کنید، تنظیمات پیشرفته را
                    اعمال نمایید و گزارش‌ها و هشدارها را بهینه کنید. این راهنما
                    تمامی مراحل را از صفر تا صد به شما آموزش می‌دهد.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            {/* کاربرجدید */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#f4f4f4ff" }}
              ref={(el) => (sectionRefs.current["createUsers"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                ایجاد کاربران جدید
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{
                  mb: 6,
                  lineHeight: 2,
                  direction: "rtl",
                  color: "black",
                  fontSize: `${body}px`,
                }}
              >
                مدیریت سطح دسترسی کاربران، یکی از مهم‌ترین جنبه‌های امنیتی در
                استفاده‌ی حرفه‌ای از سیستم است. کاربران با سطوح دسترسی متفاوت
                می‌توانند به بخش‌های مختلف سیستم دسترسی داشته باشند.
              </Typography>
              <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                {steps.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        borderRadius: 3,
                        boxShadow: 3,
                        pt: 5,
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <Avatar
                        sx={{
                          position: "absolute",
                          top: -25,
                          left: "50%",
                          transform: "translateX(-50%)",
                          bgcolor: "primary.main",
                          width: 50,
                          height: 50,
                          fontWeight: "bold",
                        }}
                      >
                        {step.id}
                      </Avatar>
                      <CardContent sx={{ direction: "rtl" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 2,
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Typography
                variant="body1"
                align="center"
                sx={{
                  mb: 3,
                  lineHeight: 2,
                  fontWeight: "bold",
                  direction: "rtl",
                  fontSize: `${body}px`,
                }}
              >
                نکته امنیتی: برای حفظ امنیت سیستم، هر کاربر فقط باید به
                دستگاه‌ها و امکاناتی دسترسی داشته باشد که برای انجام وظایفش
                ضروری است.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Card sx={{ maxWidth: 700, borderRadius: 3, boxShadow: 2 }}>
                  <CardMedia
                    component="img"
                    image="/images/addnewuser.png"
                    alt="Users Section Screenshot"
                  />
                </Card>
              </Box>
            </Box>
            {/* اضافه کردن  دستگاه جی پی اس */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#dcdcdc" }}
              ref={(el) => (sectionRefs.current["addGPS"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                اضافه کردن دستگاه GPS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" }, // گوشی زیر هم، دسکتاپ کنار هم
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#e0e0e0",
                    flex: "1 1 50px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: `${body}px` }}>
                    در داشبودر به بخش <strong>دستگاه ها</strong> بروید
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    display: { xs: "none", lg: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 50px",
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#e0e0e0",
                    flex: "1 1 50px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: `${body}px` }}>
                    روی علامت <strong> + </strong> کلیک کنید
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    display: { xs: "none", lg: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 50px",
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#e0e0e0",
                    flex: "1 1 50px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: `${body}px` }}>
                    نام دلخواه برای دستگاه تعریف نمایید
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#e0e0e0",
                    flex: "1 1 50px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: `${body}px` }}>
                    <strong> شماره سریال دستگاه یا (IMEI) </strong> را وارد کنید
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    display: { xs: "none", lg: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 50px",
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </Box>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#e0e0e0",
                    flex: "1 1 50px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: `${body}px` }}>
                    تنظیمات اختیاری را بر اساس نیاز تکمیل نمایید
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="center">
                <Card
                  sx={{
                    maxWidth: 700,
                    borderRadius: 3,
                    boxShadow: 2,
                    marginTop: "30px",
                  }}
                >
                  <CardMedia
                    component="img"
                    image="/images/addnewgps.png"
                    alt="Users Section Screenshot"
                  />
                </Card>
              </Box>
            </Box>
            {/* تنظیم حصار جغرافیایی */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#f4f4f4ff" }}
              ref={(el) => (sectionRefs.current["setGeofence"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  fontSize: `${head}px`,
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                }}
              >
                تنظیم حصار جغرافیایی
              </Typography>
              <Typography
                variant="body1"
                align="right"
                sx={{
                  mb: 2,
                  direction: "ltr",
                  color: "black",
                  fontSize: `${body}px`,
                }}
              >
                در این بخش میتوانید به اشکال مختلف حصار جغرافیایی تعیین کنید.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Card
                  sx={{ mb: 6, maxWidth: 700, borderRadius: 3, boxShadow: 2 }}
                >
                  <CardMedia
                    component="img"
                    image="/images/addnewgeofence.png"
                    alt="Users Section Screenshot"
                  />
                </Card>
              </Box>
              <Typography
                variant="body1"
                align="right"
                sx={{
                  mb: 1,
                  direction: "rtl",
                  color: "black",
                  fontSize: `${body}px`,
                }}
              >
                با دوبار کلیک در یک قسمت حصار بسته و تشکیل خواهد شد.
              </Typography>
              <Typography
                variant="body1"
                align="right"
                sx={{
                  mb: 1,
                  lineHeight: 2,
                  direction: "rtl",
                  color: "black",
                  fontSize: `${body}px`,
                }}
              >
                حصار ها قابلیت ویرایش و حذف دارند.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Card sx={{ maxWidth: 700, borderRadius: 3, boxShadow: 2 }}>
                  <CardMedia
                    component="img"
                    image="/images/drowgeofence.png"
                    alt="Users Section Screenshot"
                  />
                </Card>
              </Box>
            </Box>
            {/* اتصال به حصار */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#dcdcdc" }}
              ref={(el) => (sectionRefs.current["connectGeofence"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                اتصال دستگاه به حصار تعیین شده
              </Typography>
              <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                {steps2.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        boxShadow: 6,
                        borderRadius: 2,
                        pt: 3,
                        pb: 3,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl", padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          مرحله {step.id}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.title}
                        </Typography>
                        <CardMedia
                          component="img"
                          image={`/images/${step.img}`}
                          alt={`Step ${step.id} screenshot`}
                          sx={{ mt: 2, height: 150, objectFit: "contain" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* پیکربندی هشدارهای سیستم */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#f4f4f4ff" }}
              ref={(el) => (sectionRefs.current["configureAlerts"] = el)}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  fontSize: `${head}px`,
                }}
              >
                پیکربندی هشدارهای سیستم
              </Typography>
              <Box py="10px">
                <Typography
                  align="center"
                  sx={{
                    textAlign: "center",
                    paddingBottom: "10px",
                    fontSize: `${body}px`,
                  }}
                >
                  هشدارها یکی از قابلیت‌های کلیدی هستند که به شما این امکان را
                  می‌دهند از وضعیت‌های خاص یا رویدادهای غیرعادی به‌سرعت مطلع
                  شوید. هشدارها می‌توانند از طریق ایمیل، پیامک یا اعلان وب ارسال
                  شوند.
                </Typography>
              </Box>
              <Grid container spacing={4} justifyContent="center" sx={{}}>
                {steps3.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        boxShadow: 6,
                        borderRadius: 2,
                        pt: 3,
                        pb: 3,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl", padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          مرحله {step.id}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.title}
                        </Typography>
                        <CardMedia
                          component="img"
                          image={`/images/${step.img}`}
                          alt={`Step ${step.id} screenshot`}
                          sx={{ mt: 2, height: 150, objectFit: "contain" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box>
                <Typography
                  align="center"
                  sx={{
                    textAlign: "center",
                    padding: "20px 0px",
                    fontSize: `${body}px`,
                  }}
                >
                  <strong style={{ color: "tomato" }}> نکته مهم: </strong>
                  برای کاهش هشدارهای غیرضروری، پارامترهای هر هشدار (مانند
                  مدت‌زمان توقف یا آستانه سرعت) را با دقت تنظیم کنید
                </Typography>
              </Box>
            </Box>
            {/* مدیریت گروهی دستگاه ها */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#dcdcdc" }}
              ref={(el) => (sectionRefs.current["manageGroups"] = el)}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  fontSize: `${head}px`,
                }}
              >
                مدیریت گروهی دستگاه‌ها
              </Typography>
              <Box py="10px">
                <Typography
                  align="center"
                  sx={{
                    textAlign: "center",
                    paddingBottom: "10px",
                    fontSize: `${body}px`,
                  }}
                >
                  برای مدیریت مؤثر تعداد زیادی از دستگاه‌ها، استفاده از
                  گروه‌بندی ضروری است. با گروه‌بندی دستگاه‌ها می‌توانید
                  عملیات‌های مدیریتی را برای چندین دستگاه به‌صورت همزمان انجام
                  دهید و همچنین دسترسی کاربران را بر اساس گروه‌بندی محدود کنید.
                </Typography>
              </Box>
              <Grid container spacing={4} justifyContent="center">
                {steps4.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}  key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        width: "150px",
                        boxShadow: 6,
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          مرحله {step.id}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box>
                <Typography
                  align="center"
                  sx={{
                    textAlign: "center",
                    padding: "10px 0px",
                    fontSize: `${body}px`,
                  }}
                >
                  <strong style={{ color: "tomato" }}> نکته کاربردی: </strong>
                  برای سازمان‌های بزرگ، می‌توانید ساختار سلسله‌مراتبی گروه‌ها را
                  ایجاد کنید تا مدیریت ناوگان بزرگ، آسان شود
                </Typography>
              </Box>
            </Box>
            {/* رویداد ها */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#f4f4f4ff" }}
              ref={(el) => (sectionRefs.current["events"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                رویدادها
              </Typography>
              <Box py="10px">
                <Typography
                component="div"
                  align="right"
                  sx={{
                    textAlign: "left",
                    paddingBottom: "10px",
                    fontSize: `${body}px`,
                  }}
                >
                  لیستی از رویدادها به‌صورت جدولی یا زمانی نمایش داده می‌شه. هر
                  رویداد شامل جزئیاتی مثل:
                  <Typography
                  component="div"
                    sx={{
                      fontSize: `${body}px`,
                    }}
                  >
                    
                    زمان وقوع: تاریخ و ساعت دقیق رویداد.
                  </Typography>
                  <Typography
                  component="div"
                    sx={{
                      fontSize: `${body}px`,
                    }}
                  >
                    نوع رویداد: مثلا "Ignition On" یا "Geofence Entered".
                  </Typography>
                  <Typography
                  component="div"
                    sx={{
                      fontSize: `${body}px`,
                    }}
                  >
                    دستگاه مرتبط: نام یا شناسه دستگاهی که رویداد براش اتفاق
                    افتاده.
                  </Typography>
                  <Typography
                  component="div"
                    sx={{
                      fontSize: `${body}px`,
                    }}
                  >
                    موقعیت: مختصات GPS (اگر مرتبط باشه).
                  </Typography>
                  <Typography
                  component="div"
                    sx={{
                      fontSize: `${body}px`,
                    }}
                  >
                    جزئیات اضافی: مثل سرعت، سطح سوخت، یا توضیحات خاص رویداد
                    (بسته به نوع).
                  </Typography>
                </Typography>
              </Box>
              <Grid container spacing={4} justifyContent="center" sx={{}}>
                {steps5.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        boxShadow: 6,
                        borderRadius: 2,
                        pt: 3,
                        pb: 3,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl", padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.desc}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        ></Typography>
                        <CardMedia
                          component="img"
                          image={`/images/${step.img}`}
                          alt={`Step ${step.id} screenshot`}
                          sx={{ mt: 2, height: 150, objectFit: "contain" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* نمودار */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#dcdcdc" }}
              ref={(el) => (sectionRefs.current["chart"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                نمودار (Chart)
              </Typography>
              <Box py="10px">
                <Typography
                  align="right"
                  sx={{
                    textAlign: "left",
                    paddingBottom: "10px",
                    fontSize: `${body}px`,
                  }}
                >
                  بخش Chart داده‌های مختلف دستگاه‌ها را به‌صورت نمودارهای خطی یا
                  میله‌ای نمایش می‌دهد، که معمولاً بر اساس زمان رسم می‌شوند. این
                  نمودارها برای تحلیل داده‌های حسگرها یا ویژگی‌های دستگاه (مثل
                  سرعت، فاصله، یا وضعیت باتری) در یک بازه زمانی خاص استفاده
                  می‌شوند.
                </Typography>
              </Box>
              <Grid container spacing={4} justifyContent="center" sx={{}}>
                {steps6.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        boxShadow: 6,
                        borderRadius: 2,
                        pt: 3,
                        pb: 3,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl", padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.desc}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        ></Typography>
                        <CardMedia
                          component="img"
                          image={`/images/${step.img}`}
                          alt={`Step ${step.id} screenshot`}
                          sx={{ mt: 2, height: 200, objectFit: "contain" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* مسیرپیموده شده */}
            <Box
              width="100%"
              py={10}
              px={5}
              sx={{ backgroundColor: "#f4f4f4ff" }}
              ref={(el) => (sectionRefs.current["route"] = el)}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mb: "10px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "left",
                  paddingBottom: "10px",
                  fontSize: `${head}px`,
                }}
              >
                مسیر پیموده شده (Route)
              </Typography>
              <Box py="10px">
                <Typography
                  align="right"
                  sx={{
                    textAlign: "left",
                    paddingBottom: "10px",

                    fontSize: `${body}px`,
                  }}
                >
                  بخش Route در گزارشات، یک گزارش بصری و جدولی از مسیرهای طی‌شده
                  توسط دستگاه در یک بازه زمانی مشخص ارائه می‌دهد. این گزارش به
                  شما نشان می‌دهد که دستگاه از کجا به کجا حرکت کرده، چه نقاطی را
                  طی کرده، و جزئیات مربوط به هر نقطه از مسیر (مثل زمان، سرعت، و
                  مختصات جغرافیایی). این بخش برای تحلیل حرکت دستگاه، بررسی
                  مسیرهای رانندگی، یا مدیریت ناوگان خیلی کاربردی است.
                </Typography>
              </Box>

              <Grid container spacing={4} justifyContent="center" sx={{}}>
                {steps7.map((step) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                    <Card
                      sx={{
                        textAlign: "center",
                        boxShadow: 6,
                        borderRadius: 2,
                        pt: 3,
                        pb: 3,
                        backgroundColor: "#fff",
                        transition: "transform 0.3s",
                      }}
                    >
                      <CardContent sx={{ direction: "rtl", padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#1976d2",
                            fontSize: `${body}px`,
                          }}
                        >
                          {step.desc}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.6,
                            color: "#555",
                            fontSize: `${body}px`,
                          }}
                        ></Typography>
                        <CardMedia
                          component="img"
                          image={`/images/${step.img}`}
                          alt={`Step ${step.id} screenshot`}
                          sx={{ mt: 2, height: 200, objectFit: "contain" }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* نویگیشن */}
          <Grid
            size={{ lg: 3 }}
            sx={{
              display: { xs: "none", lg: "flex" }, // مخفی در موبایل، نمایش در دسکتاپ
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              width: "23%",
              height: { xs: "auto", lg: "100%" },
              textAlign: "right",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "#1976d2",
                fontWeight: "bold",
              }}
            >
              بخش راهنما
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                lineHeight: 1.6,
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              بخش راهنمای سریع. اطلاعات مورد نیاز برای راهنمایی استفاده از سیستم
              را می‌توانید اینجا پیدا کنید
            </Typography>
            <List sx={{ listStyleType: "none", padding: 0 }}>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => scrollToSection(item.refKey)}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "8px 0",
                    color: "#1976d2",
                    cursor: "pointer",
                    textAlign: "right",
                    borderRadius: "5px",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e0f7fa",
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      marginRight: 0,
                      direction: "rtl",
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default HelpPage;
