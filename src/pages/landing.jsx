import Header from "../common/components/landing/Header";
import Hero from "../common/components/landing/Hero";
import Features from "../common/components/landing/Features";
import Footer from "../common/components/landing/Footer";
import { Box } from "@mui/material";
import { useRef } from "react";

const Landing = ({}) => {
  const featureRefs = useRef([]);

  const scrollToFeature = (index) => {
    featureRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", direction: "rtl" }}>
      {/* header */}
      <Header onIconClick={scrollToFeature} />

      {/*Hero section*/}
      <Hero />

      {/*  features section */}
      <Features featureRefs={featureRefs} />

      {/*  footer */}
      <Footer />
    </Box>
  );
};

export default Landing;
