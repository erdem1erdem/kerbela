"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { SpatialBackground } from "@/components/SpatialBackground";
import { QuestionCard } from "@/components/oyun/QuestionCard";
import { CardFlip, type RoundCard } from "@/components/oyun/CardFlip";
import {
  CATEGORIES,
  MODES,
  getLocalQuestionForCategory,
  normalizeText,
  type Category,
  type ModeId,
  type TruthQuestion,
} from "@/lib/questions";

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let roundSeq = 0;
function nextRoundId(): number {
  roundSeq += 1;
  return roundSeq;
}

function pickHardIndex(): number {
  return Math.floor(Math.random() * 5);
}

function shouldUseAi(): boolean {
  return Math.random() < 0.9;
}

export default function OyunPage() {
  const [phase, setPhase] = useState<"setup" | "play">("setup");

  const [mode, setMode] = useState<ModeId>("soft");
  const [confirmingExtreme, setConfirmingExtreme] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: 3 }, (_, i) => `Oyuncu ${i + 1}`),
  );

  const [players, setPlayers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [roundCards, setRoundCards] = useState<RoundCard[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loadingRound, setLoadingRound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askedRef = useRef<string[]>([]);

  const pickedCard = roundCards.find((c) => c.revealed && c.question) ?? null;

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
    setQuestionCount(0);
    setCurrent(0);
    setError(null);
    setPhase("play");
    void dealRound();
  }

  async function dealRound() {
    setLoadingRound(true);
    setError(null);
    const roundId = nextRoundId();
    const hardIdx = pickHardIndex();
    const cards: RoundCard[] = shuffle(CATEGORIES)
      .slice(0, 5)
      .map((category, i) => ({
        key: `${roundId}-${category.id}-${i}`,
        category,
        hard: i === hardIdx,
        question: null,
        revealed: false,
      }));

    let aiQuestions: TruthQuestion[] = [];
    if (shouldUseAi()) {
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            cards: cards.map((c) => ({
              id: c.category.id,
              name: c.category.name,
              emoji: c.category.emoji,
              hard: c.hard,
            })),
            exclude: askedRef.current.slice(-25),
          }),
        });
        const data = (await res.json()) as {
          questions?: TruthQuestion[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Soru üretilemedi");
        aiQuestions = data.questions ?? [];
      } catch {
        aiQuestions = [];
      }
    }

    const usedTexts = new Set<string>();
    const assigned: RoundCard[] = cards.map((card, i) => {
      const aiQ = aiQuestions[i];
      let question: TruthQuestion | null = null;
      if (aiQ && typeof aiQ.text === "string" && aiQ.text.trim()) {
        question = { ...aiQ, tag: card.category.name };
      } else {
        question = getLocalQuestionForCategory(
          card.category,
          card.hard,
          mode,
          [...askedRef.current, ...usedTexts],
        );
      }
      if (question) usedTexts.add(normalizeText(question.text));
      return { ...card, question };
    });

    setRoundCards(assigned);
    setLoadingRound(false);
  }

  async function fetchSertQuestion(category: Category): Promise<TruthQuestion | null> {
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          cards: [
            {
              id: category.id,
              name: category.name,
              emoji: category.emoji,
              hard: true,
            },
          ],
          exclude: askedRef.current.slice(-25),
        }),
      });
      const data = (await res.json()) as {
        questions?: TruthQuestion[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Soru üretilemedi");
      const q = data.questions?.[0];
      if (q && typeof q.text === "string" && q.text.trim()) {
        return { ...q, tag: category.name, intensity: "sinir-otesi", mode };
      }
    } catch {
      // yerel havuzdan sert soru ile devam
    }
    return getLocalQuestionForCategory(category, true, mode, askedRef.current);
  }

  async function switchToCard(index: number, target: RoundCard) {
    setLoadingRound(true);
    setError(null);
    setRoundCards((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...c, revealed: true, hard: true, question: null }
          : { ...c, revealed: false },
      ),
    );
    const sert = await fetchSertQuestion(target.category);
    setRoundCards((prev) =>
      prev.map((c, i) =>
        i === index && c.revealed ? { ...c, question: sert } : c,
      ),
    );
    setLoadingRound(false);
  }

  function pickCard(index: number) {
    if (loadingRound) return;
    const target = roundCards[index];
    if (!target) return;
    const revealed = roundCards.find((c) => c.revealed && c.question);

    if (revealed && revealed.hard) return;

    if (revealed) {
      void switchToCard(index, target);
    } else {
      if (!target.question) return;
      setRoundCards((prev) =>
        prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)),
      );
    }
  }

  function skipRound() {
    if (loadingRound) return;
    void dealRound();
  }

  function advanceRound(samePlayer: boolean) {
    const picked = roundCards.find((c) => c.revealed && c.question);
    if (picked?.question) {
      askedRef.current.push(normalizeText(picked.question.text));
    }
    setQuestionCount((c) => c + 1);
    if (!samePlayer) {
      setCurrent((c) => (c + 1) % players.length);
    }
    void dealRound();
  }

  function restart() {
    askedRef.current = [];
    setRoundCards([]);
    setError(null);
    setQuestionCount(0);
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
            Sınır Kartları
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
                  Her turda 8 kategoriden rastgele 5 kart dağıtılır; aralarında
                  gizli bir sert kart var. Soruyu beğenmezsen başka karta
                  basabilirsin ama yeni soru sert olur.
                </p>
              </div>

              <section className="mb-12">
                <h2 className="mb-4 flex items-center gap-3 font-display text-xs font-bold tracking-[0.25em] text-cola-500 uppercase">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cola-600 text-[11px] text-cream-100">
                    1
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
                    2
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
                  Kartları Dağıt
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
                      bir kart seçsin
                    </span>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="flex items-center gap-2 rounded-full border border-cola-500/20 bg-cream-100/80 py-2 pr-5 pl-2 shadow-soft backdrop-blur">
                    <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cola-600 to-cola-900 text-base">
                      🎴
                    </span>
                    <span className="text-sm font-bold text-cola-800">
                      Soru {String(questionCount + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-cola-500/20 bg-cream-100/80 py-2 pr-5 pl-2 shadow-soft backdrop-blur">
                    <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cola-700 to-cola-900 text-base">
                      ⚡
                    </span>
                    <span className="text-sm font-bold text-cola-800">
                      Sert kart final
                    </span>
                  </span>
                </div>

                {loadingRound && (
                  <span className="flex items-center gap-1.5 rounded-full bg-cola-600/10 px-3 py-1 text-[10px] font-bold tracking-wider text-cola-700 uppercase">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cola-600" />
                    Kerbela Hüseyin yeni sorular üretiyor
                  </span>
                )}
              </div>

              <div className="mb-10">
                <p className="mb-4 text-center text-xs font-bold tracking-[0.3em] text-cola-500 uppercase">
                  Sert kart gizli · soruyu beğenmezsen başka karta bas, o soru sertleşir
                </p>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
                  {roundCards.map((card, i) => (
                    <div key={card.key} className="h-52 sm:h-64">
                      <CardFlip
                        card={card}
                        index={i}
                        onPick={() => pickCard(i)}
                        disabled={
                          loadingRound || (!!pickedCard && pickedCard.hard)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {pickedCard ? (
                <QuestionCard
                  question={pickedCard.question!}
                  index={questionCount}
                  playerName={players[current] ?? "Oyuncu"}
                  category={pickedCard.category}
                  hard={pickedCard.hard}
                />
              ) : error ? (
                <div className="glass-cream mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-cola-500/20 px-8 py-10 text-center shadow-card">
                  <span className="text-4xl">🤖</span>
                  <p className="font-display text-sm font-bold tracking-wider text-cola-700 uppercase">
                    Yeni soru üretilemedi
                  </p>
                  <p className="text-sm text-cola-800/70">{error}</p>
                  <button
                    onClick={() => void dealRound()}
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
                    Kerbela Hüseyin yeni sorular üretiyor…
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => advanceRound(false)}
                  disabled={!pickedCard || loadingRound}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-cola-500 via-cola-700 to-cola-900 px-9 py-4 font-display text-sm font-bold tracking-widest text-cream-100 uppercase shadow-cola transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream-100/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Cevap verildi, sıradaki →
                </button>
                {!pickedCard && (
                  <button
                    onClick={skipRound}
                    disabled={loadingRound}
                    className="glass-cream inline-flex w-full items-center justify-center gap-2 rounded-full border border-cola-500/20 px-7 py-4 text-sm font-bold text-cola-700 uppercase transition-colors hover:border-cola-500/40 hover:text-cola-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    🔄 Kartları yeniden dağıt
                  </button>
                )}
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
