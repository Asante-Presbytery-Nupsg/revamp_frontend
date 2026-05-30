// components/Spinner.tsx
const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 10,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-3 gap-1.5 place-items-center h-full w-full ${className}`}
      style={{ width: size * 3 + 12, height: size * 3 + 12 }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="rounded-full bg-[#0C447C]"
          style={{
            width: size,
            height: size,
            animation: `dotPulse 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
