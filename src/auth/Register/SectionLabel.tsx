import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <div className="col-span-full flex items-center gap-3 mt-1 mb-1">
    <div className="h-[1.5px] w-5 bg-[#185FA5]" />
    <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#185FA5]">
      {children}
    </span>
  </div>
);

export default SectionLabel;
