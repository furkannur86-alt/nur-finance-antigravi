/**
 * NUR Finance Desktop — Electron Bridge (renderer-side)
 *
 * Safely wraps window.nurBridge (injected by electron/preload.ts).
 * Works in both Electron (desktop) and plain browser — returns no-ops in browser.
 *
 * Usage:
 *   import { isDesktop, nurBridge } from "@/lib/electron/bridge"
 *
 *   if (isDesktop) {
 *     const { active } = await nurBridge.miningStatus()
 *   }
 */

// Type matches electron/preload.ts NurBridge — kept inline to avoid electron module dep
export interface NurBridge {
  miningStart:  () => Promise<{ ok: boolean }>;
  miningStop:   () => Promise<{ ok: boolean }>;
  miningStatus: () => Promise<{ active: boolean }>;
  onMiningTick:    (cb: (data: unknown) => void) => () => void;
  onMiningStats:   (cb: (data: unknown) => void) => () => void;
  onMiningStarted: (cb: () => void) => () => void;
  onMiningStopped: (cb: (data: { exitCode: number }) => void) => () => void;
  onMiningError:   (cb: (msg: string) => void) => () => void;
  configGet: (key: string) => Promise<string | undefined>;
  configSet: (key: string, value: string) => Promise<{ ok: boolean }>;
  walletSave:   (privateKey: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  walletLoad:   (password: string) => Promise<{ ok: boolean; privateKey?: string; error?: string }>;
  walletExists: () => Promise<boolean>;
  appVersion:  () => Promise<string>;
  appPlatform: () => Promise<string>;
  gpuInfo:     () => Promise<unknown>;
  shellOpen:   (url: string) => Promise<void>;
  dialogOpen:  (opts: Record<string, unknown>) => Promise<{ filePaths: string[]; canceled: boolean }>;
  onUpdateAvailable:  (cb: () => void) => () => void;
  onUpdateDownloaded: (cb: () => void) => () => void;
  installUpdate: () => void;
  onDeepLink: (cb: (url: string) => void) => () => void;
}

// ─── Detection ────────────────────────────────────────────────────────────────

export const isDesktop: boolean =
  typeof window !== "undefined" && "nurBridge" in window;

// ─── Bridge accessor ─────────────────────────────────────────────────────────

function getBridge(): NurBridge | null {
  if (typeof window === "undefined") return null;
  return (window as Window & { nurBridge?: NurBridge }).nurBridge ?? null;
}

// ─── No-op stubs for non-Electron environments ───────────────────────────────

const noop = () => () => {};

const STUBS: NurBridge = {
  miningStart:     () => Promise.resolve({ ok: false }),
  miningStop:      () => Promise.resolve({ ok: false }),
  miningStatus:    () => Promise.resolve({ active: false }),
  onMiningTick:    noop,
  onMiningStats:   noop,
  onMiningStarted: noop,
  onMiningStopped: noop,
  onMiningError:   noop,
  configGet:       () => Promise.resolve(undefined),
  configSet:       () => Promise.resolve({ ok: false }),
  walletSave:      () => Promise.resolve({ ok: false, error: "Desktop only" }),
  walletLoad:      () => Promise.resolve({ ok: false, error: "Desktop only" }),
  walletExists:    () => Promise.resolve(false),
  appVersion:      () => Promise.resolve("web"),
  appPlatform:     () => Promise.resolve("web"),
  gpuInfo:         () => Promise.resolve(null),
  shellOpen:       (url) => { window.open(url, "_blank"); return Promise.resolve(); },
  dialogOpen:      () => Promise.resolve({ filePaths: [], canceled: true }),
  onUpdateAvailable:  noop,
  onUpdateDownloaded: noop,
  installUpdate:   () => {},
  onDeepLink:      noop,
};

// ─── Exported bridge (always safe to call) ────────────────────────────────────

export const nurBridge: NurBridge = new Proxy(STUBS, {
  get(_target, prop) {
    const bridge = getBridge();
    if (bridge && prop in bridge) {
      return (bridge as unknown as Record<string, unknown>)[prop as string];
    }
    return (STUBS as unknown as Record<string, unknown>)[prop as string];
  },
});
