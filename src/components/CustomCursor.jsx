
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!media.matches || reduceMotion) return;

    const move = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);

      const target = event.target;

      setHovered(
        target instanceof Element &&
          Boolean(target.closest("a, button, [data-cursor='hover']"))
      );
    };

    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, {
      passive: true,
    });

    document.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-violet-500/60 md:block"
      animate={{
        x: position.x - (hovered ? 22 : 7),
        y: position.y - (hovered ? 22 : 7),
        width: hovered ? 44 : 14,
        height: hovered ? 44 : 14,
        opacity: visible ? 1 : 0,
        backgroundColor: hovered
          ? "rgba(167,139,250,0.12)"
          : "rgba(167,139,250,0.04)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 0.3,
      }}
    />
  );
}
