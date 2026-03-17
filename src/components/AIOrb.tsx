import { motion } from "framer-motion";

interface AIOrbProps {
  size?: number;
  isProcessing?: boolean;
  isListening?: boolean;
  className?: string;
}

const AIOrb = ({ size = 200, isProcessing = false, isListening = false, className = "" }: AIOrbProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid hsla(195, 90%, 55%, ${0.15 / ring})`,
            transform: `scale(${1 + ring * 0.3})`,
          }}
          animate={{
            rotate: ring % 2 === 0 ? 360 : -360,
            scale: isProcessing
              ? [1 + ring * 0.3, 1 + ring * 0.4, 1 + ring * 0.3]
              : 1 + ring * 0.3,
          }}
          transition={{
            rotate: { duration: 10 + ring * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {/* Main orb */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 35%, 
            hsla(195, 90%, 70%, 0.9), 
            hsla(195, 90%, 55%, 0.6) 40%, 
            hsla(280, 60%, 55%, 0.4) 70%, 
            hsla(240, 20%, 5%, 0.8))`,
          boxShadow: `
            0 0 60px hsla(195, 90%, 55%, 0.4),
            0 0 120px hsla(195, 90%, 55%, 0.2),
            inset 0 0 40px hsla(195, 90%, 55%, 0.3)
          `,
        }}
        animate={{
          scale: isListening ? [1, 1.08, 1] : isProcessing ? [1, 1.05, 0.98, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: isListening ? 0.3 : isProcessing ? 1.2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner highlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "15%",
          left: "20%",
          width: "30%",
          height: "30%",
          background: "radial-gradient(circle, hsla(195, 90%, 80%, 0.6), transparent)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Ripple effect when processing */}
      {isProcessing && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute inset-0 rounded-full border border-primary/30"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Particle emission when processing */}
      {isProcessing && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-primary"
              style={{
                width: 3,
                height: 3,
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default AIOrb;
