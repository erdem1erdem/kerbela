import type { Intensity, ModeId, TruthQuestion } from "@/lib/questions";

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";
const GENERATION_COUNT = 8;

type GeneratedItem = { text?: unknown; tag?: unknown };

function extractJsonArray(text: string): unknown[] {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end <= start) return [];
  const slice = raw.slice(start, end + 1);
  try {
    const parsed = JSON.parse(slice);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function generateTruthQuestions(
  intensity: Intensity,
  mode: ModeId,
  exclude: string[],
  count = GENERATION_COUNT,
): Promise<TruthQuestion[]> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI_API_KEY ayarlanmamış. OpenAI uyumlu bir sağlayıcı anahtarı ekleyin.",
    );
  }

  const baseUrl = (process.env.AI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.AI_MODEL ?? DEFAULT_MODEL;

  const excludeBlock = exclude.length
    ? `\nÖnceden sorulmuş sorulara AYNI veya ÇOK BENZER soru üretme:\n${exclude
        .slice(0, 25)
        .map((q) => `- ${q}`)
        .join("\n")}`
    : "";

  const modeBlock =
    mode === "ekstrem"
      ? `Bu bir +18 (yetişkin) oyun modu. Sorular yetişkinlere yönelik, cinsellik ve arzu temalı, açık ve rahatsız edici olabilen ama bir partide sesli söylenebilir tonda olsun. Kaba olmasın; rahatsız edici, nefret içeren, yasadışı veya zarar verici içerik yok.`
      : `Bu bir standart mod. Sorular sınırları zorlasa da +18 ya da cinsel içerikli olmamalı; herkesin olduğu bir ortamda rahatça okunabilmeli.`;

  const prompt = `Oyun: "Sınırlarını Aş" — bir doğruluk (truth) partisi oyunu.
Görev: Yalnızca DOĞRULUK (truth) soruları üret. Soru olmayan hiçbir görev, eylem veya meydan okuma içeriği üretme.

${modeBlock}

Zorluk seviyesi: ${intensity.name} — ${intensity.tagline} (seviye ${intensity.level}/4)
- Seviye 1-2: dostça, merak uyandıran, kolay cevaplanan sorular
- Seviye 3: flörtöz, kişisel, kışkırtıcı sorular
- Seviye 4: çok kişisel, sınırları zorlayan ama nezaket sınırını aşmayan sorular
${
  mode === "ekstrem"
    ? "- Seviye 4'te sorular açık ve doğrudan yetişkin içerikli olabilir (yine de saygılı bir tonda)."
    : ""
}
Kurallar:
- ${count} adet soru üret.
- Her soru TEK cümle, "sen" hitabı, en fazla ~18 kelime, soru işaretiyle bitsin.
- Sorular birbirinden ve klişelerden farklı olsun; geniş bir konu yelpazesine yayılsın.
- Her soruya 1-2 kelimelik kısa bir etiket ver (ör: "Aşk", "Arkadaş", "Hayat", "Gizli", "Anı", "Korku", "Sınır", "Flört", "Geçmiş").${excludeBlock}

Çıktı YALNIZCA geçerli bir JSON dizisi, başka hiçbir metin olmadan:
[{"text": "soru metni", "tag": "etiket"}]`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content:
              "Sen kurnaz bir doğruluk oyunu soru yazarısın. Sadece JSON dizisi döndürürsün.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Soru üretilemedi (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? "";

  const items = extractJsonArray(content) as GeneratedItem[];
  const questions: TruthQuestion[] = [];
  for (const item of items) {
    const text = typeof item.text === "string" ? item.text.trim() : "";
    if (!text) continue;
    const tag =
      typeof item.tag === "string" && item.tag.trim() ? item.tag.trim() : "Doğruluk";
    questions.push({
      id: `ai-${Date.now()}-${questions.length}`,
      text,
      tag,
      intensity: intensity.id,
      mode,
    });
  }
  return questions;
}
