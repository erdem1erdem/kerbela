let speechTimer: number | null = null;

export function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const trVoice = voices.find((v) =>
    v.lang.toLowerCase().replace("_", "-").startsWith("tr"),
  );
  const utterance = new SpeechSynthesisUtterance(text);
  if (trVoice) utterance.voice = trVoice;
  utterance.lang = "tr-TR";
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  if (speechTimer !== null) window.clearTimeout(speechTimer);
  speechTimer = window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 50);
}

export function stopSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (speechTimer !== null) {
    window.clearTimeout(speechTimer);
    speechTimer = null;
  }
  window.speechSynthesis.cancel();
}
