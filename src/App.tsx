import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './app/context/AuthContext';
import { AdProvider } from './app/context/AdContext';
import { LocaleProvider } from './app/context/LocaleContext';
import Layout from './app/components/Layout';
import LoadingSpinner from './app/components/LoadingSpinner';

// =====================================================
// Lazy-loaded Pages — Code-split for performance
// =====================================================
const HomePage = lazy(() => import('./app/pages/HomePage'));
const PlayHub = lazy(() => import('./app/pages/PlayHub'));
const DailyPuzzlePage = lazy(() => import('./app/pages/DailyPuzzlePage'));
const VariantsHub = lazy(() => import('./app/pages/VariantsHub'));
const LearnHub = lazy(() => import('./app/pages/LearnHub'));
const LobbyPage = lazy(() => import('./app/pages/LobbyPage'));
const LeaderboardsPage = lazy(() => import('./app/pages/LeaderboardsPage'));
const ProfilePage = lazy(() => import('./app/pages/ProfilePage'));
const LoginPage = lazy(() => import('./app/pages/LoginPage'));
const RegisterPage = lazy(() => import('./app/pages/RegisterPage'));
const GuestPage = lazy(() => import('./app/pages/GuestPage'));
const SolitairePage = lazy(() => import('./app/pages/SolitairePage'));
const ZenMahjonggPage = lazy(() => import('./app/pages/ZenMahjonggPage'));
const TimeAttackPage = lazy(() => import('./app/pages/TimeAttackPage'));
const MahjongConnectPage = lazy(() => import('./app/pages/MahjongConnectPage'));
const ShisenShoPage = lazy(() => import('./app/pages/ShisenShoPage'));
const MahjonggMemoryPage = lazy(() => import('./app/pages/MahjonggMemoryPage'));
const RealMahjongPage = lazy(() => import('./app/pages/RealMahjongPage'));
const HongKongPage = lazy(() => import('./app/pages/variants/HongKongPage'));
const RiichiPage = lazy(() => import('./app/pages/variants/RiichiPage'));
const MCRPage = lazy(() => import('./app/pages/variants/MCRPage'));
const AmericanPage = lazy(() => import('./app/pages/variants/AmericanPage'));
const TaiwanesePage = lazy(() => import('./app/pages/variants/TaiwanesePage'));
const SichuanPage = lazy(() => import('./app/pages/variants/SichuanPage'));
const ZungJungPage = lazy(() => import('./app/pages/variants/ZungJungPage'));
const MahjongVsMahjongg = lazy(() => import('./app/pages/learn/MahjongVsMahjongg'));
const HowToPlaySolitaire = lazy(() => import('./app/pages/learn/HowToPlaySolitaire'));
const HowToPlayRealMahjong = lazy(() => import('./app/pages/learn/HowToPlayRealMahjong'));
const ChiPungKong = lazy(() => import('./app/pages/learn/ChiPungKong'));
const BeginnerStrategy = lazy(() => import('./app/pages/learn/BeginnerStrategy'));
const MahjongVariantsGuide = lazy(() => import('./app/pages/learn/MahjongVariantsGuide'));
const PrivacyPage = lazy(() => import('./app/pages/PrivacyPage'));
const TermsPage = lazy(() => import('./app/pages/TermsPage'));
const EventsPage = lazy(() => import('./app/pages/EventsPage'));
const TutorialsPage = lazy(() => import('./app/pages/TutorialsPage'));
const HistoryPage = lazy(() => import('./app/pages/HistoryPage'));
const NotFoundPage = lazy(() => import('./app/pages/NotFoundPage'));

// =====================================================
// Suspense wrapper for lazy pages
// =====================================================
function SuspensePage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

