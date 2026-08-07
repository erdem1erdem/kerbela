import { SpatialBackground } from "@/components/SpatialBackground";
import { Hero } from "@/components/Hero";
import { TiltCard } from "@/components/TiltCard";
import { CATEGORIES } from "@/lib/questions";

const RULES = [
  {
    icon: "🎴",
    title: "Kartını Seç",
    text: "Masada 5 kart, arkasında 5 gizli kategori. Sıran gelince birini seç; seçtiğin kart açılır ve konuşur.",
  },
  {
    icon: "⚡",
    title: "Sert Kart",
    text: "Bir kartın rengi farklıdır. Onu seçersen sınırları zorlayan sert bir soruyla karşılaşırsın. Cesaretin varsa aç.",
  },
  {
    icon: "🤖",
    title: "Zeki Sorular",
    text: "Soruları yapay zekâ üretir, kategoriler her tur yenilenir. Aynı soru asla iki kez karşına çıkmaz.",
  },
];

export default function Home() {
  return (
    <>
      <SpatialBackground />
      <main className="relative z-10">
        <Hero />

        <section
          id="nasil-oynanir"
          className="relative z-10 mx-auto max-w-6xl px-6 pt-8 pb-24"
        >
          <div className="perspective-1200 preserve-3d mb-12 text-center">
            <p className="font-display text-xs font-bold tracking-[0.3em] text-cola-500 uppercase">
              Nasıl oynanır
            </p>
            <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-cola-800 uppercase sm:text-5xl">
              Kurallar <span className="text-cola-500">basit</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {RULES.map((rule, i) => (
              <TiltCard key={i} className="h-full" maxTilt={10}>
                <div
                  className="glass-cream relative flex h-full flex-col gap-4 rounded-3xl border border-cola-500/15 p-7 shadow-card"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="layer-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cola-500/15 to-cola-700/20 text-2xl"
                  >
                    {rule.icon}
                  </div>
                  <h3
                    className="layer-1 font-display text-lg font-bold text-cola-700"
                  >
                    {rule.title}
                  </h3>
                  <p className="layer-2 text-sm leading-relaxed text-cola-800/70">
                    {rule.text}
                  </p>
                  <span
                    className="layer-3 font-display absolute right-6 bottom-4 text-5xl font-black text-cola-600/10"
                  >
                    0{i + 1}
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="perspective-1200 preserve-3d mt-16 rounded-3xl bg-gradient-to-br from-cola-800 via-cola-900 to-cola-950 p-[1px] shadow-cola">
            <div
              className="rounded-3xl px-8 py-10 sm:px-12"
              style={{
                background:
                  "linear-gradient(135deg, rgb(40 9 15 / 0.9), rgb(89 24 36 / 0.85))",
              }}
            >
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                <div>
                  <p className="font-display text-xs font-bold tracking-[0.3em] text-cola-300 uppercase">
                    {CATEGORIES.length} gizli kategori
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-cream-100 uppercase sm:text-3xl">
                    Hangi kartı açacaksın?
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-cream-100/70">
                    Sert kart yalnızca en yakın arkadaş grubunla oynanmalı.
                    Kızaran yanaklar oyunun doğal parçasıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-cola-900/10 py-8 text-center">
          <p className="text-xs font-medium tracking-widest text-cola-800/50 uppercase">
            Kerbela · Doğruluk Oyunu
          </p>
        </footer>
      </main>
    </>
  );
}
