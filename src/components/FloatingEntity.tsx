import { motion } from "framer-motion";

interface FloatingEntityProps {
  name: string;
  icon: string;
  x: number;
  y: number;
  delay?: number;
  size?: number;
  highlighted?: boolean;
  onClick?: () => void;
}

const FloatingEntity = ({ name, icon, x, y, delay = 0, size = 80, highlighted = false, onClick }: FloatingEntityProps) => {
  return (
    <motion.div
      className={`absolute flex flex-col items-center gap-2 cursor-pointer ${onClick ? "" : "pointer-events-none"}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: highlighted ? 1 : 0.5,
        scale: 1,
        y: [0, -15, 5, -10, 0],
        x: [0, 5, -3, 8, 0],
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.8, delay },
        y: { duration: 8 + delay * 2, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 10 + delay * 3, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.3, opacity: 1 }}
      onClick={onClick}
    >
      <div
        className={`rounded-full flex items-center justify-center glass-panel transition-all duration-500 ${
          highlighted ? "glow-plasma border-primary/40" : ""
        }`}
        style={{ width: size, height: size }}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-xs text-muted-foreground font-display whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
};

export default FloatingEntity;
