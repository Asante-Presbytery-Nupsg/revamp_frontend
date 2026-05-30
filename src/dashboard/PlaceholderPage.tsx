import React from "react";
import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const PlaceholderPage: React.FC = () => {
  const { pathname } = useLocation();
  const page = pathname.split("/").pop() ?? "page";
  const label = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, " ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <Construction size={24} className="text-[#185FA5]" />
      </div>
      <h2 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight mb-2">
        {label}
      </h2>
      <p className="text-[14px] font-light text-slate-400 max-w-xs">
        This page is under construction. Check back soon.
      </p>
    </div>
  );
};

export default PlaceholderPage;
