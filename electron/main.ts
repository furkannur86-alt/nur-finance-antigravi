/**
 * NUR Finance Desktop — Electron Main Process
 *
 * Responsibilities:
 *   - Create BrowserWindow serving the Next.js app (http://localhost:3000)
 *   - Native system tray integration with quick-launch menu
 *   - IPC bridge for GPU mining worker ↔ renderer
 *   - Native wallet keystore access (AES-256-GCM encrypted, stored in userData)
 *   - Auto-updater (GitHub releases)
 *   - Deep-link protocol handler: nurfin://
 *
 * Build: npx electron-builder --config electron-builder.config.js
 * Dev:   ELECTRON_DEV=1 npx electron electron/main.ts
 *
 * Required packages (add to devDependencies):
 *   electron, electron-builder, electron-updater
 *   @electron/remote (optional, for legacy renderer access)
 */

import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  shell,
  dialog,
  powerSaveBlocker,
  session,
  protocol,
} from "electron";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";
import { fork, ChildProcess } from "child_process";
import { autoUpdater } from "electron-updater";

// ─── Constants ────────────────────────────────────────────────────────────────

const IS_DEV    = process.env.ELECTRON_DEV === "1" || !app.isPackaged;
const APP_URL   = IS_DEV ? "http://localhost:3000" : "https://nur.finance";
const ICON_PATH = join(__dirname, "../public/images/icon.png");
const PROTOCOL  = "nurfin";

// ─── State ────────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let miningWorker: ChildProcess | null = null;
let powerBlockerId: number | null = null;
let miningActive = false;

// ─── Single-instance lock ─────────────────────────────────────────────────────

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

app.on("second-instance", (_event, argv) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  // Handle deep-link from second instance
  const deepLink = argv.find(a => a.startsWith(`${PROTOCOL}://`));
  if (deepLink && mainWindow) {
    mainWindow.webContents.send("deep-link", deepLink);
  }
});

// ─── Protocol registration ────────────────────────────────────────────────────

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [process.argv[1]]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

// ─── App metadata ─────────────────────────────────────────────────────────────

app.setName("NUR Finance");
app.setAppUserModelId("finance.nur.desktop");

// ─── Window factory ───────────────────────────────────────────────────────────

