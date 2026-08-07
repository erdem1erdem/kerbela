"use client";

export function SpatialBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-cream-300" />

      <div className="absolute inset-0">
        <div className="animate-drift absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-cola-400/25 blur-[100px]" />
        <div
          className="animate-drift absolute top-1/4 -right-32 h-[30rem] w-[30rem] rounded-full bg-vanilla-300/50 blur-[90px]"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="animate-breathe absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-cola-500/20 blur-[90px]"
        />
        <div
          className="animate-drift absolute top-2/3 left-10 h-72 w-72 rounded-full bg-cream-400/60 blur-[70px]"
          style={{ animationDelay: "-13s" }}
        />
      </div>

      <div className="perspective-1200 absolute inset-x-0 bottom-[-20%] h-[60%] overflow-hidden">
        <div className="grid-floor absolute inset-0" />
      </div>

      <div className="absolute inset-0">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="animate-bubble absolute bottom-0 rounded-full bg-cola-400/30"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              boxShadow: "inset -3px -3px 8px rgb(40 9 15 / 0.15)",
            }}
          />
        ))}
      </div>

      <div className="noise absolute inset-0 opacity-[0.06] mix-blend-multiply" />

      <div className="absolute inset-0 bg-gradient-to-t from-cream-100/70 via-transparent to-cream-50/60" />
    </div>
  );
}

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 3) % 100}%`,
  size: `${8 + ((i * 5) % 14)}px`,
  delay: (i * 1.7) % 16,
  duration: 12 + ((i * 2.1) % 10),
}));
