import GetStarted from "@/components/pages/Home/GetStarted";
import HeroSection from "@/components/pages/Home/HeroSection";
import HowItWorksSection from "@/components/pages/Home/HowItWorks";
import RegisterInfoSection from "@/components/pages/Home/RegisterInfoSection";

const HomePage = () => {
  return (
    <div className="font-body">
      <HeroSection />
      <RegisterInfoSection />
      <HowItWorksSection />
      <GetStarted />
    </div>
  );
};

export default HomePage;
