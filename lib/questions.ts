export type IntensityId = "hafif" | "orta" | "atesli" | "sinir-otesi";

export type ModeId = "soft" | "ekstrem";

export type Mode = {
  id: ModeId;
  name: string;
  short: string;
  emoji: string;
  adult: boolean;
  description: string;
};

export const MODES: Mode[] = [
  {
    id: "soft",
    name: "Standart",
    short: "13+",
    emoji: "🧸",
    adult: false,
    description: "Herkes için uygun; sınırları zorlayan ama temiz sorular.",
  },
  {
    id: "ekstrem",
    name: "Ekstrem",
    short: "18+",
    emoji: "🔞",
    adult: true,
    description: "Yalnızca yetişkinler için. Sert, +18 içerikli sorular.",
  },
];

export type TruthQuestion = {
  id: string;
  text: string;
  intensity: IntensityId;
  tag: string;
  mode?: ModeId;
};

export type Intensity = {
  id: IntensityId;
  name: string;
  tagline: string;
  emoji: string;
  level: number;
};

export const INTENSITIES: Intensity[] = [
  {
    id: "hafif",
    name: "Isınma Turu",
    tagline: "Yumuşak giriş. Kimse yanmaz.",
    emoji: "🥤",
    level: 1,
  },
  {
    id: "orta",
    name: "Isı Yükseliyor",
    tagline: "Sırlar yavaşça sızıyor.",
    emoji: "🔥",
    level: 2,
  },
  {
    id: "atesli",
    name: "Kıvılcım",
    tagline: "Kalp atışları hızlanıyor.",
    emoji: "💘",
    level: 3,
  },
  {
    id: "sinir-otesi",
    name: "Sınır Ötesi",
    tagline: "Artık geri dönüş yok.",
    emoji: "🌋",
    level: 4,
  },
];

