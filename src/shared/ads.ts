export const ADSTERRA_PLACEMENTS = {
  '320x50': {
    key: 'cdc33de3506804ba73d2d3661ed4fd0a',
    width: 320,
    height: 50,
  },
  '468x60': {
    key: '3d687f838f7b1a2353a56d39e059e906',
    width: 468,
    height: 60,
  },
  '728x90': {
    key: '759777117285af8156ae217ed7fc2a0b',
    width: 728,
    height: 90,
  },
  '300x250': {
    key: '933dafe9ee5494fdc3ed74bb4ad047a6',
    width: 300,
    height: 250,
  },
  '160x300': {
    key: '4492bd5c94522d00777227f98028a4c4',
    width: 160,
    height: 300,
  },
  '160x600': {
    key: 'f2411eb715b2fe1af0fafb73c5825345',
    width: 160,
    height: 600,
  },
} as const;

export type AdsterraPlacementId = keyof typeof ADSTERRA_PLACEMENTS;

export const ADSTERRA_NATIVE = {
  containerId: 'container-c9947e22755623a8fe8d556aa1ba06d5',
  scriptUrl: 'https://pl29884536.effectivecpmnetwork.com/c9947e22755623a8fe8d556aa1ba06d5/invoke.js',
} as const;

export const ADSTERRA_SOCIAL_BAR_URL =
  'https://pl29884537.effectivecpmnetwork.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js';

export const ADSTERRA_PRECONNECT_ORIGINS = [
  'https://www.highperformanceformat.com',
  'https://pl29884536.effectivecpmnetwork.com',
  'https://pl29884537.effectivecpmnetwork.com',
] as const;

export function adsterraPlacementId(width: number, height: number): AdsterraPlacementId | null {
  const id = `${width}x${height}` as AdsterraPlacementId;
  return ADSTERRA_PLACEMENTS[id]?.width === width && ADSTERRA_PLACEMENTS[id]?.height === height
    ? id
    : null;
}

export function isAdsterraPlacementId(value: string): value is AdsterraPlacementId {
  return Object.prototype.hasOwnProperty.call(ADSTERRA_PLACEMENTS, value);
}
