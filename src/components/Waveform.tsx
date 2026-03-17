import { motion } from "framer-motion";

interface WaveformProps {
  isPlaying: boolean;
  bars?: number;
}

const Waveform = ({ isPlaying, bars = 20 }: WaveformProps) => {
  return (
    <div className="flex items-center gap-[2px] h-8">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={
            isPlaying
              ? {
                  height: [4, Math.random() * 24 + 4, 4],
                }
              : { height: 4 }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.4 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

export default Waveform;
