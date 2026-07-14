import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const LANGUAGES = [
  ['en', 'English'],
  ['nl', 'Nederlands'],
  ['de', 'Deutsch'],
  ['fr', 'Français'],
  ['es', 'Español'],
  ['it', 'Italiano'],
  ['pt', 'Português'],
  ['pl', 'Polski'],
  ['tr', 'Türkçe'],
  ['ar', 'العربية'],
  ['he', 'עברית'],
  ['hi', 'हिन्दी'],
  ['zh', '中文'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['id', 'Bahasa Indonesia'],
  ['vi', 'Tiếng Việt'],
  ['th', 'ไทย'],
] as const;

type LanguageCode = (typeof LANGUAGES)[number][0];

const COPY: Record<LanguageCode, Record<string, string>> = {
  en: { play: 'Play', daily: 'Daily', variants: 'Variants', learn: 'Learn', tutorials: 'How to play', history: 'History', events: 'Events', lobby: 'Lobby', rankings: 'Rankings', playFree: 'Play Free', login: 'Login', language: 'Interface language' },
  nl: { play: 'Spelen', daily: 'Dagelijks', variants: 'Varianten', learn: 'Leren', tutorials: 'Speluitleg', history: 'Geschiedenis', events: 'Evenementen', lobby: 'Lobby', rankings: 'Ranglijst', playFree: 'Gratis spelen', login: 'Inloggen', language: 'Interfacetaal' },
  de: { play: 'Spielen', daily: 'Täglich', variants: 'Varianten', learn: 'Lernen', tutorials: 'Spielanleitung', history: 'Geschichte', events: 'Events', lobby: 'Lobby', rankings: 'Rangliste', playFree: 'Kostenlos spielen', login: 'Anmelden', language: 'Oberflächensprache' },
  fr: { play: 'Jouer', daily: 'Quotidien', variants: 'Variantes', learn: 'Apprendre', tutorials: 'Comment jouer', history: 'Histoire', events: 'Événements', lobby: 'Salon', rankings: 'Classement', playFree: 'Jouer gratuitement', login: 'Connexion', language: "Langue de l’interface" },
  es: { play: 'Jugar', daily: 'Diario', variants: 'Variantes', learn: 'Aprender', tutorials: 'Cómo jugar', history: 'Historia', events: 'Eventos', lobby: 'Sala', rankings: 'Clasificación', playFree: 'Jugar gratis', login: 'Iniciar sesión', language: 'Idioma de la interfaz' },
  it: { play: 'Gioca', daily: 'Giornaliero', variants: 'Varianti', learn: 'Impara', tutorials: 'Come giocare', history: 'Storia', events: 'Eventi', lobby: 'Lobby', rankings: 'Classifica', playFree: 'Gioca gratis', login: 'Accedi', language: "Lingua dell’interfaccia" },
  pt: { play: 'Jogar', daily: 'Diário', variants: 'Variantes', learn: 'Aprender', tutorials: 'Como jogar', history: 'História', events: 'Eventos', lobby: 'Sala', rankings: 'Ranking', playFree: 'Jogar grátis', login: 'Entrar', language: 'Idioma da interface' },
  pl: { play: 'Graj', daily: 'Codziennie', variants: 'Odmiany', learn: 'Nauka', tutorials: 'Jak grać', history: 'Historia', events: 'Wydarzenia', lobby: 'Lobby', rankings: 'Ranking', playFree: 'Graj za darmo', login: 'Zaloguj', language: 'Język interfejsu' },
  tr: { play: 'Oyna', daily: 'Günlük', variants: 'Varyantlar', learn: 'Öğren', tutorials: 'Nasıl oynanır', history: 'Tarih', events: 'Etkinlikler', lobby: 'Lobi', rankings: 'Sıralama', playFree: 'Ücretsiz oyna', login: 'Giriş', language: 'Arayüz dili' },
  ar: { play: 'العب', daily: 'اليومي', variants: 'الأنواع', learn: 'تعلّم', tutorials: 'كيفية اللعب', history: 'التاريخ', events: 'الفعاليات', lobby: 'الردهة', rankings: 'التصنيف', playFree: 'العب مجانًا', login: 'تسجيل الدخول', language: 'لغة الواجهة' },
  he: { play: 'שחק', daily: 'יומי', variants: 'גרסאות', learn: 'למד', tutorials: 'איך משחקים', history: 'היסטוריה', events: 'אירועים', lobby: 'לובי', rankings: 'דירוג', playFree: 'שחק בחינם', login: 'כניסה', language: 'שפת הממשק' },
  hi: { play: 'खेलें', daily: 'दैनिक', variants: 'प्रकार', learn: 'सीखें', tutorials: 'कैसे खेलें', history: 'इतिहास', events: 'आयोजन', lobby: 'लॉबी', rankings: 'रैंकिंग', playFree: 'मुफ़्त खेलें', login: 'लॉग इन', language: 'इंटरफ़ेस भाषा' },
  zh: { play: '开始游戏', daily: '每日挑战', variants: '玩法', learn: '学习', tutorials: '玩法教程', history: '麻将历史', events: '赛事', lobby: '大厅', rankings: '排行榜', playFree: '免费游戏', login: '登录', language: '界面语言' },
  ja: { play: 'プレイ', daily: 'デイリー', variants: 'ルール', learn: '学ぶ', tutorials: '遊び方', history: '歴史', events: 'イベント', lobby: 'ロビー', rankings: 'ランキング', playFree: '無料でプレイ', login: 'ログイン', language: 'インターフェース言語' },
  ko: { play: '플레이', daily: '일일', variants: '변형', learn: '배우기', tutorials: '게임 방법', history: '역사', events: '이벤트', lobby: '로비', rankings: '랭킹', playFree: '무료 플레이', login: '로그인', language: '인터페이스 언어' },
  id: { play: 'Main', daily: 'Harian', variants: 'Varian', learn: 'Belajar', tutorials: 'Cara bermain', history: 'Sejarah', events: 'Acara', lobby: 'Lobi', rankings: 'Peringkat', playFree: 'Main gratis', login: 'Masuk', language: 'Bahasa antarmuka' },
  vi: { play: 'Chơi', daily: 'Hằng ngày', variants: 'Biến thể', learn: 'Học', tutorials: 'Cách chơi', history: 'Lịch sử', events: 'Sự kiện', lobby: 'Sảnh', rankings: 'Xếp hạng', playFree: 'Chơi miễn phí', login: 'Đăng nhập', language: 'Ngôn ngữ giao diện' },
  th: { play: 'เล่น', daily: 'รายวัน', variants: 'รูปแบบ', learn: 'เรียนรู้', tutorials: 'วิธีเล่น', history: 'ประวัติ', events: 'กิจกรรม', lobby: 'ล็อบบี้', rankings: 'อันดับ', playFree: 'เล่นฟรี', login: 'เข้าสู่ระบบ', language: 'ภาษาอินเทอร์เฟซ' },
};

interface LocaleValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('ngm_language') as LanguageCode | null;
    return saved && COPY[saved] ? saved : 'en';
  });

  useEffect(() => {
    // Only navigation labels are localized today. Keep the document language truthful
    // until complete translated routes and metadata are available.
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.documentElement.dataset.uiLanguage = language;
  }, [language]);

  const value = useMemo<LocaleValue>(() => ({
    language,
    setLanguage: (next) => {
      setLanguageState(next);
      localStorage.setItem('ngm_language', next);
    },
    t: (key) => COPY[language]?.[key] ?? COPY.en[key] ?? key,
  }), [language]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}
