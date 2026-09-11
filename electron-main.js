const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,
    minWidth: 1280,
    minHeight: 800,
    title: "NUR Finance Bloomberg & Reuters Desktop Terminal",
    icon: path.join(__dirname, "public/favicon.ico"),
    backgroundColor: "#0a0e17",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    autoHideMenuBar: true,
    frame: true,
  });

  const { spawn } = require("child_process");

  // Ensure Next.js dev server is spawned if not running
  const startUrl = "http://localhost:3000";

  mainWindow.loadURL(startUrl).catch(() => {
    // If server wasn't ready yet, retry in 2 seconds
    setTimeout(() => {
      mainWindow.loadURL(startUrl);
    }, 2000);
  });

  // Auto-maximize for institutional Bloomberg layout
  mainWindow.maximize();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  // Global shortcut F11 for borderless full-screen Bloomberg experience
  globalShortcut.register("F11", () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  Menu.setApplicationMenu(null);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
