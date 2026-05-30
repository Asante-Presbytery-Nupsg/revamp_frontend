import React from "react";
import HeroContact from "@/components/pages/Contact/HeroContact";
import ContactForm from "@/components/pages/Contact/ContactForm";
import ChurchInformation from "@/components/pages/Contact/ChurchInformation";

const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <HeroContact />

      <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <ContactForm />
          <ChurchInformation />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
