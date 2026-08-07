"use client";

import { AnimatePresence, motion } from "motion/react";
import type { TruthQuestion } from "@/lib/questions";

type QuestionCardProps = {
  question: TruthQuestion;
  index: number;
  playerName: string;
  category?: { name: string; emoji: string } | null;
  hard?: boolean;
};

export function QuestionCard({
  question,
  index,
  playerName,
  category,
  hard = false,
}: QuestionCardProps) {
  return (
    <div className="perspective-1200 relative mx-auto w-full max-w-2xl">
      <div className="preserve-3d relative">
        <div
          className={`absolute inset-x-6 top-3 bottom-3 rounded-[2rem] ${
            hard
              ? "bg-gradient-to-b from-black to-cola-950"
              : "bg-gradient-to-b from-cola-900 to-cola-950"
          }`}
          style={{ transform: "translateZ(-16px)" }}
        />
        <div
          className={`absolute inset-x-3 top-6 bottom-6 rounded-[2rem] ${
            hard
              ? "bg-gradient-to-b from-cola-950 to-black"
              : "bg-gradient-to-b from-cola-800 to-cola-900"
          }`}
          style={{ transform: "translateZ(-8px)" }}
        />

        <div className="preserve-3d relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ rotateY: -70, opacity: 0, scale: 0.85 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 70, opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className={`relative min-h-[24rem] overflow-hidden rounded-[2rem] p-7 shadow-cola sm:p-10 ${
                hard
                  ? "bg-gradient-to-br from-cola-950 via-cola-900 to-black"
                  : "bg-gradient-to-br from-cola-700 via-cola-800 to-cola-950"
              }`}
            >
              <div
                className={`pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full blur-[70px] ${
                  hard ? "bg-red-500/30" : "bg-cola-400/30"
                }`}
              />
              <div
                className={`pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-[70px] ${
                  hard ? "bg-orange-400/15" : "bg-vanilla-300/15"
                }`}
              />
              <span className="pointer-events-none absolute -right-6 -bottom-14 font-display text-[16rem] leading-none font-black text-cream-100/[0.06] select-none">
                ?
              </span>

              <div
                className="preserve-3d relative flex h-full min-h-[21rem] flex-col"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {hard ? (
                      <span
                        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-cola-600 px-3.5 py-1.5 text-[11px] font-black tracking-wider text-cream-100 uppercase shadow-pop backdrop-blur"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        ⚡ Sert Soru
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1.5 rounded-full bg-cream-100/15 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-cream-100 uppercase backdrop-blur"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        <span>{category?.emoji ?? "🎴"}</span>
                        {category?.name ?? question.tag}
                      </span>
                    )}
                    {!category && (
                      <span
                        className="rounded-full bg-cream-100/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider text-cream-100/80 uppercase"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        {question.tag}
                      </span>
                    )}
                    {question.mode === "ekstrem" && (
                      <span
                        className="rounded-full border border-cola-400/40 bg-cola-950/60 px-3 py-1 text-[11px] font-black tracking-widest text-cream-100 uppercase"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        🔞 18+
                      </span>
                    )}
                  </div>
                  <span
                    className="font-display text-[11px] font-bold tracking-[0.25em] text-cream-100/50 uppercase"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Soru {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className="flex flex-1 flex-col justify-center py-8"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.35em] text-cream-300/70 uppercase">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3a4.5 4.5 0 0 1 4.5 4.5c0 2.4-1.6 3.5-3 5.1a5 5 0 0 0-1 2.9h-1c0-1.4.5-2.6 1.4-3.6 1.3-1.4 2.6-2.3 2.6-4.4a3.5 3.5 0 1 0-7 0H7.5A4.5 4.5 0 0 1 12 3Zm-1 15h2v2h-2v-2Z"
                        fill="currentColor"
                      />
                    </svg>
                    {playerName} · bu kart konuşuyor
                  </p>
                  <p className="text-balance font-display text-2xl leading-snug font-semibold text-cream-100 sm:text-[2rem]">
                    “{question.text}”
                  </p>
                </div>

                <div
                  className="flex items-center justify-between"
                  style={{ transform: "translateZ(35px)" }}
                >
                  <span className="text-xs font-semibold text-cream-100/50">
                    {question.id.startsWith("ai-")
                      ? "✨ Kerbela Hüseyin üretimi"
                      : "Doğruluk sorusu · Gerçek cevap beklenir"}
                  </span>
                  <span className="font-display text-xs font-bold tracking-widest text-cream-300 uppercase">
                    {hard ? "⚡" : category?.emoji ?? "🎴"}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