// =====================================================
// Scroll to Top on route change
// =====================================================
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// =====================================================
// App — Root component with routing, auth, and providers
// =====================================================
export default function App() {
  return (
    <HelmetProvider>
      <AdProvider>
        <LocaleProvider>
          <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route element={<Layout />}>
              {/* Homepage */}
              <Route path="/" element={<SuspensePage><HomePage /></SuspensePage>} />

              {/* Game Modes */}
              <Route path="/play" element={<SuspensePage><PlayHub /></SuspensePage>} />
              <Route path="/mahjongg-solitaire" element={<SuspensePage><SolitairePage /></SuspensePage>} />
              <Route path="/daily" element={<SuspensePage><DailyPuzzlePage /></SuspensePage>} />
              <Route path="/zen-mahjongg" element={<SuspensePage><ZenMahjonggPage /></SuspensePage>} />
              <Route path="/time-attack" element={<SuspensePage><TimeAttackPage /></SuspensePage>} />
              <Route path="/mahjong-connect" element={<SuspensePage><MahjongConnectPage /></SuspensePage>} />
              <Route path="/shisen-sho" element={<SuspensePage><ShisenShoPage /></SuspensePage>} />
              <Route path="/mahjongg-memory" element={<SuspensePage><MahjonggMemoryPage /></SuspensePage>} />

              {/* Real Mahjong */}
              <Route path="/real-mahjong" element={<SuspensePage><RealMahjongPage /></SuspensePage>} />
              <Route path="/real-mahjong/hong-kong" element={<SuspensePage><HongKongPage /></SuspensePage>} />
              <Route path="/real-mahjong/riichi" element={<SuspensePage><RiichiPage /></SuspensePage>} />
              <Route path="/real-mahjong/mcr" element={<SuspensePage><MCRPage /></SuspensePage>} />
              <Route path="/real-mahjong/american" element={<SuspensePage><AmericanPage /></SuspensePage>} />
              <Route path="/real-mahjong/taiwanese" element={<SuspensePage><TaiwanesePage /></SuspensePage>} />
              <Route path="/real-mahjong/sichuan" element={<SuspensePage><SichuanPage /></SuspensePage>} />
              <Route path="/real-mahjong/zung-jung" element={<SuspensePage><ZungJungPage /></SuspensePage>} />

              {/* Variants Hub */}
              <Route path="/variants" element={<SuspensePage><VariantsHub /></SuspensePage>} />

              {/* Learning Hub */}
              <Route path="/learn" element={<SuspensePage><LearnHub /></SuspensePage>} />
              <Route path="/learn/mahjong-vs-mahjongg" element={<SuspensePage><MahjongVsMahjongg /></SuspensePage>} />
              <Route path="/learn/how-to-play-mahjongg-solitaire" element={<SuspensePage><HowToPlaySolitaire /></SuspensePage>} />
              <Route path="/learn/how-to-play-real-mahjong" element={<SuspensePage><HowToPlayRealMahjong /></SuspensePage>} />
              <Route path="/learn/chi-pung-kong" element={<SuspensePage><ChiPungKong /></SuspensePage>} />
              <Route path="/learn/beginner-strategy" element={<SuspensePage><BeginnerStrategy /></SuspensePage>} />
              <Route path="/learn/mahjong-variants" element={<SuspensePage><MahjongVariantsGuide /></SuspensePage>} />

              {/* Community */}
              <Route path="/lobby" element={<SuspensePage><LobbyPage /></SuspensePage>} />
              <Route path="/leaderboards" element={<SuspensePage><LeaderboardsPage /></SuspensePage>} />
              <Route path="/events" element={<SuspensePage><EventsPage /></SuspensePage>} />
              <Route path="/how-to-play" element={<SuspensePage><TutorialsPage /></SuspensePage>} />
              <Route path="/history" element={<SuspensePage><HistoryPage /></SuspensePage>} />

              {/* Account */}
              <Route path="/profile" element={<SuspensePage><ProfilePage /></SuspensePage>} />
              <Route path="/login" element={<SuspensePage><LoginPage /></SuspensePage>} />
              <Route path="/register" element={<SuspensePage><RegisterPage /></SuspensePage>} />
              <Route path="/guest" element={<SuspensePage><GuestPage /></SuspensePage>} />

              {/* Legal */}
              <Route path="/privacy" element={<SuspensePage><PrivacyPage /></SuspensePage>} />
              <Route path="/terms" element={<SuspensePage><TermsPage /></SuspensePage>} />
              <Route path="*" element={<SuspensePage><NotFoundPage /></SuspensePage>} />
            </Route>
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </LocaleProvider>
      </AdProvider>
    </HelmetProvider>
  );
}
