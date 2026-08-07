"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { SpatialBackground } from "@/components/SpatialBackground";
import { QuestionCard } from "@/components/oyun/QuestionCard";
import { TiltCard } from "@/components/TiltCard";
import {
  INTENSITIES,
  MODES,
  getIntensity,
  getQuestionsByIntensity,
  normalizeText,
  type IntensityId,
  type ModeId,
  type TruthQuestion,
} from "@/lib/questions";

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;
const RAMP_EVERY = 4;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function OyunPage() {
  const [phase, setPhase] = useState<"setup" | "play">("setup");

  const [intensity, setIntensity] = useState<IntensityId>("hafif");
  const [mode, setMode] = useState<ModeId>("soft");
  const [confirmingExtreme, setConfirmingExtreme] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: 3 }, (_, i) => `Oyuncu ${i + 1}`),
  );

  const [players, setPlayers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [deck, setDeck] = useState<TruthQuestion[]>([]);
  const [deckLevel, setDeckLevel] = useState<IntensityId>("hafif");
  const [askedCount, setAskedCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askedRef = useRef<string[]>([]);
  const refillingRef = useRef(false);
  const deckLevelRef = useRef<IntensityId>("hafif");
  const refillLevelRef = useRef<IntensityId>("hafif");

  const question = deck[0] ?? null;

  function levelFor(asked: number): IntensityId {
    const startIdx = INTENSITIES.findIndex((i) => i.id === intensity);
    const ramp = Math.floor(asked / RAMP_EVERY);
    const idx = Math.min(startIdx + ramp, INTENSITIES.length - 1);
    return INTENSITIES[idx].id;
  }

  function changePlayerCount(next: number) {
    const count = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, next));
    setPlayerCount(count);
    setNames((prev) => {
      const nextNames = [...prev];
      while (nextNames.length < count) {
        nextNames.push(`Oyuncu ${nextNames.length + 1}`);
      }
      return nextNames.slice(0, count);
    });
  }

  function updateName(i: number, value: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  }

  function selectMode(id: ModeId) {
    if (id === "ekstrem") {
      setConfirmingExtreme(true);
      return;
    }
    setMode(id);
  }

  function startGame() {
    const cleanNames = names.map((n, i) => n.trim() || `Oyuncu ${i + 1}`);
    setPlayers(cleanNames);
    askedRef.current = [];
    const first = levelFor(0);
    deckLevelRef.current = first;
    setDeckLevel(first);
    setDeck(shuffle(getQuestionsByIntensity(first, mode)));
    setAskedCount(0);
    setCurrent(0);
    setError(null);
    setPhase("play");
    void refill(first);
  }

  async function refill(level: IntensityId) {
    if (refillingRef.current) return;
    refillingRef.current = true;
    refillLevelRef.current = level;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intensity: level,
          mode,
          exclude: askedRef.current.slice(-25),
        }),
      });
      const data = (await res.json()) as {
        questions?: TruthQuestion[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Soru üretilemedi");
      appendToDeck(data.questions ?? [], level);
    } catch (e) {
      if (refillLevelRef.current !== deckLevelRef.current) return;
      const fallback = getQuestionsByIntensity(level, mode).filter(
        (q) => !askedRef.current.includes(normalizeText(q.text)),
      );
      setDeck((prev) => (prev.length === 0 && fallback.length > 0 ? fallback : prev));
      if (fallback.length === 0) {
        setError(
          e instanceof Error ? e.message : "Yeni soru üretilemedi. Tekrar deneyin.",
        );
      }
    } finally {
      refillingRef.current = false;
      setGenerating(false);
    }
  }

  function appendToDeck(incoming: TruthQuestion[], level: IntensityId) {
    if (refillLevelRef.current !== deckLevelRef.current) return;
    setDeck((prev) => {
      const seen = new Set(prev.map((q) => normalizeText(q.text)));
      const fresh = incoming.filter(
        (q) =>
          q &&
          typeof q.text === "string" &&
          !seen.has(normalizeText(q.text)) &&
          !askedRef.current.includes(normalizeText(q.text)),
      );
      const fallback = getQuestionsByIntensity(level, mode).filter(
        (q) =>
          !seen.has(normalizeText(q.text)) &&
          !askedRef.current.includes(normalizeText(q.text)),
      );
      return [...prev, ...fresh, ...fallback];
    });
  }

  function nextQuestion(samePlayer: boolean) {
    const [head, ...rest] = deck;
    const nextCount = askedCount + (head ? 1 : 0);
    const nextLevel = levelFor(nextCount);

    if (head) {
      askedRef.current.push(normalizeText(head.text));
    }

    if (nextLevel !== deckLevel) {
      deckLevelRef.current = nextLevel;
      setDeckLevel(nextLevel);
      setDeck(shuffle(getQuestionsByIntensity(nextLevel, mode)));
      void refill(nextLevel);
    } else {
      if (rest.length <= 4) void refill(nextLevel);
      setDeck(rest);
    }

    setAskedCount(nextCount);
    if (!samePlayer) {
      setCurrent((c) => (c + 1) % players.length);
    }
  }

  function restart() {
    askedRef.current = [];
    setDeck([]);
    setError(null);
    setPhase("setup");
  }

  return (
    <>
      <SpatialBackground />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-6 pb-16">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="glass-cream flex items-center gap-2 rounded-full border border-cola-500/15 px-4 py-2 text-xs font-bold tracking-wider text-cola-700 uppercase transition-colors hover:border-cola-500/40"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4 6 8l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </Link>
          <span className="glass-cream rounded-full border border-cola-500/15 px-4 py-2 font-display text-[11px] font-bold tracking-[0.2em] text-cola-600 uppercase">
            Kerbela Çölleri
          </span>
        </header>

        <AnimatePresence mode="wait">
          {phase === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              <div className="perspective-1200 preserve-3d mb-10 text-center">
                <motion.h1
                  className="font-display text-3xl font-black tracking-tight text-cola-800 uppercase sm:text-5xl"
                  style={{ transform: "translateZ(40px)" }}
                >
                  Oyunu <span className="text-cola-500">Kur</span>
                </motion.h1>
                <p className="mt-3 text-sm font-medium text-cola-800/70">
                  Zorluk seç, oyuncuları yaz, sınırları zorlamaya başla. Oyun
                  seçtiğin seviyede başlar; her {RAMP_EVERY} soruda seviye yükselir.
                </p>
              </div>

              <section className="mb-12">
                <h2 className="mb-4 flex items-center gap-3 font-display text-xs font-bold tracking-[0.25em] text-cola-500 uppercase">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cola-600 text-[11px] text-cream-100">
                    1
                  </span>
                  Zorluk seviyesi
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {INTENSITIES.map((level) => {
                    const active = level.id === intensity;
                    return (
                      <TiltCard key={level.id} maxTilt={12} className="h-full">
                        <button
                          onClick={() => setIntensity(level.id)}
                          aria-pressed={active}
                          className={`relative flex h-full w-full flex-col gap-3 rounded-3xl border p-5 text-left transition-all duration-300 ${
                            active
                              ? "border-cola-500/60 bg-gradient-to-br from-cola-600/15 to-cola-800/20 shadow-pop"
                              : "glass-cream border-cola-500/15 hover:border-cola-500/35"
                          }`}
                        >
                          {active && (
                            <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cola-600 text-sm text-cream-100 shadow-pop">
                              ✓
                            </span>
                          )}
                          <span
                            className="text-3xl"
                            style={{ transform: "translateZ(30px)" }}
                          >
                            {level.emoji}
                          </span>
                          <div
                            style={{ transform: "translateZ(40px)" }}
                          >
                            <p className="font-display text-sm font-bold text-cola-800 uppercase">
                              {level.name}
                            </p>
                            <p className="mt-1 text-xs text-cola-800/60">
                              {level.tagline}
                            </p>
                          </div>
                          <div
                            className="flex gap-1"
                            style={{ transform: "translateZ(25px)" }}
                          >
                            {Array.from({ length: 4 }).map((_, dot) => (
                              <span
                                key={dot}
                                className={`h-1.5 w-6 rounded-full ${
                                  dot < level.level
                                    ? "bg-gradient-to-r from-cola-500 to-cola-700"
                                    : "bg-cola-900/10"
                                }`}
                              />
                            ))}
                          </div>
                        </button>
                      </TiltCard>
                    );
                  })}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-4 flex items-center gap-3 font-display text-xs font-bold tracking-[0.25em] text-cola-500 uppercase">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cola-600 text-[11px] text-cream-100">
                    2
                  </span>
                  Mod
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {MODES.map((m) => {
                    const active = m.id === mode;
                    return (
                      <button
                        key={m.id}
                        onClick={() => selectMode(m.id)}
                        aria-pressed={active}
                        className={`relative flex flex-col gap-3 rounded-3xl border p-5 text-left transition-all duration-300 ${
                          active
                            ? "border-cola-500/60 bg-gradient-to-br from-cola-600/15 to-cola-800/20 shadow-pop"
                            : "glass-cream border-cola-500/15 hover:border-cola-500/35"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{m.emoji}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${
                              m.adult
                                ? "bg-cola-900 text-cream-100"
                                : "bg-cola-600/10 text-cola-600"
                            }`}
                          >
                            {m.short}
                          </span>
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-cola-800 uppercase">
                            {m.name}
                          </p>
                          <p className="mt-1 text-xs text-cola-800/60">
                            {m.description}
                          </p>
                        </div>
                        {active && (
                          <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cola-600 text-sm text-cream-100 shadow-pop">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-3 font-display text-xs font-bold tracking-[0.25em] text-cola-500 uppercase">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cola-600 text-[11px] text-cream-100">
                    3
                  </span>
                  Oyuncular
                </h2>

                <div className="mb-5 flex items-center justify-between rounded-2xl border border-cola-500/15 bg-cream-100/70 px-5 py-4 backdrop-blur">
                  <p className="text-sm font-semibold text-cola-800">
                    Kaç kişi oynuyor?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changePlayerCount(playerCount - 1)}
                      disabled={playerCount <= MIN_PLAYERS}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-200 text-lg font-bold text-cola-700 transition hover:bg-cream-300 disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="font-display w-8 text-center text-2xl font-black text-cola-700">
                      {playerCount}
                    </span>
                    <button
                      onClick={() => changePlayerCount(playerCount + 1)}
                      disabled={playerCount >= MAX_PLAYERS}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-200 text-lg font-bold text-cola-700 transition hover:bg-cream-300 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: playerCount }).map((_, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-cola-500/15 bg-cream-100/70 px-4 py-3 backdrop-blur transition focus-within:border-cola-500/50"
                    >
                      <span
                        className={`font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-cream-100 ${
                          i % 2 === 0
                            ? "bg-gradient-to-br from-cola-500 to-cola-700"
                            : "bg-gradient-to-br from-cola-700 to-cola-900"
                        }`}
                      >
                        {(names[i]?.trim()[0] ?? "O").toUpperCase()}
                      </span>
                      <span className="font-display w-6 shrink-0 text-xs font-bold text-cola-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <input
                        value={names[i] ?? ""}
                        onChange={(e) => updateName(i, e.target.value)}
                        maxLength={16}
                        placeholder={`Oyuncu ${i + 1}`}
                        className="w-full bg-transparent text-sm font-semibold text-cola-900 outline-none placeholder:text-cola-800/40"
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={startGame}
                  className="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-cola-600 via-cola-700 to-cola-900 px-9 py-4 font-display text-sm font-bold tracking-widest text-cream-100 uppercase shadow-cola transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream-100/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Oyunu Başlat
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={players[current] ?? current}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 rounded-full border border-cola-500/20 bg-cream-100/80 py-2 pr-6 pl-2 shadow-soft backdrop-blur"
                  >
                    <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cola-500 to-cola-700 text-sm font-bold text-cream-100">
                      {(players[current]?.[0] ?? "O").toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-cola-800">
                      {players[current] ?? "Oyuncu"}
                    </span>
                    <span className="text-xs font-semibold tracking-wider text-cola-500 uppercase">
                      sıra sende
                    </span>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={deckLevel}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 rounded-full border border-cola-500/20 bg-cream-100/80 py-2 pr-5 pl-2 shadow-soft backdrop-blur"
                  >
                    <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cola-600 to-cola-900 text-base">
                      {getIntensity(deckLevel).emoji}
                    </span>
                    <span className="text-sm font-bold text-cola-800">
                      {getIntensity(deckLevel).name}
                    </span>
                    <span className="text-xs font-semibold tracking-wider text-cola-500 uppercase">
                      Seviye {getIntensity(deckLevel).level}/4
                    </span>
                  </motion.div>
                </AnimatePresence>

                {generating && (
                  <span className="flex items-center gap-1.5 rounded-full bg-cola-600/10 px-3 py-1 text-[10px] font-bold tracking-wider text-cola-700 uppercase">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cola-600" />
                    ✨ Yapay zekâ yeni sorular üretiyor
                  </span>
                )}
              </div>

              {question ? (
                <QuestionCard
                  question={question}
                  index={askedCount}
                  playerName={players[current] ?? "Oyuncu"}
                />
              ) : error ? (
                <div className="glass-cream mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-cola-500/20 px-8 py-10 text-center shadow-card">
                  <span className="text-4xl">🤖</span>
                  <p className="font-display text-sm font-bold tracking-wider text-cola-700 uppercase">
                    Yeni soru üretilemedi
                  </p>
                  <p className="text-sm text-cola-800/70">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      void refill(deckLevel);
                    }}
                    className="mt-2 rounded-full bg-gradient-to-br from-cola-600 to-cola-900 px-7 py-3 text-xs font-bold tracking-widest text-cream-100 uppercase shadow-pop transition-transform hover:scale-105"
                  >
                    Tekrar dene
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 py-16">
                  <div className="relative h-16 w-16">
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-cola-500/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                    />
                    <motion.span
                      className="absolute inset-2 rounded-full border-2 border-cola-600 border-t-transparent"
                      animate={{ rotate: -360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">
                      ✨
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold tracking-[0.2em] text-cola-700 uppercase">
                    Yapay zekâ yeni sorular üretiyor…
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => nextQuestion(false)}
                  disabled={!question}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-cola-500 via-cola-700 to-cola-900 px-9 py-4 font-display text-sm font-bold tracking-widest text-cream-100 uppercase shadow-cola transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream-100/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Cevap verildi, sıradaki →
                </button>
                <button
                  onClick={() => nextQuestion(true)}
                  disabled={!question}
                  className="glass-cream inline-flex w-full items-center justify-center gap-2 rounded-full border border-cola-500/20 px-7 py-4 text-sm font-bold text-cola-700 uppercase transition-colors hover:border-cola-500/40 hover:text-cola-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  🔄 Yeni soru
                </button>
                <button
                  onClick={restart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-xs font-bold tracking-widest text-cola-800/50 uppercase transition-colors hover:text-cola-700 sm:w-auto"
                >
                  Oyunu değiştir
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirmingExtreme && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-cola-950/70 p-5 backdrop-blur-sm"
              onClick={() => setConfirmingExtreme(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 16 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-cream w-full max-w-md rounded-3xl border border-cola-500/25 px-8 py-10 text-center shadow-card"
              >
                <span className="text-4xl">🔞</span>
                <h3 className="font-display mt-4 text-xl font-black tracking-tight text-cola-800 uppercase">
                  Ekstrem Mod — 18+
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cola-800/70">
                  Bu mod yalnızca yetişkinler içindir. Sorular cinsellik ve arzu
                  temalı, açık ve rahatsız edici içerik içerebilir. 18 yaşından
                  küçüklerle oynanmamalıdır.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setMode("ekstrem");
                      setConfirmingExtreme(false);
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-br from-cola-600 via-cola-700 to-cola-900 px-6 py-3 text-xs font-bold tracking-widest text-cream-100 uppercase shadow-pop transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    18+ Onaylıyorum
                  </button>
                  <button
                    onClick={() => setConfirmingExtreme(false)}
                    className="glass-cream inline-flex flex-1 items-center justify-center rounded-full border border-cola-500/25 px-6 py-3 text-xs font-bold tracking-widest text-cola-700 uppercase transition-colors hover:border-cola-500/50"
                  >
                    Vazgeç
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
