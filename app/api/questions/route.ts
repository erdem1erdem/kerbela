import { NextRequest, NextResponse } from "next/server";
import {
  containsProfanity,
  getIntensity,
  type IntensityId,
  type ModeId,
  type TruthQuestion,
} from "@/lib/questions";
import {
  generateCategoryQuestions,
  generateTruthQuestions,
  getLastUsedProvider,
  type CategoryCardSpec,
} from "@/lib/llm";

export const dynamic = "force-dynamic";

const VALID_LEVELS: IntensityId[] = ["hafif", "orta", "atesli", "sinir-otesi"];

function sanitizeQuestions(questions: TruthQuestion[]): (TruthQuestion | null)[] {
  return questions.map((q) => (containsProfanity(q.text) ? null : q));
}

type Body = {
  intensity?: IntensityId;
  level?: IntensityId;
  mode?: ModeId;
  exclude?: string[];
  cards?: CategoryCardSpec[];
  players?: string[];
};

export async function POST(req: NextRequest) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const mode: ModeId = body.mode === "ekstrem" ? "ekstrem" : "soft";
  const level: IntensityId = VALID_LEVELS.includes(body.level ?? "orta")
    ? (body.level as IntensityId)
    : "orta";
  const exclude = (body.exclude ?? []).slice(0, 40);

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Hiçbir AI sağlayıcısı yapılandırılmamış. GEMINI_API_KEY değişkenini .env'e ekleyin." },
      { status: 501 },
    );
  }

  try {
    const rawQuestions =
      Array.isArray(body.cards) && body.cards.length > 0
        ? await generateCategoryQuestions(
            body.cards,
            mode,
            level,
            exclude,
            body.players ?? [],
          )
        : await generateTruthQuestions(
            getIntensity(body.intensity ?? "hafif"),
            mode,
            exclude,
          );
    const questions = sanitizeQuestions(rawQuestions);
    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Üretici geçerli soru döndürmedi, tekrar deneyin." },
        { status: 502 },
      );
    }
    return NextResponse.json({ questions, provider: getLastUsedProvider() });
  } catch (err) {
    console.error("Soru üretimi başarısız:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Soru üretilemedi" },
      { status: 502 },
    );
  }
}
