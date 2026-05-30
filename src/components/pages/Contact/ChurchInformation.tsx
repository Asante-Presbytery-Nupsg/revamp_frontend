import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "../../shared/animation";

const regions = [
  { name: "Southern Sector", city: "Accra", email: "south@nupsg.org" },
  { name: "Central Sector", city: "Kumasi", email: "central@nupsg.org" },
  { name: "Northern Sector", city: "Tamale", email: "north@nupsg.org" },
];

const ChurchInformation = () => {
  return (
    <div className="lg:col-span-5 space-y-12 lg:pl-4">
      {/* HQ details */}
      <motion.div
        variants={fadeUp(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="h-[1.5px] w-6 bg-[#185FA5]" />
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
            Headquarters
          </span>
        </div>

        <h3 className="font-serif italic text-[clamp(20px,2.5vw,26px)] font-light text-[#0c0d0e] mb-7 leading-snug">
          National Headquarters
        </h3>

        <div className="space-y-4">
          {[
            {
              Icon: MapPin,
              text: "Presbyterian Church of Ghana HQ,\nKumasi, Ashanti Region",
            },
            { Icon: Phone, text: "+233 (0) 24 123 4567" },
            { Icon: Mail, text: "info@nupsg.org" },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-[#185FA5]" />
              </div>
              <p className="text-[14px] font-light text-slate-500 leading-relaxed whitespace-pre-line">
                {text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="h-px bg-slate-100" />

      {/* Regional sectors */}
      <motion.div
        variants={fadeUp(0.14)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="h-[1.5px] w-6 bg-[#185FA5]" />
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
            Regional Sectors
          </span>
        </div>

        <div>
          {regions.map(({ name, city, email }, i) => (
            <motion.div
              key={name}
              variants={fadeUp(0.18 + i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex items-center justify-between py-4 border-b border-slate-100 last:border-0"
            >
              <div>
                <p className="text-[14px] font-medium text-[#0c0d0e] mb-0.5">
                  {name}
                </p>
                <p className="text-[12px] font-light italic text-slate-400">
                  {city}
                </p>
              </div>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-[#185FA5] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
              >
                Email <ArrowRight size={10} />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="h-px bg-slate-100" />

      {/* Quote */}
      <motion.div
        variants={fadeUp(0.2)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="border-l-[1.5px] border-[#185FA5]/30 pl-6"
      >
        <p className="font-serif italic text-[16px] font-light text-slate-500 leading-relaxed">
          "For Christ, we live — and we are here to listen."
        </p>
      </motion.div>
    </div>
  );
};

export default ChurchInformation;
