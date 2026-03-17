import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full mix-blend-difference"
        style={{
          width: isPointer ? 40 : 20,
          height: isPointer ? 40 : 20,
          backgroundColor: "hsl(195, 90%, 55%)",
          zIndex: 9999,
        }}
        animate={{
          x: pos.x - (isPointer ? 20 : 10),
          y: pos.y - (isPointer ? 20 : 10),
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: `hsla(195, 90%, 55%, ${0.3 - i * 0.06})`,
            zIndex: 9998,
          }}
          animate={{
            x: pos.x - 3,
            y: pos.y - 3,
          }}
          transition={{
            type: "spring",
            stiffness: 300 - i * 50,
            damping: 20 + i * 5,
            mass: 0.5 + i * 0.2,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
