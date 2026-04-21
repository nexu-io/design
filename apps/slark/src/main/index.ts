import { app, shell, BrowserWindow } from "electron";
import { join } from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

const PROTOCOL = "nexu";

app.disableHardwareAcceleration();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [process.argv[1]]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

function getMainWindow(): BrowserWindow | undefined {
  return BrowserWindow.getAllWindows()[0];
}

function handleDeepLink(url: string): void {
  const win = getMainWindow();
  if (!win) return;

  if (win.isMinimized()) win.restore();
  win.focus();

  const parsed = new URL(url);
  if (parsed.hostname === "join" || parsed.pathname.startsWith("/join")) {
    const token =
      parsed.pathname.replace(/^\/?(join\/?)?/, "") || parsed.searchParams.get("token") || "";
    if (token) {
      win.webContents.send("deep-link:join", token);
    }
  }
}

function createWindow(): void {
  const isMac = process.platform === "darwin";

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 14 },
    // On macOS we opt into native sidebar vibrancy so the ActivityBar and any
    // translucent chrome can show real frosted-glass (blurs the desktop behind
    // the window). `visualEffectState: "active"` keeps the blur active even when
    // the window loses focus, matching the look of Slack / Cursor / Finder.
    // Non-mac platforms fall back to a solid light background that matches
    // --color-surface-0 so there's no black flash on startup.
    ...(isMac
      ? { vibrancy: "sidebar" as const, visualEffectState: "active" as const }
      : { backgroundColor: "#fafafa" }),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const deepUrl = argv.find((a) => a.startsWith(`${PROTOCOL}://`));
    if (deepUrl) handleDeepLink(deepUrl);
  });

  app.on("open-url", (_event, url) => {
    handleDeepLink(url);
  });

  app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.nexu.app");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
