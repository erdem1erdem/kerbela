import {
  getSertIntensity,
  type Intensity,
  type IntensityId,
  type ModeId,
  type TruthQuestion,
} from "@/lib/questions";

// AI sağlayıcıları aşağıdaki providerConfigs() bölümünden yönetilir.
const GENERATION_COUNT = 8;

/**
 * Ücretsiz/uygun maliyetli sağlayıcı fallback sistemi:
 * OpenRouter -> Groq -> Gemini -> Cerebras
 *
 * Sağlayıcıların yalnızca API anahtarı bulunanları aktif olur.
 */

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
    ? `Bu bir +18 (yetişkin) oyun modu. Sorular yetişkinlere yönelik, cinsellik ve arzu temalı, açık ve rahatsız edici olabilen ama bir partide sesli söylenebilir tonda olsun. Hiçbir soruda KÜFÜR, ARGO veya HAKARET kullanma; kelimeler temiz ve saygılı olsun, içerik cesur olsa bile üslup kibar kalsın. Nefret içeren, yasadışı veya zarar verici içerik yok.`
    : `Bu bir standart mod. Sorular sınırları zorlasa da +18 ya da cinsel içerikli olmamalı; herkesin olduğu bir ortamda rahatça okunabilmeli. Hiçbir soruda KÜFÜR, ARGO veya HAKARET kullanma; dil temiz ve saygılı olsun.`;
}

function buildExcludeBlock(exclude: string[]): string {
  return exclude.length
    ? `\nÖnceden sorulmuş sorulara AYNI veya ÇOK BENZER soru üretme:\n${exclude
        .slice(0, 40)
        .map((q) => `- ${q}`)
        .join("\n")}`
    : "";
}

const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";

const DEFAULT_GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

const DEFAULT_GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";

const DEFAULT_CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1";
const DEFAULT_CEREBRAS_MODEL = "llama-3.3-70b";

type ProviderConfig = {
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
};

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Sağlayıcı sırası:
 *
 * 1. OpenRouter
 * 2. Groq
 * 3. Gemini
 * 4. Cerebras
 *
 * Bir sağlayıcı hata verirse, boş cevap döndürürse veya rate-limit'e
 * takılırsa sonraki sağlayıcı otomatik denenir.
 *
 * İstersen yalnızca istediğin sağlayıcıların API anahtarını .env'e koyabilirsin.
 */
function providerConfigs(): ProviderConfig[] {
  const providers: ProviderConfig[] = [
    {
      label: "OpenRouter",
      baseUrl: normalizeBaseUrl(
        process.env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL,
      ),
      apiKey: process.env.OPENROUTER_API_KEY ?? "",
      model: process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL,
    },
    {
      label: "Groq",
      baseUrl: normalizeBaseUrl(
        process.env.GROQ_BASE_URL ?? DEFAULT_GROQ_BASE_URL,
      ),
      apiKey: process.env.GROQ_API_KEY ?? "",
      model: process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL,
    },
    {
      label: "Gemini",
      baseUrl: normalizeBaseUrl(
        process.env.GEMINI_BASE_URL ?? DEFAULT_GEMINI_BASE_URL,
      ),
      apiKey: process.env.GEMINI_API_KEY ?? "",
      model: process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
    },
    {
      label: "Cerebras",
      baseUrl: normalizeBaseUrl(
        process.env.CEREBRAS_BASE_URL ?? DEFAULT_CEREBRAS_BASE_URL,
      ),
      apiKey: process.env.CEREBRAS_API_KEY ?? "",
      model: process.env.CEREBRAS_MODEL ?? DEFAULT_CEREBRAS_MODEL,
    },
  ];

  return providers.filter(
    (provider) =>
      provider.apiKey.trim() !== "" &&
      provider.model.trim() !== "",
  );
}

async function fetchCompletion(
  config: ProviderConfig,
  system: string,
  prompt: string,
): Promise<string> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 45000);

  let res: Response;

  try {
    res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        ...(config.label === "OpenRouter"
          ? {
              "HTTP-Referer":
                process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
              "X-Title":
                process.env.OPENROUTER_APP_NAME ?? "Sinir Kartlari",
            }
          : {}),
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.85,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");

    throw new Error(
      `${config.label} üretim hatası (${res.status}): ${detail.slice(0, 500)}`,
    );
  }

  const data = (await res.json()) as {
    choices?: {
      message?: {
        content?: string;
      };
    }[];
  };

  const content = data.choices?.[0]?.message?.content ?? "";

  if (!content.trim()) {
    throw new Error(`${config.label} boş cevap döndürdü.`);
  }

  return content;
}

