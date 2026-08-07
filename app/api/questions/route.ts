import { NextRequest, NextResponse } from "next/server";
import { getIntensity, type IntensityId, type ModeId } from "@/lib/questions";
import {
  generateCategoryQuestions,
  generateTruthQuestions,
  type CategoryCardSpec,
} from "@/lib/llm";

export const dynamic = "force-dynamic";

type Body = {
  intensity?: IntensityId;
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
  const exclude = (body.exclude ?? []).slice(0, 25);

  if (!process.env.AI_API_KEY) {
    return NextResponse.json(
      { error: "AI_API_KEY ayarlanmamış. OpenAI uyumlu bir sağlayıcı anahtarı ekleyin." },
      { status: 501 },
    );
  }

  try {
    const questions =
      Array.isArray(body.cards) && body.cards.length > 0
        ? await generateCategoryQuestions(
            body.cards,
            mode,
            exclude,
            body.players ?? [],
          )
        : await generateTruthQuestions(
            getIntensity(body.intensity ?? "hafif"),
            mode,
            exclude,
          );
    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Üretici geçerli soru döndürmedi, tekrar deneyin." },
        { status: 502 },
      );
    }
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Soru üretimi başarısız:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Soru üretilemedi" },
      { status: 502 },
    );
  }
}