export const QUESTIONS: TruthQuestion[] = [
  {
    id: "h1",
    intensity: "hafif",
    tag: "Hayat",
    text: "En son ne zaman çocuk gibi heyecanlandın, neydi o?",
  },
  {
    id: "h2",
    intensity: "hafif",
    tag: "Hayat",
    text: "Şu ana kadar yaptığın en komik hata neydi?",
  },
  {
    id: "h3",
    intensity: "hafif",
    tag: "Hayal",
    text: "Bir günlüğüne ünlü olsan, neyle ünlü olurdun?",
  },
  {
    id: "h4",
    intensity: "hafif",
    tag: "Gizli",
    text: "Kimsenin bilmediği en tuhaf alışkanlığın nedir?",
  },
  {
    id: "h5",
    intensity: "hafif",
    tag: "Hayal",
    text: "Hangi süper güce sahip olmak isterdin, neden?",
  },
  {
    id: "h6",
    intensity: "hafif",
    tag: "Dijital",
    text: "Telefonunda en çok kullandığın üç uygulama hangileri?",
  },
  {
    id: "h7",
    intensity: "hafif",
    tag: "Anı",
    text: "En sevdiğin çocukluk anın hangisi?",
  },
  {
    id: "h8",
    intensity: "hafif",
    tag: "Hayal",
    text: "Bir hayvan olsan hangisi olurdun, neden?",
  },
  {
    id: "h9",
    intensity: "hafif",
    tag: "Hayat",
    text: "En son kime minnettar hissettin, sebebi neydi?",
  },
  {
    id: "h10",
    intensity: "hafif",
    tag: "Zevk",
    text: "En tuhaf yemek kombinasyonun nedir?",
  },
  {
    id: "h11",
    intensity: "hafif",
    tag: "Hayal",
    text: "Sabah uyanınca ilk aklına gelen şey ne olur?",
  },
  {
    id: "h12",
    intensity: "hafif",
    tag: "Hayal",
    text: "Hangi ülkeye gitmeyi en çok istersin, neden?",
  },
  {
    id: "h13",
    intensity: "hafif",
    tag: "Anı",
    text: "En son neye o kadar güldün ki hâlâ aklına gelince gülüyorsun?",
  },
  {
    id: "h14",
    intensity: "hafif",
    tag: "Eşya",
    text: "Sahip olduğun en anlamsız eşya nedir?",
  },
  {
    id: "h15",
    intensity: "hafif",
    tag: "Hayal",
    text: "Hayatın film olsa, başrolü kim oynardı?",
  },
  {
    id: "h16",
    intensity: "hafif",
    tag: "Hayal",
    text: "Hangi tarihi dönemde yaşamak isterdin?",
  },
  {
    id: "h17",
    intensity: "hafif",
    tag: "Zevk",
    text: "En sevdiğin tatlı hangisi, birine tarif etmek zorunda kalsan ne söylersin?",
  },
  {
    id: "h18",
    intensity: "hafif",
    tag: "Hayat",
    text: "Hangi mevsimi seversin, seni en çok hangisi anlatır?",
  },
  {
    id: "h19",
    intensity: "hafif",
    tag: "Hayal",
    text: "Bir meslek seçmek zorunda olsan ama para umrunda olmasa, ne yapardın?",
  },
  {
    id: "h20",
    intensity: "hafif",
    tag: "Anı",
    text: "En son kendine hangi küçük hediyeyi aldın?",
  },
  {
    id: "o1",
    intensity: "orta",
    tag: "Geçmiş",
    text: "Hayatındaki en büyük pişmanlığın nedir?",
  },
  {
    id: "o2",
    intensity: "orta",
    tag: "Geçmiş",
    text: "Şu ana kadar söylediğin en büyük yalan neydi, kimse anladı mı?",
  },
  {
    id: "o3",
    intensity: "orta",
    tag: "İnsanlar",
    text: "İlk görüşte en çok yanıldığın insan kimdi?",
  },
  {
    id: "o4",
    intensity: "orta",
    tag: "Gizli",
    text: "Hangi alışkanlığını bırakmayı en çok istersin ama bırakamıyorsun?",
  },
  {
    id: "o5",
    intensity: "orta",
    tag: "İnsanlar",
    text: "En son ne zaman biri seni gerçekten kızdırdı, ne oldu?",
  },
  {
    id: "o6",
    intensity: "orta",
    tag: "İnsanlar",
    text: "Hayatında en çok kimi kıskandın ve neden?",
  },
  {
    id: "o7",
    intensity: "orta",
    tag: "Duygu",
    text: "En son ne zaman ağladın, ne oldu?",
  },
  {
    id: "o8",
    intensity: "orta",
    tag: "Gizli",
    text: "Kimseye söylemediğin bir şeyi şimdi söyler misin?",
  },
  {
    id: "o9",
    intensity: "orta",
    tag: "Öz eleştiri",
    text: "Kendin hakkında en çok neyi eleştirirsin?",
  },
  {
    id: "o10",
    intensity: "orta",
    tag: "Hayat",
    text: "Birine borçlu hissettiğin bir an oldu mu, neydi?",
  },
  {
    id: "o11",
    intensity: "orta",
    tag: "Gizli",
    text: "En tuhaf rüyan neydi, anlat. ",
  },
  {
    id: "o12",
    intensity: "orta",
    tag: "Hayal",
    text: "Hangi ünlüyle yemek yemek isterdin ve ona ilk ne sorardın?",
  },
  {
    id: "o13",
    intensity: "orta",
    tag: "Sınır",
    text: "Keşke daha atak davransaydım dediğin bir an var mı?",
  },
  {
    id: "o14",
    intensity: "orta",
    tag: "Öz eleştiri",
    text: "Hangi konuda sürekli erteliyorsun ve gerçek nedeni ne?",
  },
  {
    id: "o15",
    intensity: "orta",
    tag: "Gizli",
    text: "Arkadaşlarının hakkında bilmediği bir yeteneğin var mı?",
  },
  {
    id: "o16",
    intensity: "orta",
    tag: "İnsanlar",
    text: "En sevdiğin insanın seni en çok sinirlendiren özelliği ne?",
  },
  {
    id: "o17",
    intensity: "orta",
    tag: "Geçmiş",
    text: "Asla tekrarlamayacağına söz verdiğin bir hata hangisi?",
  },
  {
    id: "o18",
    intensity: "orta",
    tag: "Hayal",
    text: "Bir günlüğüne başka biri olabilsen kim olurdun, neden?",
  },
  {
    id: "o19",
    intensity: "orta",
    tag: "Hayat",
    text: "Hayatında şu an en çok neyi değiştirmek isterdin?",
  },
  {
    id: "o20",
    intensity: "orta",
    tag: "Korku",
    text: "Kimsenin bilmediği bir korkun var mı, nedir?",
  },
  {
    id: "a1",
    intensity: "atesli",
    tag: "Kalp",
    text: "Hoşlandığın ama asla söyleyemediğin biri oldu mu, kimdi?",
  },
  {
    id: "a2",
    intensity: "atesli",
    tag: "Flört",
    text: "En etkileyici bulduğun flört hareketin ne?",
  },
  {
    id: "a3",
    intensity: "atesli",
    tag: "Kalp",
    text: "İlk kez 'seni seviyorum' dediğinde kaç yaşındaydın, kime dedin?",
  },
  {
    id: "a4",
    intensity: "atesli",
    tag: "İlişki",
    text: "Bir ilişkide en çok neye değer verirsin?",
  },
  {
    id: "a5",
    intensity: "atesli",
    tag: "Kalp",
    text: "Şu ana kadar sana en yakın hissettiren kişi kimdi?",
  },
  {
    id: "a6",
    intensity: "atesli",
    tag: "Flört",
    text: "Birinin sana ilgi duyduğunu nasıl anlarsın?",
  },
  {
    id: "a7",
    intensity: "atesli",
    tag: "Anı",
    text: "En unutulmaz randevun nasıl geçti?",
  },
  {
    id: "a8",
    intensity: "atesli",
    tag: "Kalp",
    text: "Hangi film ya da dizi karakterine gerçekten aşık oldun?",
  },
  {
    id: "a9",
    intensity: "atesli",
    tag: "Flört",
    text: "Beğendiğin birine ilk mesajı atsan ne yazardın?",
  },
  {
    id: "a10",
    intensity: "atesli",
    tag: "Sınır",
    text: "Şu ana kadar yaptığın en cüretkâr şey neydi?",
  },
  {
    id: "a11",
    intensity: "atesli",
    tag: "Anı",
    text: "Birini etkilemek için yaptığın en komik şey neydi?",
  },
  {
    id: "a12",
    intensity: "atesli",
    tag: "Kalp",
    text: "Karşındaki insanda en çok neyi çekici bulursun?",
  },
  {
    id: "a13",
    intensity: "atesli",
    tag: "Flört",
    text: "Sana biri ilgi gösterdi ama sen fark etmedin; fark ettiğinde ne oldu?",
  },
  {
    id: "a14",
    intensity: "atesli",
    tag: "Kalp",
    text: "Flört konusunda insanların seni en çok yanlış anladığı şey ne?",
  },
  {
    id: "a15",
    intensity: "atesli",
    tag: "Anı",
    text: "Eski bir aşkından kalan en komik anın hangisi?",
  },
  {
    id: "a16",
    intensity: "atesli",
    tag: "Kalp",
    text: "Birine hediye seçerken en çok neyi düşünürsün?",
  },
  {
    id: "a17",
    intensity: "atesli",
    tag: "Romantik",
    text: "Söyleyebileceğin en romantik cümleyi burada söyler misin?",
  },
  {
    id: "a18",
    intensity: "atesli",
    tag: "Kalp",
    text: "Hangi şarkı seni eski birine götürür, neden?",
  },
  {
    id: "a19",
    intensity: "atesli",
    tag: "Flört",
    text: "Flört ederken en çok hangi repliği kullanırsın?",
  },
  {
    id: "a20",
    intensity: "atesli",
    tag: "Kalp",
    text: "Hayatında kiminle çıkmayı en çok istedin ama bir türlü adım atamadın?",
  },
  {
    id: "s1",
    intensity: "sinir-otesi",
    tag: "Geçmiş",
    text: "Keşke hiç söylemeseydim dediğin bir şey söyle.",
  },
  {
    id: "s2",
    intensity: "sinir-otesi",
    tag: "Gizli",
    text: "Hiç kimseye söylemediğin ve planlamadığın bir sırrın var mı? Şimdi söyler misin?",
  },
  {
    id: "s3",
    intensity: "sinir-otesi",
    tag: "Hayat",
    text: "Seni en çok zorlayan karar neydi?",
  },
  {
    id: "s4",
    intensity: "sinir-otesi",
    tag: "Duygu",
    text: "En karanlık anında seni ayakta tutan neydi?",
  },
  {
    id: "s5",
    intensity: "sinir-otesi",
    tag: "İlişki",
    text: "Bir ilişkide yaptığın en büyük hata neydi?",
  },
  {
    id: "s6",
    intensity: "sinir-otesi",
    tag: "Gizli",
    text: "Kendine bile itiraf etmekte zorlandığın bir gerçek var mı?",
  },
  {
    id: "s7",
    intensity: "sinir-otesi",
    tag: "İnsanlar",
    text: "Buradaki arkadaşların hakkında düşündüğün ama söylemediğin bir şey söyle.",
  },
  {
    id: "s8",
    intensity: "sinir-otesi",
    tag: "Duygu",
    text: "Sevdiğin birinden duyduğun en acı söz neydi?",
  },
  {
    id: "s9",
    intensity: "sinir-otesi",
    tag: "Duygu",
    text: "Birini gerçekten affettiğin an hangisiydi?",
  },
  {
    id: "s10",
    intensity: "sinir-otesi",
    tag: "Hayat",
    text: "Şu an hayatında olmasını istediğin ama dile getiremediğin ne var?",
  },
  {
    id: "s11",
    intensity: "sinir-otesi",
    tag: "İnsanlar",
    text: "İnsanların senin hakkında en çok yanıldığı şey ne?",
  },
  {
    id: "s12",
    intensity: "sinir-otesi",
    tag: "Duygu",
    text: "Gece uyuyamadığın son konu neydi?",
  },
  {
    id: "s13",
    intensity: "sinir-otesi",
    tag: "Sınır",
    text: "Asla göze alamadığın bir şey var mı?",
  },
  {
    id: "s14",
    intensity: "sinir-otesi",
    tag: "İnsanlar",
    text: "Bir arkadaşının sana yaptığı en büyük iyilik neydi?",
  },
  {
    id: "s15",
    intensity: "sinir-otesi",
    tag: "Geçmiş",
    text: "Hayatında 'keşke' dediğin en büyük an neydi?",
  },
  {
    id: "s16",
    intensity: "sinir-otesi",
    tag: "Korku",
    text: "En derin korkun nereden geliyor?",
  },
  {
    id: "s17",
    intensity: "sinir-otesi",
    tag: "İnsanlar",
    text: "Birine 'beni çok kırdın' demen gerekti ama söylemedin; kime neydi?",
  },
  {
    id: "s18",
    intensity: "sinir-otesi",
    tag: "Geçmiş",
    text: "Kendine verdiğin ama tutamadığın bir söz hangisi?",
  },
  {
    id: "s19",
    intensity: "sinir-otesi",
    tag: "Duygu",
    text: "İçten içe kıskandığın ama kimseye söylemediğin bir şey var mı?",
  },
  {
    id: "s20",
    intensity: "sinir-otesi",
    tag: "Geçmiş",
    text: "'Asla' dediğin ama sonra yaptığın bir şey var mı?",
  },
  {
    id: "x1",
    intensity: "hafif",
    tag: "Flört",
    mode: "ekstrem",
    text: "Birine çıkma teklif ederken kullandığın en cüretkâr cümle ne?",
  },
  {
    id: "x2",
    intensity: "hafif",
    tag: "Arzu",
    mode: "ekstrem",
    text: "Kendini en seksi bulduğun an ne zaman, ne giyiyordun?",
  },
  {
    id: "x3",
    intensity: "hafif",
    tag: "Gece",
    mode: "ekstrem",
    text: "Gece kulübünde dans ederken en çok yaptığın şey ne?",
  },
  {
    id: "x4",
    intensity: "hafif",
    tag: "Fantezi",
    mode: "ekstrem",
    text: "Hangi ünlüyle bir gecelik olsa hemen kabul ederdin?",
  },
  {
    id: "x5",
    intensity: "hafif",
    tag: "Flört",
    mode: "ekstrem",
    text: "İlk randevuda birini en çok etkileyen hareketin hangisi?",
  },
  {
    id: "x6",
    intensity: "orta",
    tag: "Fantezi",
    mode: "ekstrem",
    text: "Kimseye söylemediğin bir fantezini şimdi paylaşır mısın?",
  },
  {
    id: "x7",
    intensity: "orta",
    tag: "Anı",
    mode: "ekstrem",
    text: "En unutulmaz öpüşmen nasıl başladı, neredeydi?",
  },
  {
    id: "x8",
    intensity: "orta",
    tag: "Arzu",
    mode: "ekstrem",
    text: "Birine ilk görüşte arzu duyduğun oldu mu, ne yaptın?",
  },
  {
    id: "x9",
    intensity: "orta",
    tag: "Flört",
    mode: "ekstrem",
    text: "Öpüşürken seni en çok çıldırtan detay ne?",
  },
  {
    id: "x10",
    intensity: "orta",
    tag: "Deneyim",
    mode: "ekstrem",
    text: "Şimdiye kadarki en cüretkâr flört hareketin neydi?",
  },
  {
    id: "x11",
    intensity: "atesli",
    tag: "Deneyim",
    mode: "ekstrem",
    text: "Yatak odasında denediğin ve en sevdiğin şey ne?",
  },
  {
    id: "x12",
    intensity: "atesli",
    tag: "Gece",
    mode: "ekstrem",
    text: "Şu ana kadar en vahşi geceyi yaşadın mı, nasıldı?",
  },
  {
    id: "x13",
    intensity: "atesli",
    tag: "Arzu",
    mode: "ekstrem",
    text: "Partnerinde seni en çok ateşleyen üç şeyi sırala.",
  },
  {
    id: "x14",
    intensity: "atesli",
    tag: "Deneyim",
    mode: "ekstrem",
    text: "Çıplak olduğun en cüretkâr an nerede yaşandı?",
  },
  {
    id: "x15",
    intensity: "atesli",
    tag: "Flört",
    mode: "ekstrem",
    text: "Birini baştan çıkarmak için en sevdiğin yöntem ne?",
  },
  {
    id: "x16",
    intensity: "sinir-otesi",
    tag: "Fantezi",
    mode: "ekstrem",
    text: "En karanlık fantezin nedir, dürüstçe anlatır mısın?",
  },
  {
    id: "x17",
    intensity: "sinir-otesi",
    tag: "Sınır",
    mode: "ekstrem",
    text: "Bir partnerle asla denemeyeceğin bir şey var mı, neden?",
  },
  {
    id: "x18",
    intensity: "sinir-otesi",
    tag: "Geçmiş",
    mode: "ekstrem",
    text: "Şimdiye kadar yaşadığın en skandal anın neydi?",
  },
  {
    id: "x19",
    intensity: "sinir-otesi",
    tag: "Sınır",
    mode: "ekstrem",
    text: "Cinsellikle ilgili en büyük tabun ne?",
  },
  {
    id: "x20",
    intensity: "sinir-otesi",
    tag: "Deneyim",
    mode: "ekstrem",
    text: "Aynı anda birden fazla kişiyle ilgili deneyimin ya da hayalin var mı?",
  },
];

export function getQuestionsByIntensity(
  intensity: IntensityId,
  mode: ModeId = "soft",
): TruthQuestion[] {
  return QUESTIONS.filter(
    (q) => q.intensity === intensity && (q.mode ?? "soft") === mode,
  );
}

export function getIntensity(id: IntensityId): Intensity {
  return INTENSITIES.find((i) => i.id === id) ?? INTENSITIES[0];
}

export function getRandomQuestions(intensity: IntensityId, count: number): TruthQuestion[] {
  const pool = [...getQuestionsByIntensity(intensity)];
  const result: TruthQuestion[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

export function normalizeText(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[.,!?;:«»""''()\-–—…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
