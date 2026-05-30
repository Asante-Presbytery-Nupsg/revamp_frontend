import React from "react";
import CTA from "@/components/pages/About/CTA";
import AboutHero from "@/components/pages/About/AboutHero";
import OurStory from "@/components/pages/About/OurStory";
import CoreValues from "@/components/pages/About/CoreValues";
import TimeLineStrip from "@/components/pages/About/TimeLineStrip";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <AboutHero />
      <OurStory />
      <CoreValues />
      <TimeLineStrip />
      <CTA />
    </div>
  );
};

export default AboutPage;
