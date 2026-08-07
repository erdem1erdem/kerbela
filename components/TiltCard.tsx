"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
};

export function TiltCard({
  children,
  className,
  style,
  maxTilt = 14,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 260,
    damping: 22,
  });

  const glareX = useTransform(px, [0, 1], ["20%", "80%"]);
  const glareY = useTransform(py, [0, 1], ["15%", "85%"]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    setHovered(false);
  }

  return (
    <div className="perspective-1200" style={{ transformStyle: "flat" }}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          ...style,
        }}
        className={className}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(420px circle at ${x} ${y}, rgb(255 246 232 / 0.35), transparent 55%)`,
            ),
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            transform: "translateZ(40px)",
          }}
        />
      </motion.div>
    </div>
  );
}
