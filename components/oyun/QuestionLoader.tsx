"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const MESSAGES = [
  "Kerbela Hüseyin yeni soruları üretiyor…",
  "Kartlar dağıtılıyor…",
  "Sıra devrediyor…",
  "Çöl sessizliğinde sorular yoğruluyor…",
  "Kader kartları karılıyor…",
];

const CARD_EMOJIS = ["💘", "🤫", "🌍", "💭", "⚡"];

type QuestionLoaderProps = {
  playerName: string;
};

export function QuestionLoader({ playerName }: QuestionLoaderProps) {
  const [message, setMessage] = useState(MESSAGES[0]);
  const [embers, setEmbers] = useState<number[]>([]);

  useEffect(() => {
    const msg = setInterval(() => {
      setMessage((m) => MESSAGES[(MESSAGES.indexOf(m) + 1) % MESSAGES.length]);
    }, 3200);
    const ember = setInterval(() => {
      setEmbers((prev) => [...prev.slice(-9), Date.now() + Math.random()]);
    }, 480);
    return () => {
      clearInterval(msg);
      clearInterval(ember);
    };
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-9 py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {embers.map((id, i) => (
          <motion.span
            key={id}
            className="absolute bottom-6 h-2 w-2 rounded-full bg-gradient-to-t from-cola-500/80 to-vanilla-300/70"
            style={{ left: `${16 + ((i * 23) % 68)}%` }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -110, scale: 1.2 }}
            transition={{ duration: 1.7, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-cream relative z-10 flex items-center gap-3 rounded-full border border-cola-500/25 py-2 pr-6 pl-2 shadow-soft backdrop-blur"
      >
        <span className="font-display flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cola-500 via-cola-700 to-cola-900 text-lg font-black text-cream-100 uppercase shadow-pop">
          {(playerName ?? "?").trim().charAt(0).toLocaleUpperCase("tr-TR")}
        </span>
        <div className="text-left">
          <p className="text-[9px] font-bold tracking-[0.25em] text-cola-500 uppercase">
            Sıra
          </p>
          <p className="font-display text-sm font-black tracking-widest text-cola-800 uppercase">
            {playerName}
          </p>
        </div>
      </motion.div>

      <div className="relative flex h-32 w-72 items-end justify-center">
        <motion.span
          className="pointer-events-none absolute bottom-2 left-1/2 h-14 w-44 -translate-x-1/2 rounded-full bg-cola-500/25 blur-2xl"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {CARD_EMOJIS.map((emoji, i) => {
          const angle = (i - 2) * 11;
          return (
            <motion.div
              key={i}
              className="absolute bottom-1 origin-bottom"
              style={{ left: `calc(50% + ${(i - 2) * 42}px)` }}
              initial={{ opacity: 0, y: 60, rotate: angle * 2.2, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, rotate: angle, scale: 1 }}
              transition={{
                delay: 0.15 + i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                animate={{ rotateY: [0, 180, 360] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  delay: i * 0.16,
                  ease: "easeInOut",
                }}
                className="flex h-24 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-cola-500/30 bg-gradient-to-br from-cola-700 via-cola-800 to-cola-950 shadow-card"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    delay: i * 0.16,
                  }}
                  className="text-2xl"
                >
                  {emoji}
                </motion.span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex items-end gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-cola-600"
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-display text-sm font-bold tracking-[0.2em] text-cola-700 uppercase"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
