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
        animate={{ rotateY: card.revealed ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={onPick}
          disabled={!ready}
          aria-label={`${card.hard ? "Sert " : ""}Gizli kategori kartı`}
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border p-4 text-center shadow-card transition-transform ${
            card.hard
              ? "border-cola-400/40 bg-gradient-to-br from-cola-900 via-cola-950 to-black hover:border-cola-400/70"
              : "border-cola-500/25 bg-gradient-to-br from-cola-600 via-cola-800 to-cola-950 hover:border-cola-500/60"
          } ${ready ? "cursor-pointer hover:-translate-y-1 hover:shadow-pop active:scale-95" : "cursor-default"}`}
        >
          {card.hard && (
            <span className="absolute top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-cola-600 px-2.5 py-1 text-[10px] font-black tracking-widest text-cream-100 uppercase shadow-pop">
              ⚡ Sert
            </span>
          )}
          <span className="pointer-events-none absolute -top-3 -right-3 h-16 w-16 rounded-full bg-cola-400/25 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-vanilla-300/15 blur-2xl" />
          <span
            className={`font-display text-4xl font-black select-none ${
              card.hard ? "text-red-400/90" : "text-cream-100/80"
            }`}
          >
            ?
          </span>
          <span className="font-display text-[9px] font-bold tracking-[0.25em] text-cream-100/50 uppercase">
            Gizli Kategori
          </span>
          <span
            className={`font-display text-xs font-bold tracking-widest uppercase ${
              card.hard ? "text-red-300/70" : "text-cream-100/30"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </button>

        <div
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border p-4 text-center shadow-card ${
            card.hard
              ? "border-red-400/50 bg-gradient-to-br from-cola-950 via-cola-900 to-black"
              : "border-cola-500/30 bg-gradient-to-br from-cream-100 to-cream-300"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-4xl">{card.category.emoji}</span>
          <span
            className={`font-display text-sm font-black tracking-wider uppercase ${
              card.hard ? "text-cream-100" : "text-cola-800"
            }`}
          >
            {card.category.name}
          </span>
          {card.hard && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-cola-600 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-cream-100 uppercase">
              Sert Soru
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