async function callLlm(
  system: string,
  prompt: string,
): Promise<string> {
  const configs = providerConfigs();

  if (configs.length === 0) {
    throw new Error(
      "Hiçbir AI sağlayıcısı yapılandırılmamış. " +
        "OPENROUTER_API_KEY, GROQ_API_KEY, GEMINI_API_KEY veya CEREBRAS_API_KEY " +
        "değişkenlerinden en az birini .env'e ekleyin.",
    );
  }

  let lastError: Error | null = null;

  for (const config of configs) {
    try {
      const content = await fetchCompletion(
        config,
        system,
        prompt,
      );

      if (content.trim()) {
        console.info(
          `[AI] ${config.label} kullanıldı (${config.model})`,
        );

        return content;
      }

      lastError = new Error(
        `${config.label} boş içerik döndürdü.`,
      );
    } catch (err) {
      lastError =
        err instanceof Error
          ? err
          : new Error(`${config.label} bilinmeyen üretim hatası`);

      console.warn(
        `[AI] ${config.label} başarısız, sonraki sağlayıcı deneniyor:`,
        lastError.message,
      );
    }
  }

  throw (
    lastError ??
    new Error("Tüm AI sağlayıcıları başarısız oldu.")
  );
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
  level: IntensityId,
  exclude: string[],
  players: string[] = [],
): Promise<TruthQuestion[]> {
  const levelLabel: Record<IntensityId, string> = {
    hafif: "hafif",
    orta: "orta",
    atesli: "ateşli",
    "sinir-otesi": "sınır-ötesi",
  };

  const baseLabel = levelLabel[level];

  const cardBlock = cards
    .map((c, i) => {
      const cardLevel = levelLabel[c.hard ? getSertIntensity(level) : level];
      return `${i + 1}. Kategori: ${c.name} | Seviye: ${cardLevel}${
        c.hard ? " | SERT" : ""
      }`;
    })
    .join("\n");

  const previousBlock = exclude.length
    ? exclude
        .slice(0, 40)
        .map((q, index) => `${index + 1}. ${q}`)
        .join("\n")
    : "- (boş)";

  const prompt = `Sen, Türkçe "Sınır Kartları" doğruluk oyununun soru üretim motorusun. Yalnızca doğruluk sorusu üret; görev, eylem, meydan okuma, ceza veya soru olmayan içerik ASLA üretme.

GİRDİLER: Aşağıda; MOD, ZORLUK, KARTLAR ve ÖNCEKİ_SORULAR değerleri verildi.

İsim verilmez; başka oyuncudan bahsederken yalnızca "@oyuncu" yaz.

ÇIKTI:
- Tam 5 soru üret, kart sırasına birebir uy.
- Sadece sorunun metnini yaz; kategori, emoji, seviye, sıra numarası gibi kart bilgisini asla ekleme.
- Her soru: tek cümle, "sen" hitabı, "?" ile biten, 8-20 kelime, doğal akıcı Türkçe.

MOD:
soft: kişisel/utandırıcı/cesur olabilir ama herkesin yanında okunur; cinsel/erotik içerik yasak.
ekstrem: daha mahrem, kışkırtıcı, zorlayıcı olabilir; yine de dil temiz ve saygılı kalır, açık cinsel içerik yasak.

ZORLUK:
hafif: günlük tercihler, hafif itiraflar, düşük risk.
orta: kişisel konular, utandıran durumlar, alışkanlıklar.
ateşli: ilişkiler, kıskançlık, güven, sırlar, utanç; düşündüren.
sınır-ötesi: güçlü sırlar, yoğun duygular, sınırlar; dürüst olması zor.
SERT kart bir seviye zor olur (hafif→orta, orta→ateşli, ateşli→sınır-ötesi); kelimeleri değil konuyu zorlaştır.

KATEGORİ: Soru kartının kategorisiyle ilgili olsun. Kategoriler: Hayat, Aşk, Gizli, Geçmiş, Hayal, Duygu, Arkadaş, Cesaret, Aile, Para, Gelecek, Korku, Utanç, Güven, Tarz, Gece, Dijital, Yiyecek, Müzik.

@oyuncu:
- 5 sorunun yaklaşık YARISI (2-3 soru) doğrudan cevap verenin kendisiyle ilgili olsun ("sen" hitabı, @oyuncu YOK): ör. "En büyük pişmanlığın neydi?", "Şu an aklında ne var?".
- Kalan 2-3 soru başka oyuncu hakkında olsun; cevap veren "sen", konuşulan "@oyuncu".
- Kalıp: "Sence @oyuncu ... olsa ne yapardı?", "Sence @oyuncu hangisini seçerdi?".
- YASAK: "@oyuncu'ya sor", "@oyuncu anlatsın", "@oyuncu ne düşünüyorsun", "@oyuncu, ... yapar mısın?". @oyuncu'dan sonra virgül koyma; @Oyuncu, @player, gerçek isim kullanma.

TEKRAR YASAĞI (EN ÖNCELİKLİ):
- ÖNCEKİ_SORULAR'ı temel fikriyle ele al (konu, senaryo, beklenen cevap, davranış); aynı fikri tekrar etme.
- Kelimeler değişse de aynı cevabı bekleyen soru yasak. Eş anlamlı kelime, fiil/zaman/mekan değişimi yeni soru saymaz.
- Aynı kategoride aynı alt konuyu kullanma; klişe sorma ("en büyük pişmanlığın ne?", "bir dileğin olsa ne dilerdin?").

DİL & ÇEŞİTLİLİK:
- 5 soru birbirinden farklı olsun (konu, durum, senaryo, yapı); aynı senaryoyu ikiye kullanma.
- Yaklaşık yarısı eğlenceli/komik/yaratıcı olsun.
- Başlangıçları çeşitlendir ("Sence...", "Hiç...", "Eğer..." ile başlatma).
- Tek ana soru; zincirleme soru yasak.
- YAZIM/DİL BİLGİSİ HATASIZ: İyelik ekleri doğru olsun ("en büyük korkun ne?" — "korkunun ne?" YANLIŞ); "ki" ve "de/da" doğru yazılsın; ekler ve tamlamalar uyumlu olsun; çeviri/uygulama üslubu kullanma. Üretilen her soruyu yazım ve dil bilgisi açısından gözden geçir.

ÖNCELİK: 1. Güvenlik 2. Sadece soru 3. Tam 5 soru 4. Kart sırası 5. Tekrar engeli 6. Kategori 7. Seviye 8. @oyuncu 9. Çeşitlilik 10. Yaratıcılık.

BU TURUN GİRDİLERİ:
MOD: ${mode === "ekstrem" ? "ekstrem" : "soft"}
ZORLUK: ${baseLabel}
OYUNCU_SAYISI: ${players.length}

KARTLAR:
${cardBlock}

ÖNCEKİ_SORULAR:
${previousBlock}

SON TALİMAT: Yalnızca tam 5 doğruluk sorusunu kart sırasıyla, başka hiçbir şey yazmadan gönder.`;

  const content = await callLlm(
    "Sen, Türkçe 'Sınır Kartları' doğruluk oyununun soru üretim motorusun. Yalnızca doğruluk soruları üretirsin.",
    prompt,
  );

  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questions: TruthQuestion[] = [];
  for (let i = 0; i < cards.length; i++) {
    const raw = lines[i] ?? "";
    const text = raw
      .replace(/^\d+[.)]\s*/, "")
      .replace(/^[-–•*]\s*/, "")
      .replace(/^[\s\S]*?\bseviye:\s*[^,"'«»“”\n]*\s*,?\s*/i, "")
      .replace(/^[^\p{L}\p{N}]+\s*/u, "")
      .replace(/^["'«»“”]+|["'«»“”]+$/g, "")
      .trim();
    if (!text || !text.endsWith("?")) continue;
    if (text.includes("@oyuncu,")) continue;
    if (text.length > 220) continue;

    const card = cards[i];
    questions.push({
      id: `ai-${Date.now()}-${i}`,
      text,
      tag: card.name,
      intensity: card.hard ? getSertIntensity(level) : level,
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
- Dil: Düzgün, doğal ve akıcı Türkçe kullan. Bozuk cümle, yanlış ek, yapay/çeviri kokan ifade, İngilizce veya argo karışıklığı olmasın. Soru herkesin ilk okumada anlayacağı kadar net olsun. YAZIM VE DİL BİLGİSİ HATASIZ ol (iyelik ekleri doğru: "en büyük korkun ne?", "korkunun ne?" YANLIŞ; "ki" ve "de/da" doğru yazılsın).
- Küfür, argo, hakaret ve müstehcen laf yasak; içerik ne kadar cesur olursa olsun kelimeler temiz ve saygılı kalmalı.
- Her soru TEK cümle, "sen" hitabı, en fazla ~30 kelime, soru işaretiyle bitsin.
- Sorular birbirinden ve klişelerden farklı olsun; geniş bir konu yelpazesine yayılsın.
- Her soruya 1-2 kelimelik kısa bir etiket ver (ör: "Aşk", "Arkadaş", "Hayat", "Gizli", "Anı", "Korku", "Sınır", "Flört", "Geçmiş").${excludeBlock}

Çıktı YALNIZCA geçerli bir JSON dizisi, başka hiçbir metin olmadan:
[{"text": "soru metni", "tag": "etiket"}]`;

  const content = await callLlm(
    "Sen kurnaz bir doğruluk oyunu soru yazarısın. Sadece JSON dizisi döndürürsün.",
    prompt,
  );

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