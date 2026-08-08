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
  modes?: ModeId[];
};

function isEligibleForMode(q: TruthQuestion, mode: ModeId): boolean {
  if (q.modes) return q.modes.includes(mode);
  return (q.mode ?? "soft") === mode;
}

export type Intensity = {
  id: IntensityId;
  name: string;
  tagline: string;
  emoji: string;
  level: number;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  tags: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "hayat",
    name: "Hayat",
    emoji: "🧠",
    tags: ["Hayat", "Zevk", "Eşya"],
  },
  {
    id: "gizli",
    name: "Gizli",
    emoji: "🎭",
    tags: ["Gizli"],
  },
  {
    id: "gecmis",
    name: "Geçmiş",
    emoji: "📜",
    tags: ["Geçmiş", "Anı", "Öz eleştiri"],
  },
  {
    id: "ask",
    name: "Aşk",
    emoji: "❤️",
    tags: ["Kalp", "Flört", "İlişki", "Romantik"],
  },
  {
    id: "hayal",
    name: "Hayal",
    emoji: "✨",
    tags: ["Hayal", "Dijital"],
  },
  {
    id: "duygu",
    name: "Duygu",
    emoji: "🌊",
    tags: ["Duygu", "Korku"],
  },
  {
    id: "arkadas",
    name: "Arkadaş",
    emoji: "🤝",
    tags: ["İnsanlar"],
  },
  {
    id: "cesaret",
    name: "Cesaret",
    emoji: "⚡",
    tags: ["Sınır", "Deneyim", "Fantezi", "Gece", "Arzu"],
  },
  {
    id: "aile",
    name: "Aile",
    emoji: "👨‍👩‍👧",
    tags: ["Aile"],
  },
  {
    id: "para",
    name: "Para",
    emoji: "💸",
    tags: ["Para"],
  },
  {
    id: "gelecek",
    name: "Gelecek",
    emoji: "🔮",
    tags: ["Gelecek"],
  },
  {
    id: "korku",
    name: "Korku",
    emoji: "😱",
    tags: ["Korku"],
  },
  {
    id: "utanc",
    name: "Utanç",
    emoji: "😅",
    tags: ["Utanç"],
  },
  {
    id: "guven",
    name: "Güven",
    emoji: "💔",
    tags: ["Güven"],
  },
  {
    id: "tarz",
    name: "Tarz",
    emoji: "🕶️",
    tags: ["Tarz"],
  },
  {
    id: "gece",
    name: "Gece",
    emoji: "🌙",
    tags: ["Gece"],
  },
  {
    id: "yolculuk",
    name: "Yolculuk",
    emoji: "✈️",
    tags: ["Yolculuk"],
  },
  {
    id: "dijital",
    name: "Dijital",
    emoji: "📱",
    tags: ["Dijital"],
  },
  {
    id: "yiyecek",
    name: "Yiyecek",
    emoji: "🍽️",
    tags: ["Yiyecek"],
  },
  {
    id: "muzik",
    name: "Müzik",
    emoji: "🎵",
    tags: ["Müzik"],
  },
];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

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
  {
    id: "e1",
    intensity: "hafif",
    tag: "Hayal",
    modes: ["soft", "ekstrem"],
    text: "Bir hafta boyunca hiç konuşma yasağın olsa, ilk gün en çok ne anlatmak isterdin?",
  },
  {
    id: "e2",
    intensity: "hafif",
    tag: "Zevk",
    modes: ["soft", "ekstrem"],
    text: "Tüm hayatın boyunca tek bir yemek yemek zorunda kalsan hangisini seçerdin?",
  },
  {
    id: "e3",
    intensity: "hafif",
    tag: "Dijital",
    modes: ["soft", "ekstrem"],
    text: "Telefonun şarjı bitse ve 10 saat beklemen gerekse ilk yapacağın üç şey nedir?",
  },
  {
    id: "e4",
    intensity: "hafif",
    tag: "Hayal",
    modes: ["soft", "ekstrem"],
    text: "Bir günlüğüne süper hız kazansan en çok ne yapardın?",
  },
  {
    id: "e5",
    intensity: "hafif",
    tag: "Anı",
    modes: ["soft", "ekstrem"],
    text: "Çocukken en takıntılı olduğun şey neydi?",
  },
  {
    id: "e6",
    intensity: "hafif",
    tag: "Hayat",
    modes: ["soft", "ekstrem"],
    text: "Bir meyve olsan hangisi olurdun, neden?",
  },
  {
    id: "e7",
    intensity: "orta",
    tag: "Hayal",
    modes: ["soft", "ekstrem"],
    text: "Zamanı bir saatliğine durdurabilsen ilk yapacağın şey ne olurdu?",
  },
  {
    id: "e8",
    intensity: "orta",
    tag: "İnsanlar",
    modes: ["soft", "ekstrem"],
    text: "Bu gruptan biriyle bir günlüğüne yer değiştirme şansın olsa kimi seçerdin, neden?",
  },
  {
    id: "e9",
    intensity: "orta",
    tag: "İnsanlar",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu bir milyon dolar kazansa ilk iş olarak ne yapardı?",
  },
  {
    id: "e10",
    intensity: "hafif",
    tag: "Hayal",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu bir yıl boyunca tatlı yiyemese sence kaç güne dayanırdı?",
  },
  {
    id: "e11",
    intensity: "hafif",
    tag: "Hayal",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu bir hayvan olsaydı sence hangisi olurdu, neden?",
  },
  {
    id: "e12",
    intensity: "orta",
    tag: "İnsanlar",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu bütün sosyal medyayı bıraksa sence en çok neyi özlerdi?",
  },
  {
    id: "e13",
    intensity: "hafif",
    tag: "Zevk",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu en çok hangi yemeği yemeyi reddederdi?",
  },
  {
    id: "e14",
    intensity: "orta",
    tag: "Gizli",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu'nun kimseye söylemediğini düşündüğün bir şey nedir?",
  },
  {
    id: "e15",
    intensity: "orta",
    tag: "Hayat",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu bir gece yarısı ormanda mahsur kalsa sence ilk ne yapardı?",
  },
  {
    id: "e16",
    intensity: "atesli",
    tag: "Kalp",
    modes: ["soft", "ekstrem"],
    text: "Bu grupta @oyuncu'ya gizlice hoşlanan biri olduğunu düşünüyor musun, neden?",
  },
  {
    id: "e17",
    intensity: "sinir-otesi",
    tag: "Sınır",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu'nun asla göze alamayacağını düşündüğün bir şey nedir?",
  },
  {
    id: "e18",
    intensity: "hafif",
    tag: "Korku",
    modes: ["soft", "ekstrem"],
    text: "En saçma korkun ne, ne zaman başladı?",
  },
  {
    id: "n1",
    intensity: "hafif",
    tag: "Aile",
    modes: ["soft", "ekstrem"],
    text: "Ailende en çok hangi geleneğe uymak zorundasın, hangisine isyan ederdin?",
  },
  {
    id: "n2",
    intensity: "orta",
    tag: "Aile",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu ailesinin hangi özelliğini arkadaşlarına asla anlatmazdı?",
  },
  {
    id: "n3",
    intensity: "sinir-otesi",
    tag: "Aile",
    modes: ["soft", "ekstrem"],
    text: "Ailene hiç söylemediğin bir şey nedir, söylesen ne olurdu?",
  },
  {
    id: "n4",
    intensity: "atesli",
    tag: "Aile",
    modes: ["soft", "ekstrem"],
    text: "@oyuncu ailesiyle bir akşam yemeğine seni çağırsa sence en çok hangi soruya maruz kalırdın?",
  },
  {
    id: "n5",
    intensity: "hafif",
    tag: "Para",
    modes: ["soft", "ekstrem"],
    text: "Cüzdanını kaybettiğini fark ettiğinde ilk aklına gelen şey ne olur?",
  },
  {
    id: "n6",
    intensity: "orta",
    tag: "Para",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu bir hafta boyunca hiç para harcamadan yaşayabilir mi, neden?",
  },
  {
    id: "n7",
    intensity: "sinir-otesi",
    tag: "Para",
    modes: ["soft", "ekstrem"],
    text: "Birine borçlu olduğun ve ödeyemediğin bir para var mı, ne oldu?",
  },
  {
    id: "n8",
    intensity: "atesli",
    tag: "Para",
    modes: ["soft", "ekstrem"],
    text: "Para senden sorulsa en çok neye gereksiz harcama yapardın?",
  },
  {
    id: "n9",
    intensity: "hafif",
    tag: "Gelecek",
    modes: ["soft", "ekstrem"],
    text: "On yıl sonra kendini en çok hangi şehirde görüyorsun?",
  },
  {
    id: "n10",
    intensity: "orta",
    tag: "Gelecek",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu on yıl sonra en çok hangi işi yapıyor olurdu?",
  },
  {
    id: "n11",
    intensity: "sinir-otesi",
    tag: "Gelecek",
    modes: ["soft", "ekstrem"],
    text: "Gelecekten gelen sen, şu anki sana tek bir tavsiye verebilse ne derdi?",
  },
  {
    id: "n12",
    intensity: "atesli",
    tag: "Gelecek",
    modes: ["soft", "ekstrem"],
    text: "Evlenme teklifi planlasan en romantik hali nasıl olurdu?",
  },
  {
    id: "n13",
    intensity: "hafif",
    tag: "Korku",
    modes: ["soft", "ekstrem"],
    text: "Çocukken en çok hangi karanlık şeyden korkardın, şimdi aşabildin mi?",
  },
  {
    id: "n14",
    intensity: "orta",
    tag: "Korku",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu bir korku filminde hayatta kalabilir mi, neden?",
  },
  {
    id: "n15",
    intensity: "sinir-otesi",
    tag: "Korku",
    modes: ["soft", "ekstrem"],
    text: "En derin korkunla yüzleşmek zorunda kalsan hangisi olurdu?",
  },
  {
    id: "n16",
    intensity: "atesli",
    tag: "Korku",
    modes: ["soft", "ekstrem"],
    text: "Gece yalnız başına en çok korktuğun an neydi?",
  },
  {
    id: "n17",
    intensity: "hafif",
    tag: "Utanç",
    modes: ["soft", "ekstrem"],
    text: "Yanlışlıkla en çok utandığın mesaj hangisiydi?",
  },
  {
    id: "n18",
    intensity: "orta",
    tag: "Utanç",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu'nun başına gelen en utanç verici olay ne olabilir?",
  },
  {
    id: "n19",
    intensity: "sinir-otesi",
    tag: "Utanç",
    modes: ["soft", "ekstrem"],
    text: "Kimseye anlatmadığın en utanç verici anın neydi?",
  },
  {
    id: "n20",
    intensity: "atesli",
    tag: "Utanç",
    modes: ["soft", "ekstrem"],
    text: "En son ne zaman kıpkırmızı oldun, sebebi neydi?",
  },
  {
    id: "n21",
    intensity: "hafif",
    tag: "Güven",
    modes: ["soft", "ekstrem"],
    text: "Birine sırrını verirken en çok kimi seçersin, neden?",
  },
  {
    id: "n22",
    intensity: "orta",
    tag: "Güven",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu bir sırrı en çok kaç gün tutabilir?",
  },
  {
    id: "n23",
    intensity: "sinir-otesi",
    tag: "Güven",
    modes: ["soft", "ekstrem"],
    text: "Sana güvenen birini hayal kırıklığına uğrattığın an oldu mu, ne oldu?",
  },
  {
    id: "n24",
    intensity: "atesli",
    tag: "Güven",
    modes: ["soft", "ekstrem"],
    text: "Bir arkadaşının yalanını yakaladın ama söylemedin; neydi o?",
  },
  {
    id: "n25",
    intensity: "hafif",
    tag: "Tarz",
    modes: ["soft", "ekstrem"],
    text: "En kötü aldığın kıyafet kararı hangisiydi?",
  },
  {
    id: "n26",
    intensity: "orta",
    tag: "Tarz",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu ilk izlenimde en çok hangi özelliğiyle akılda kalıyor?",
  },
  {
    id: "n27",
    intensity: "sinir-otesi",
    tag: "Tarz",
    modes: ["soft", "ekstrem"],
    text: "Birini etkilemek için asla vazgeçmeyeceğin stil detayın ne?",
  },
  {
    id: "n28",
    intensity: "atesli",
    tag: "Tarz",
    modes: ["soft", "ekstrem"],
    text: "Karşına çıkan birinde seni en çok çeken dış görünüş detayı ne?",
  },
  {
    id: "n29",
    intensity: "hafif",
    tag: "Gece",
    modes: ["soft", "ekstrem"],
    text: "Gece yarısı canın çektiğinde yediğin en tuhaf şey ne?",
  },
  {
    id: "n30",
    intensity: "orta",
    tag: "Gece",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu sabaha kadar ayakta kalabileceği en eğlenceli geceyi nasıl geçirirdi?",
  },
  {
    id: "n31",
    intensity: "sinir-otesi",
    tag: "Gece",
    modes: ["soft", "ekstrem"],
    text: "Bir gece boyunca pişman olduğun karar hangisiydi?",
  },
  {
    id: "n32",
    intensity: "atesli",
    tag: "Gece",
    modes: ["soft", "ekstrem"],
    text: "Gece hayatında en çılgın anın hangisiydi?",
  },
  {
    id: "n33",
    intensity: "hafif",
    tag: "Yolculuk",
    modes: ["soft", "ekstrem"],
    text: "Ters giden bir tatil anını anlat.",
  },
  {
    id: "n34",
    intensity: "orta",
    tag: "Yolculuk",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu seyahatte en çok neyi unutur?",
  },
  {
    id: "n35",
    intensity: "sinir-otesi",
    tag: "Yolculuk",
    modes: ["soft", "ekstrem"],
    text: "Bir seyahatte yalnız kalmak zorunda kalsan en çok neyi özlerdin?",
  },
  {
    id: "n36",
    intensity: "atesli",
    tag: "Yolculuk",
    modes: ["soft", "ekstrem"],
    text: "Tatilde tanışıp asla unutamadığın biri var mı, kim?",
  },
  {
    id: "n37",
    intensity: "hafif",
    tag: "Dijital",
    modes: ["soft", "ekstrem"],
    text: "En son ne zaman telefonunu elinden düşürüp panikledin?",
  },
  {
    id: "n38",
    intensity: "orta",
    tag: "Dijital",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu'nun telefonunda en gizli olan şey ne?",
  },
  {
    id: "n39",
    intensity: "sinir-otesi",
    tag: "Dijital",
    modes: ["soft", "ekstrem"],
    text: "Silmek zorunda kaldığın ama keşke hiç silmeseydim dediğin bir mesaj ya da arşiv var mı?",
  },
  {
    id: "n40",
    intensity: "atesli",
    tag: "Dijital",
    modes: ["soft", "ekstrem"],
    text: "Birinin telefonunu inceleme şansın olsa en çok kimi merak ederdin?",
  },
  {
    id: "n41",
    intensity: "hafif",
    tag: "Yiyecek",
    modes: ["soft", "ekstrem"],
    text: "Hangi yiyeceği yemek için asla risk almazsın, neden?",
  },
  {
    id: "n42",
    intensity: "orta",
    tag: "Yiyecek",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu'nun asla denemeyeceği yiyecek ne?",
  },
  {
    id: "n43",
    intensity: "sinir-otesi",
    tag: "Yiyecek",
    modes: ["soft", "ekstrem"],
    text: "Bir restoranda garsonla yaşadığın en utanç verici an neydi?",
  },
  {
    id: "n44",
    intensity: "atesli",
    tag: "Yiyecek",
    modes: ["soft", "ekstrem"],
    text: "Karşındakinde en çok itici bulduğun yeme davranışı ne?",
  },
  {
    id: "n45",
    intensity: "hafif",
    tag: "Müzik",
    modes: ["soft", "ekstrem"],
    text: "Seni her zaman neşelendiren şarkı hangisi?",
  },
  {
    id: "n46",
    intensity: "orta",
    tag: "Müzik",
    modes: ["soft", "ekstrem"],
    text: "Sence @oyuncu hangi şarkıda kendinden geçerdi?",
  },
  {
    id: "n47",
    intensity: "sinir-otesi",
    tag: "Müzik",
    modes: ["soft", "ekstrem"],
    text: "Kimseye itiraf etmediğin ama bayılarak dinlediğin şarkı türü ne?",
  },
  {
    id: "n48",
    intensity: "atesli",
    tag: "Müzik",
    modes: ["soft", "ekstrem"],
    text: "Eski birine seni götüren şarkı hangisi, neden?",
  },
];

