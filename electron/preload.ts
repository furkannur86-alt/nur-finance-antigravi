/**
 * Electron Preload Script — Context Bridge
 * Exposes safe IPC APIs to the renderer (Next.js app) via window.nurBridge.
 *
 * The renderer imports this as:
 *   import { nurBridge } from "@/lib/electron/bridge"
 * which feature-detects whether window.nurBridge exists before calling it.
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// ─── Type exposed to renderer ─────────────────────────────────────────────────

export interface NurBridge {
  // Mining
  miningStart:  () => Promise<{ ok: boolean }>;
  miningStop:   () => Promise<{ ok: boolean }>;
  miningStatus: () => Promise<{ active: boolean }>;
  onMiningTick:    (cb: (data: unknown) => void) => () => void;
  onMiningStats:   (cb: (data: unknown) => void) => () => void;
  onMiningStarted: (cb: () => void) => () => void;
  onMiningStopped: (cb: (data: { exitCode: number }) => void) => () => void;
  onMiningError:   (cb: (msg: string) => void) => () => void;

  // Config
  configGet: (key: string) => Promise<string | undefined>;
  configSet: (key: string, value: string) => Promise<{ ok: boolean }>;

  // Native wallet
  walletSave:   (privateKey: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  walletLoad:   (password: string) => Promise<{ ok: boolean; privateKey?: string; error?: string }>;
  walletExists: () => Promise<boolean>;

  // App info
  appVersion:  () => Promise<string>;
  appPlatform: () => Promise<string>;
  gpuInfo:     () => Promise<unknown>;

  // Shell / dialog
  shellOpen:   (url: string) => Promise<void>;
  dialogOpen:  (opts: Record<string, unknown>) => Promise<{ filePaths: string[]; canceled: boolean }>;

  // Updates
  onUpdateAvailable:  (cb: () => void) => () => void;
  onUpdateDownloaded: (cb: () => void) => () => void;
  installUpdate: () => void;

  // Deep links
  onDeepLink: (cb: (url: string) => void) => () => void;
}

// ─── Helper for subscribing to IPC events ─────────────────────────────────────

function on(channel: string, cb: (...args: unknown[]) => void): () => void {
  const handler = (_event: IpcRendererEvent, ...args: unknown[]) => cb(...args);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

// ─── Bridge implementation ────────────────────────────────────────────────────

const bridge: NurBridge = {
  // Mining
  miningStart:  () => ipcRenderer.invoke("mining:start"),
  miningStop:   () => ipcRenderer.invoke("mining:stop"),
  miningStatus: () => ipcRenderer.invoke("mining:status"),
  onMiningTick:    (cb) => on("mining-tick",    cb as (...a: unknown[]) => void),
  onMiningStats:   (cb) => on("mining-stats",   cb as (...a: unknown[]) => void),
  onMiningStarted: (cb) => on("mining-started", () => cb()),
  onMiningStopped: (cb) => on("mining-stopped", (d) => cb(d as { exitCode: number })),
  onMiningError:   (cb) => on("mining-error",   (m) => cb(m as string)),

  // Config
  configGet: (key) => ipcRenderer.invoke("config:get", key),
  configSet: (key, value) => ipcRenderer.invoke("config:set", key, value),

  // Native wallet
  walletSave:   (pk, pw) => ipcRenderer.invoke("wallet:save", pk, pw),
  walletLoad:   (pw)     => ipcRenderer.invoke("wallet:load", pw),
  walletExists: ()       => ipcRenderer.invoke("wallet:exists"),

  // App info
  appVersion:  () => ipcRenderer.invoke("app:version"),
  appPlatform: () => ipcRenderer.invoke("app:platform"),
  gpuInfo:     () => ipcRenderer.invoke("app:gpu-info"),

  // Shell / dialog
  shellOpen:  (url)  => ipcRenderer.invoke("shell:open", url),
  dialogOpen: (opts) => ipcRenderer.invoke("dialog:open", opts),

  // Updates
  onUpdateAvailable:  (cb) => on("update-available",  () => cb()),
  onUpdateDownloaded: (cb) => on("update-downloaded",  () => cb()),
  installUpdate: () => ipcRenderer.send("install-update"),

  // Deep links
  onDeepLink: (cb) => on("deep-link", (url) => cb(url as string)),
};

contextBridge.exposeInMainWorld("nurBridge", bridge);
