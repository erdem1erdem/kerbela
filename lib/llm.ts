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

function buildModeBlock(mode: ModeId): string {
  return mode === "ekstrem"
    ? `Bu bir +18 (yetişkin) oyun modu. Sorular yetişkinlere yönelik, cinsellik ve arzu temalı, açık ve rahatsız edici olabilen ama bir partide sesli söylenebilir tonda olsun. Kaba olmasın; rahatsız edici, nefret içeren, yasadışı veya zarar verici içerik yok.`
    : `Bu bir standart mod. Sorular sınırları zorlasa da +18 ya da cinsel içerikli olmamalı; herkesin olduğu bir ortamda rahatça okunabilmeli.`;
}

function buildExcludeBlock(exclude: string[]): string {
  return exclude.length
    ? `\nÖnceden sorulmuş sorulara AYNI veya ÇOK BENZER soru üretme:\n${exclude
        .slice(0, 25)
        .map((q) => `- ${q}`)
        .join("\n")}`
    : "";
}

export type CategoryCardSpec = {
  id: string;
  name: string;
  emoji: string;
  hard: boolean;
};

export async function generateCategoryQuestions(
  cards: CategoryCardSpec[],
  mode: ModeId,
  exclude: string[],
  players: string[] = [],
): Promise<TruthQuestion[]> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI_API_KEY ayarlanmamış. OpenAI uyumlu bir sağlayıcı anahtarı ekleyin.",
    );
  }

  const baseUrl = (process.env.AI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.AI_MODEL ?? DEFAULT_MODEL;

  const cardBlock = cards
    .map(
      (c, i) =>
        `${i + 1}. ${c.emoji} ${c.name}${
          c.hard
            ? " — SERT SORU: bu kartın sorusu belirgin biçimde daha zor, cesur ve sınırları zorlayan olsun"
            : ""
        }`,
    )
    .join("\n");

  const playerBlock =
    players.length > 1
      ? `\nOyun bu grup oyuncularla oynanıyor: ${players
          .map((p) => `"${p}"`)
          .join(", ")}.\nSorularda oyuncu adını doğrudan YAZMA; onun yerine "@oyuncu" yaz (oyun otomatik olarak oyuncu adını koyar).`
      : "";

  const prompt = `Oyun: "Sınır Kartları" — bir doğruluk (truth) partisi oyunu.
Görev: Yalnızca DOĞRULUK (truth) soruları üret. Soru olmayan hiçbir görev, eylem veya meydan okuma içeriği üretme.

${buildModeBlock(mode)}

Aşağıda 5 kart ve her kartın gizli kategorisi var. HER KART İÇİN TAM OLARAK 1 soru üret, sıraya birebir uy:
${cardBlock}
${playerBlock}

Kurallar:
- ${cards.length} adet soru üret; sıra asla bozulmasın.
- Her soru TEK cümle, "sen" hitabı, en fazla ~18 kelime, soru işaretiyle bitsin.
- Sorular BİRBİRİNE BENZEMESİN: her soru farklı bir konu, farklı bir durum ve farklı bir tonda olsun; aynı temayı veya benzer senaryoyu iki kez kullanma.
- Klişe sorulardan kaçın: "En büyük pişmanlığın ne?" gibi her doğruluk oyununda sorulan cümleleri üretme.
- Soruların yaklaşık yarısı EĞLENCELİ, komik ve yaratıcı olsun; hepsi ciddi veya duygusal olmasın. Komik senaryolar, absürt durumlar, "olsaydı ne yapardın" soruları serbest.
- En az 2 soruda diğer oyuncuyu konu al: "Sence @oyuncu ... olsa ne yapardı?", "@oyuncu ... olsa hangisi olurdu?" veya "@oyuncu hakkında sence en çok ... ?" gibi. "@oyuncu" metnini AYNEN koru, başka isim kullanma.
- Kartın kategorisine uygun olsun (ör: "Gizli" → sırlar, "Aşk" → kalp işleri, "Geçmiş" → anılar/pişmanlıklar).
- SERT işaretli kartın sorusu gerçekten zor, kışkırtıcı ve kişisel olsun; diğerleri daha rahat.
${buildExcludeBlock(exclude)}

Çıktı YALNIZCA geçerli bir JSON dizisi, kart sırasıyla, başka hiçbir metin olmadan:
[{"text": "soru metni"}, {"text": "soru metni"}]`;

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
        max_tokens: 700,
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
  for (let i = 0; i < cards.length; i++) {
    const item = items[i];
    const text = typeof item?.text === "string" ? item.text.trim() : "";
    if (!text) continue;
    const card = cards[i];
    questions.push({
      id: `ai-${Date.now()}-${i}`,
      text,
      tag: card.name,
      intensity: card.hard ? "sinir-otesi" : "orta",
      mode,
    });
  }
  return questions;
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

  const excludeBlock = buildExcludeBlock(exclude);

  const modeBlock = buildModeBlock(mode);

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