function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width:          1440,
    height:         900,
    minWidth:       1024,
    minHeight:      640,
    backgroundColor: "#0a0c10",
    icon:           existsSync(ICON_PATH) ? ICON_PATH : undefined,
    titleBarStyle:  process.platform === "darwin" ? "hiddenInset" : "default",
    title:          "NUR Finance Terminal",
    webPreferences: {
      preload:            join(__dirname, "preload.js"),
      contextIsolation:   true,
      nodeIntegration:    false,
      webSecurity:        !IS_DEV,
      allowRunningInsecureContent: IS_DEV,
    },
    show: false,  // show after ready-to-show to prevent flash
  });

  win.once("ready-to-show", () => {
    win.show();
    if (IS_DEV) win.webContents.openDevTools({ mode: "detach" });
  });

  win.loadURL(APP_URL).catch(err => {
    console.error("[MAIN] Failed to load URL:", err.message);
    // Retry once after 2s
    setTimeout(() => win.loadURL(APP_URL).catch(console.error), 2000);
  });

  win.on("close", (e) => {
    // Minimize to tray on close (keep miner running)
    if (miningActive && process.platform !== "darwin") {
      e.preventDefault();
      win.hide();
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  return win;
}

// ─── System Tray ─────────────────────────────────────────────────────────────

function createTray(): Tray {
  const icon = existsSync(ICON_PATH)
    ? nativeImage.createFromPath(ICON_PATH).resize({ width: 16, height: 16 })
    : nativeImage.createEmpty();

  const t = new Tray(icon);
  t.setToolTip("NUR Finance Terminal");
  updateTrayMenu(t);
  t.on("click", () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
  return t;
}

function updateTrayMenu(t: Tray) {
  const menu = Menu.buildFromTemplate([
    { label: "NUR Finance Terminal", enabled: false },
    { type: "separator" },
    {
      label: "Open Terminal",
      click: () => { mainWindow?.show(); mainWindow?.focus(); },
    },
    { type: "separator" },
    {
      label: miningActive ? "⛏ Mining: ON  (click to stop)" : "⛏ Mining: OFF (click to start)",
      click: () => {
        miningActive ? stopMining() : startMining();
        updateTrayMenu(t);
      },
    },
    { type: "separator" },
    {
      label: "NUR Finance Website",
      click: () => shell.openExternal("https://nur.finance"),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => { miningActive && stopMining(); app.quit(); },
    },
  ]);
  t.setContextMenu(menu);
}

// ─── GPU Mining Worker ────────────────────────────────────────────────────────

function startMining() {
  if (miningWorker) return;

  const workerPath = join(__dirname, "gpu-worker.js");
  if (!existsSync(workerPath)) {
    console.warn("[MAIN] gpu-worker.js not found — mining unavailable");
    mainWindow?.webContents.send("mining-error", "GPU worker not compiled");
    return;
  }

  miningWorker = fork(workerPath, [], {
    env: {
      ...process.env,
      MINING_USER_ID:      loadConfig("userId") ?? "",
      MINING_WALLET_ADDR:  loadConfig("walletAddress") ?? "",
      NUR_POOL_URL:        "https://nur.finance/api/mining/pool",
    },
    silent: false,
  });

  miningWorker.on("message", (msg: unknown) => {
    const data = msg as Record<string, unknown>;
    if (data.type === "tick") {
      mainWindow?.webContents.send("mining-tick", data);
    } else if (data.type === "stats") {
      mainWindow?.webContents.send("mining-stats", data);
    }
  });

  miningWorker.on("exit", (code) => {
    console.log("[MAIN] Mining worker exited with code", code);
    miningWorker = null;
    miningActive = false;
    mainWindow?.webContents.send("mining-stopped", { exitCode: code });
    if (tray) updateTrayMenu(tray);
    // Release power-save blocker
    if (powerBlockerId !== null) {
      powerSaveBlocker.stop(powerBlockerId);
      powerBlockerId = null;
    }
  });

  miningWorker.on("error", (err) => {
    console.error("[MAIN] Mining worker error:", err.message);
    mainWindow?.webContents.send("mining-error", err.message);
  });

  // Prevent system sleep while mining
  powerBlockerId = powerSaveBlocker.start("prevent-app-suspension");

  miningActive = true;
  mainWindow?.webContents.send("mining-started", {});
  console.log("[MAIN] GPU mining worker started");
}

function stopMining() {
  if (miningWorker) {
    miningWorker.send({ type: "stop" });
    setTimeout(() => {
      miningWorker?.kill();
      miningWorker = null;
    }, 3000);
  }
  miningActive = false;
  if (powerBlockerId !== null) {
    powerSaveBlocker.stop(powerBlockerId);
    powerBlockerId = null;
  }
  mainWindow?.webContents.send("mining-stopped", { exitCode: 0 });
  if (tray) updateTrayMenu(tray);
  console.log("[MAIN] GPU mining worker stopped");
}

// ─── Native Wallet (AES-256-GCM encrypted keystore) ──────────────────────────

const KEYSTORE_PATH = join(app.getPath("userData"), "keystore.enc");

function encryptWallet(privateKey: string, password: string): Buffer {
  const salt = randomBytes(16);
  const key  = createHash("sha256").update(password + salt.toString("hex")).digest();
  const iv   = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(privateKey, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Format: salt(16) + iv(12) + tag(16) + ciphertext
  return Buffer.concat([salt, iv, tag, encrypted]);
}

function decryptWallet(data: Buffer, password: string): string {
  const salt      = data.subarray(0, 16);
  const iv        = data.subarray(16, 28);
  const tag       = data.subarray(28, 44);
  const encrypted = data.subarray(44);
  const key = createHash("sha256").update(password + salt.toString("hex")).digest();
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

// ─── User Config ─────────────────────────────────────────────────────────────

const CONFIG_PATH = join(app.getPath("userData"), "nur-config.json");
let _config: Record<string, string> = {};

function loadConfig(key: string): string | undefined {
  if (Object.keys(_config).length === 0 && existsSync(CONFIG_PATH)) {
    try { _config = JSON.parse(readFileSync(CONFIG_PATH, "utf8")); } catch { /* noop */ }
  }
  return _config[key];
}

function saveConfig(key: string, value: string) {
  _config[key] = value;
  mkdirSync(join(app.getPath("userData")), { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(_config, null, 2));
}

// ─── IPC handlers ────────────────────────────────────────────────────────────

function setupIpc() {
  // Mining control
  ipcMain.handle("mining:start", () => { startMining(); return { ok: true }; });
  ipcMain.handle("mining:stop",  () => { stopMining();  return { ok: true }; });
  ipcMain.handle("mining:status", () => ({ active: miningActive }));

  // Config
  ipcMain.handle("config:get", (_e, key: string) => loadConfig(key));
  ipcMain.handle("config:set", (_e, key: string, value: string) => {
    saveConfig(key, value);
    return { ok: true };
  });

  // Native wallet
  ipcMain.handle("wallet:save", async (_e, privateKey: string, password: string) => {
    try {
      const encrypted = encryptWallet(privateKey, password);
      writeFileSync(KEYSTORE_PATH, encrypted);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  });

  ipcMain.handle("wallet:load", async (_e, password: string) => {
    try {
      if (!existsSync(KEYSTORE_PATH)) return { ok: false, error: "No keystore found" };
      const data = readFileSync(KEYSTORE_PATH);
      const privateKey = decryptWallet(data, password);
      return { ok: true, privateKey };
    } catch {
      return { ok: false, error: "Wrong password or corrupted keystore" };
    }
  });

  ipcMain.handle("wallet:exists", () => existsSync(KEYSTORE_PATH));

  // App info
  ipcMain.handle("app:version", () => app.getVersion());
  ipcMain.handle("app:platform", () => process.platform);
  ipcMain.handle("app:gpu-info", async () => {
    const info = await app.getGPUInfo("complete").catch(() => ({}));
    return info;
  });

  // Open external link
  ipcMain.handle("shell:open", (_e, url: string) => shell.openExternal(url));

  // File dialog
  ipcMain.handle("dialog:open", async (_e, opts: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(mainWindow!, opts);
    return result;
  });
}

// ─── Auto-updater ─────────────────────────────────────────────────────────────

function setupAutoUpdater() {
  if (IS_DEV) return;

  autoUpdater.checkForUpdatesAndNotify().catch(console.error);

  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send("update-available");
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send("update-downloaded");
    // IPC from renderer can trigger install
    ipcMain.once("install-update", () => autoUpdater.quitAndInstall());
  });
}

// ─── CSP ──────────────────────────────────────────────────────────────────────

function setupCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' https://nur.finance https://*.nur.finance;",
          "script-src 'self' 'unsafe-inline' https://nur.finance;",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          "font-src 'self' https://fonts.gstatic.com;",
          "img-src 'self' data: https:;",
          "connect-src 'self' https://nur.finance https://*.nur.finance wss://nur.finance;",
        ].join(" "),
      },
    });
  });
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  // Register file protocol for local assets in production
  if (!IS_DEV) {
    protocol.registerFileProtocol("nur-asset", (request, callback) => {
      const filePath = join(app.getAppPath(), request.url.replace("nur-asset://", ""));
      callback({ path: filePath });
    });
  }

  setupCSP();
  setupIpc();
  setupAutoUpdater();

  mainWindow = createMainWindow();
  tray = createTray();

  // Handle macOS re-activate
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    } else {
      mainWindow?.show();
    }
  });

  // Handle deep-links on macOS
  app.on("open-url", (_event, url) => {
    mainWindow?.webContents.send("deep-link", url);
  });

  console.log("[MAIN] NUR Finance Desktop started");
  console.log(`[MAIN] Environment: ${IS_DEV ? "development" : "production"}`);
  console.log(`[MAIN] App URL: ${APP_URL}`);
  console.log(`[MAIN] userData: ${app.getPath("userData")}`);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (miningActive) stopMining();
    app.quit();
  }
});

app.on("before-quit", () => {
  if (miningActive) stopMining();
});
