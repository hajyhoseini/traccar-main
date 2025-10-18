import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { People } from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/Room";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";

const fadeInScaleAnimation = `
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-reveal {
    animation: fadeInScale 1s ease-out;
  }
`;

const heroData = [
  {
    id: 1,
    title: "پایش تجهیزات",
    url: "/images/equip_management.webp",
    desc: "مشاهده موقعیت لحظه‌ای در نقشه با گزینه‌های متنوع مانند نقشه جاده‌ای یا ماهواره‌ای",
    icon: <ChecklistRtlIcon fontSize="large" />,
  },
  {
    id: 2,
    title: "مدیریت کاربران",
    url: "/images/user_management.avif",
    desc: "امکان تعریف و مدیریت کاربران با مجوزهای مختلف",
    icon: <People fontSize="large" />,
  },
  {
    id: 3,
    title: "هوش مصنوعی",
    url: "/images/car_ai.jpg",
    desc: "کاربر میتواند به کمک هوش مصنوعی درخواست های خود را از دیتابیس دریافت کند",
    icon: <PsychologyAltIcon fontSize="large" />,
  },
  {
    id: 4,
    title: "دریافت گزارشات",
    url: "/images/Recive_reports.jpg",
    desc: "نظارت بر رفتار راننده و پردازش داده از حسگرهایی مانند سطح سوخت، وضعیت موتور",
    icon: <RoomIcon fontSize="large" />,
  },
  {
    id: 5,
    title: "ایمنی راننده",
    url: "/images/driver_safty.avif",
    desc: "پشتیبانی از پروتکل‌های امن برای حفظ حریم خصوصی داده‌ها",
    icon: <HealthAndSafetyIcon fontSize="large" />,
  },
  {
    id: 6,
    title:"  مدیریت ناوگان حمل‌ونقل سازمانی  ",
    url: "/images/tracking-services.jpg",
    desc: "پشتیبانی از پروتکل‌های امن برای حفظ حریم خصوصی داده‌ها",
    icon: <HealthAndSafetyIcon fontSize="large" />,
  },
];

function Hero() {
  const mainImageRef = useRef(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === mainImageRef.current) {
              entry.target.classList.add("animate-main-image");
            }
            revealRefs.current.forEach((ref, index) => {
              if (entry.target === ref) {
                setTimeout(() => {
                  ref.classList.add("animate-reveal");
                }, index * 200);
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mainImageRef.current) observer.observe(mainImageRef.current);
    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (mainImageRef.current) observer.unobserve(mainImageRef.current);
      revealRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <>
      <style>{fadeInScaleAnimation}</style>
      <Box
        sx={{
          height:{xs:"57vh" , sm:"45vh" ,md:"60vh"},
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems:"center",
          position: "relative",
          bgcolor:"white",
        }}
      >
        {/* متن‌ها و عنوان‌ها */}
        <Box sx={{ textAlign: "center", mb: 0 }}>
          <Box
            sx={{
              width: { xs: "280px", md: "400px" },
              bgcolor: "black",
              margin: "auto",
              my: 2,
              borderRadius: "50px",
              p: 1,
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body1"
                color="white"
                sx={{ fontSize: { xs: "14px" } }}
              >
                یکی از بهترین روش ها برای کنترل ناوگان خودرویی
              </Typography>
            </motion.div>
          </Box>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Typography variant="body1" fontSize="20px" py={1} color="black">
              پلتفرم عملیات یکپارچه
            </Typography>
          </motion.div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="body1"
              fontSize="30px"
              sx={{ display: { xs: "none", md: "block" }, color: "black" }}
            >
              مجموعه‌ای کاملاً یکپارچه از محصولات
            </Typography>
          </motion.div>
        </Box>

        {/* Swiper */}
        <Box
          sx={{
            maxWidth: { xs: "90%", md: "90%" },
            margin: "auto",
            my:2,
            position: "relative",
          }}
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={16}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 1 },
              800: { slidesPerView: 2 },
            }}
          >
            {heroData.map((item) => (
              <SwiperSlide key={item.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    minHeight: 280,
                    backgroundImage: `linear-gradient(rgba(0,82,204,0.5), rgba(0,82,204,1)), url(${item.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    padding: 3,
                  }}
                >
                  <Box display="flex" justifyContent="flex-end" mb={1}>
                    <Avatar
                      sx={{ bgcolor: "#73b2df", width: 60, height: 60 }}
                    >
                      {item.icon}
                    </Avatar>
                  </Box>
                  <CardContent>
                    <Typography
                      variant="h6"
                      align="right"
                      color="white"
                      fontWeight={600}
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" align="right" color="white">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </>
  );
}

export default Hero;
