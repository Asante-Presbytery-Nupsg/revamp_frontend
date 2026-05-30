import { useState } from "react";
import { Star } from "lucide-react";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 p-0.5"
        >
          <Star
            size={26}
            className={`transition-colors ${
              star <= active
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200 fill-slate-200"
            }`}
          />
        </button>
      ))}
      {active > 0 && (
        <span className="text-[12px] font-medium text-slate-500 ml-1">
          {LABELS[active]}
        </span>
      )}
    </div>
  );
};

export default StarRating;
