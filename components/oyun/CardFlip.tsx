"use client";

import { motion } from "motion/react";
import type { Category, TruthQuestion } from "@/lib/questions";

export type RoundCard = {
  key: string;
  category: Category;
  hard: boolean;
  question: TruthQuestion | null;
  revealed: boolean;
};

type CardFlipProps = {
  card: RoundCard;
  index: number;
  onPick: () => void;
  disabled?: boolean;
};

export function CardFlip({ card, index, onPick, disabled }: CardFlipProps) {
  const ready = !card.revealed && !!card.question && !disabled;
  const sert = card.revealed && card.hard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="perspective-1200 h-full"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: card.revealed ? 180 : 0,
          scale: sert ? [1, 1.16, 0.94, 1.07, 1] : 1,
        }}
        transition={{
          rotateY: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.75, delay: 0.5, ease: "easeInOut" },
        }}
      >
        <button
          type="button"
          onClick={onPick}
          disabled={!ready}
          aria-label={`Gizli kategori kartı ${index + 1}`}
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-cola-500/25 bg-gradient-to-br from-cola-600 via-cola-800 to-cola-950 p-4 text-center shadow-card transition-transform ${
            ready
              ? "cursor-pointer hover:-translate-y-1 hover:shadow-pop active:scale-95"
              : "cursor-default"
          }`}
        >
          <span className="pointer-events-none absolute -top-3 -right-3 h-16 w-16 rounded-full bg-cola-400/25 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-vanilla-300/15 blur-2xl" />
          <span className="font-display text-4xl font-black text-cream-100/80 select-none">
            ?
          </span>
          <span className="font-display text-[9px] font-bold tracking-[0.25em] text-cream-100/50 uppercase">
            Gizli Kategori
          </span>
          <span className="font-display text-xs font-bold tracking-widest text-cream-100/30 uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        </button>

        <div
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border p-4 text-center shadow-card ${
            sert
              ? "border-red-400/50 bg-gradient-to-br from-cola-950 via-cola-900 to-black"
              : "border-cola-500/30 bg-gradient-to-br from-cream-100 to-cream-300"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {sert && (
            <>
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgb(248 113 113 / 0.4), transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{
                  duration: 1.4,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              {[-1, 1].map((dir, k) => (
                <motion.span
                  key={k}
                  className="pointer-events-none absolute text-2xl"
                  style={{ left: "50%", top: "50%" }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{
                    x: dir * 30,
                    y: k % 2 === 0 ? -26 : 24,
                    opacity: [0, 1, 0],
                    scale: 1.4,
                  }}
                  transition={{ duration: 0.9, delay: 0.55 + k * 0.1 }}
                >
                  ⚡
                </motion.span>
              ))}
              <motion.span
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.6, 1.4, 2] }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="font-display text-3xl font-black text-red-300 drop-shadow-[0_0_14px_rgb(248_113_113)]">
                  SERT!
                </span>
              </motion.span>
            </>
          )}
          <span className="text-4xl">{card.category.emoji}</span>
          <span
            className={`font-display text-sm font-black tracking-wider uppercase ${
              sert ? "text-cream-100" : "text-cola-800"
            }`}
          >
            {card.category.name}
          </span>
          {sert && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-cola-600 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-cream-100 uppercase">
              Sert Soru
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