export function getQuestionsByIntensity(
  intensity: IntensityId,
  mode: ModeId = "soft",
): TruthQuestion[] {
  return QUESTIONS.filter(
    (q) => q.intensity === intensity && isEligibleForMode(q, mode),
  );
}

export function getIntensity(id: IntensityId): Intensity {
  return INTENSITIES.find((i) => i.id === id) ?? INTENSITIES[0];
}

const INTENSITY_ORDER: IntensityId[] = [
  "hafif",
  "orta",
  "atesli",
  "sinir-otesi",
];

export function getSertIntensity(level: IntensityId): IntensityId {
  const index = INTENSITY_ORDER.indexOf(level);
  return INTENSITY_ORDER[Math.min(index + 1, INTENSITY_ORDER.length - 1)];
}

export function getLocalQuestionForCategory(
  category: Category,
  intensity: IntensityId,
  mode: ModeId,
  exclude: string[],
): TruthQuestion | null {
  const pool = QUESTIONS.filter((q) => isEligibleForMode(q, mode));
  const tagged = pool.filter((q) => category.tags.includes(q.tag));
  const fresh = (qs: TruthQuestion[]): TruthQuestion[] => {
    const f = qs.filter((q) => !exclude.includes(dedupeKey(q.text)));
    return f.length > 0 ? f : qs;
  };
  let candidates = fresh(tagged.filter((q) => q.intensity === intensity));
  if (candidates.length === 0) {
    candidates = fresh(pool.filter((q) => q.intensity === intensity));
  }
  if (candidates.length === 0) {
    candidates = fresh(tagged.length > 0 ? tagged : pool);
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
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

export function dedupeKey(text: string, players: string[] = []): string {
  let key = " " + text.toLocaleLowerCase("tr-TR") + " ";
  for (const p of players) {
    const lower = p.toLocaleLowerCase("tr-TR").trim();
    if (!lower) continue;
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    key = key.replace(
      new RegExp(
        `(^|[^a-z0-9])${escaped}(?:[’'][a-zçğıöşü]+)?(?=$|[^a-z0-9])`,
        "g",
      ),
      "$1 @ ",
    );
  }
  key = key.replace(/@oyuncu(?:[’']?[a-zçğıöşü]+)?/g, " @ ");
  key = key
    .replace(/@\s*[,.]?\s*/g, " @ ")
    .replace(/[^a-zçğıöşü0-9@]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return key;
}

const PROFANE_TOKENS = new Set([
  "am",
  "amk",
  "amq",
  "aq",
  "oç",
  "oc",
  "piç",
  "pic",
  "orospu",
  "orosbu",
  "sik",
  "sikeyim",
  "sikmek",
  "siktir",
  "yarak",
  "ibne",
  "puşt",
  "pust",
  "kahpe",
  "kahbe",
  "sürtük",
  "surtuk",
  "fahişe",
  "şerefsiz",
  "serefsiz",
  "dangalak",
  "yavşak",
  "yavsak",
  "göt",
  "got",
  "malah",
  "çük",
  "döl",
  "kaltak",
  "kaltağ",
]);

export function containsProfanity(text: string): boolean {
  const tokens = text
    .toLocaleLowerCase("tr-TR")
    .split(/[^a-zçğıöşü0-9]+/);
  return tokens.some((t) => PROFANE_TOKENS.has(t));
}

export const PLAYER_PLACEHOLDER = "@oyuncu";

const VOWEL4: Record<string, string> = {
  a: "ı",
  ı: "ı",
  e: "i",
  i: "i",
  o: "u",
  u: "u",
  ö: "ü",
  ü: "ü",
};

const VOWEL2: Record<string, string> = {
  a: "a",
  ı: "a",
  o: "a",
  u: "a",
  e: "e",
  i: "e",
  ö: "e",
  ü: "e",
};

type CaseId =
  | "genitive"
  | "dative"
  | "accusative"
  | "locative"
  | "ablative"
  | "comitative";

function lastVowel(name: string): string | null {
  const lowered = name.toLocaleLowerCase("tr-TR");
  for (let i = lowered.length - 1; i >= 0; i--) {
    const ch = lowered[i];
    if ("aıoueiöü".includes(ch)) return ch;
  }
  return null;
}

function endsWithVowel(name: string): boolean {
  return "aıoueiöü".includes(name.trim().slice(-1).toLocaleLowerCase("tr-TR"));
}

function detectCaseSuffix(
  afterApostrophe: string,
): { caseId: CaseId; matched: string } | null {
  const m = afterApostrophe.match(/^[a-zçğıöşü]+/i);
  const s = m ? m[0].toLocaleLowerCase("tr-TR") : "";
  let caseId: CaseId | null = null;
  if (s.startsWith("yl")) caseId = "comitative";
  else if (s.startsWith("y") && /^y[ıiuü]/.test(s)) caseId = "accusative";
  else if (s.startsWith("y")) caseId = "dative";
  else if (s.startsWith("nd")) caseId = s.endsWith("n") ? "ablative" : "locative";
  else if (s.startsWith("d")) caseId = s.endsWith("n") ? "ablative" : "locative";
  else if (s.startsWith("n")) caseId = "genitive";
  else if (s.startsWith("l")) caseId = "comitative";
  else if (/^[ıiuü]n/.test(s)) caseId = "genitive";
  else if (/^[ıiuü]/.test(s)) caseId = "accusative";
  else if (/^[ae]/.test(s)) caseId = "dative";
  if (!caseId) return null;
  return { caseId, matched: s };
}

const VOICELESS_END = "çfhkpstş";

function buildCaseSuffix(caseId: CaseId, name: string): string {
  const lv = lastVowel(name);
  const v2 = lv ? VOWEL2[lv] : "e";
  const v4 = lv ? VOWEL4[lv] : "i";
  const endsV = endsWithVowel(name);
  const last = name.trim().slice(-1).toLocaleLowerCase("tr-TR");
  const d = VOICELESS_END.includes(last) ? "t" : "d";
  switch (caseId) {
    case "genitive":
      return `'${endsV ? `n${v4}` : v4}n`;
    case "dative":
      return `'${endsV ? "y" : ""}${v2}`;
    case "accusative":
      return `'${endsV ? "y" : ""}${v4}`;
    case "locative":
      return `'${d}${v2}`;
    case "ablative":
      return `'${d}${v2}n`;
    case "comitative":
      return `'${endsV ? "y" : ""}l${v2}`;
  }
}

export function fillPlayerPlaceholder(
  text: string,
  currentPlayer: string,
  otherPlayers: string[],
): string {
  if (!text.includes(PLAYER_PLACEHOLDER)) return text;
  const idx = text.indexOf(PLAYER_PLACEHOLDER);
  const before = text.slice(0, idx).trim();
  const after = text.slice(idx + PLAYER_PLACEHOLDER.length);
  if (before === "" && after.startsWith(",")) {
    const addressedToAnswerer = /m[ıiuü]s[ıiuü]n|m[ıiuü]yd[ıiuü]n/.test(after);
    if (addressedToAnswerer) {
      return text.split(PLAYER_PLACEHOLDER).join(currentPlayer);
    }
  }
  const pool = otherPlayers.length > 0 ? otherPlayers : [currentPlayer];
  const name = pool[Math.floor(Math.random() * pool.length)];
  const apostrophe = after.match(/^['’]/);
  const rest = apostrophe ? after.slice(1) : after;
  const det = detectCaseSuffix(rest);
  if (det) {
    const segment =
      PLAYER_PLACEHOLDER + (apostrophe ? apostrophe[0] : "") + det.matched;
    return text.split(segment).join(name + buildCaseSuffix(det.caseId, name));
  }
  return text.split(PLAYER_PLACEHOLDER).join(name);
}
