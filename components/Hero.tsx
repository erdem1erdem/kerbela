"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { INTENSITIES } from "@/lib/questions";

const CHIPS = [
  { x: -44, y: -30, z: 70, delay: 0 },
  { x: 46, y: -46, z: 120, delay: 0.6 },
  { x: -40, y: 52, z: 110, delay: 1.1 },
  { x: 44, y: 42, z: 80, delay: 1.6 },
  { x: 0, y: -62, z: 160, delay: 0.3 },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 60,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
    stiffness: 60,
    damping: 18,
  });

  const titleX = useTransform(mx, [0, 1], [18, -18]);
  const titleY = useTransform(my, [0, 1], [12, -12]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className="perspective-1200 relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex w-full max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          style={{ x: titleX, y: titleY, transform: "translateZ(40px)" }}
          className="glass-cream animate-float-slow relative z-10 mb-6 flex items-center gap-2 rounded-full border border-cola-500/15 px-5 py-2 text-xs font-semibold tracking-[0.22em] text-cola-600 uppercase"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-cola-500" />
          Doğruluk Oyunu · Sadece Doğruluk
        </motion.span>

        <div
          className="preserve-3d relative"
          style={{ transform: "translateZ(60px)" }}
        >
          <p
            aria-hidden
            className="font-display absolute inset-0 text-[clamp(2.8rem,10vw,7.5rem)] leading-[0.95] font-black tracking-tight text-cola-500/40 uppercase blur-[2px] select-none"
            style={{ transform: "translateZ(-40px) scale(1.01)" }}
          >
            AŞK
            <br />
            İLE
          </p>
          <motion.h1
            style={{ x: titleX, y: titleY }}
            className="font-display relative text-[clamp(2.8rem,10vw,7.5rem)] leading-[0.95] font-black tracking-tight text-gradient-cola uppercase"
          >
            AŞK
            <br />
            <span className="text-gradient-cola italic">İLE</span>
          </motion.h1>
        </div>

        <motion.p
          style={{ x: titleX, y: titleY, transform: "translateZ(35px)" }}
          className="text-balance mt-6 max-w-xl text-base font-medium text-cola-800/80 sm:text-lg"
        >
          Masada 5 kart, arkasında gizli kategoriler. Aralarında gizli bir sert
          kart var; ona denk gelirsen soru sertleşir. Beğenmezsen başka karta
          basabilirsin.{" "}
          <span className="font-bold text-cola-600">
            Hangi kartı açmaya cesaretin var?
          </span>
        </motion.p>

        <motion.div
          style={{ transform: "translateZ(80px)", x: titleX, y: titleY }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/oyun"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-cola-600 via-cola-700 to-cola-900 px-9 py-4 font-display text-sm font-bold tracking-widest text-cream-100 uppercase shadow-cola transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream-100/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Oyuna Başla
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="#nasil-oynanir"
            className="glass-cream inline-flex items-center gap-2 rounded-full border border-cola-500/20 px-7 py-4 text-sm font-semibold text-cola-800 transition-colors hover:border-cola-500/40 hover:text-cola-600"
          >
            Nasıl oynanır?
          </Link>
        </motion.div>
      </motion.div>

      {CHIPS.map((chip, i) => {
        const intensity = INTENSITIES[i % INTENSITIES.length];
        return (
          <motion.div
            key={i}
            className="absolute hidden md:block"
            style={{
              left: `${50 + chip.x}%`,
              top: `${50 + chip.y}%`,
              transform: `translateZ(${chip.z}px)`,
            }}
            animate={{
              y: [0, -14, 0],
              rotate: [0, chip.x > 0 ? 4 : -4, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: chip.delay,
            }}
          >
            <div className="glass-cream flex h-14 w-14 items-center justify-center rounded-2xl border border-cola-500/15 shadow-soft">
              <span className="text-2xl">{intensity.emoji}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
