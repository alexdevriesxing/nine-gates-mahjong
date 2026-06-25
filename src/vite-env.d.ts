/// <reference types="vite/client" />

interface Window {
  render_game_to_text?: () => string;
  advanceTime?: (milliseconds: number) => Promise<void> | void;
}

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_SITE_DOMAIN: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_AD_PLACEHOLDERS: string;
  readonly VITE_ENABLE_MULTIPLAYER: string;
  readonly VITE_ENABLE_MOCK_AUTH: string;
  readonly VITE_ADSTERRA_BANNER_KEY: string;
  readonly VITE_ADSTERRA_NATIVE_KEY: string;
  readonly VITE_ADSTERRA_SOCIAL_BAR_KEY: string;
  readonly VITE_ADSTERRA_INTERSTITIAL_KEY: string;
  readonly VITE_ADSTERRA_SMARTLINK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
