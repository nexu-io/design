import { app, shell, BrowserWindow, nativeTheme } from "electron";
import { join } from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

const PROTOCOL = "nexu";

app.disableHardwareAcceleration();

// Lock the app's effective NSAppearance to light so macOS `sidebar` vibrancy
// always renders as light frosted glass, regardless of the user's system-wide
// dark/light setting. Without this, a user on macOS Dark Mode would see a
// dark tinted vibrancy under the ActivityBar while our HTML paints light
// content on the right, producing a split-mode look.
nativeTheme.themeSource = "light";

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
    /* `minWidth: 520` lets the user drag the window narrow enough
       to trigger the Sidebar auto-collapse in the renderer layout
       store (`MAIN_MIN_WIDTH + SIDEBAR_MIN_WIDTH = 740` on the
       base plate, which hits ~820 window width after accounting
       for the ActivityBar rail). A stricter `960` min that was
       here previously prevented the collapse from ever firing on
       narrow windows — so from the user's perspective the Feishu-
       style auto-hide looked unimplemented. */
    minWidth: 520,
    minHeight: 520,
    backgroundColor: isMac ? "#00000000" : "#fafafa",
    show: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 8, y: 14 },
    // On macOS we opt into native sidebar vibrancy so the ActivityBar and any
    // translucent chrome can show real frosted-glass (blurs the desktop behind
    // the window). `visualEffectState: "active"` keeps the blur active even when
    // the window loses focus, matching the look of Slack / Cursor / Finder.
    // Non-mac platforms fall back to a solid light background that matches
    // --color-surface-0 so there's no black flash on startup.
    ...(isMac
      ? {
          transparent: true,
          vibrancy: "sidebar" as const,
          visualEffectState: "followWindow" as const,
        }
      : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  // Belt-and-braces: call `setMinimumSize` after construction. In
  // practice the `minWidth/minHeight` on the BrowserWindow options
  // already establishes the floor, but we've seen cases on macOS
  // where a cached window-state (from a previous build that shipped
  // a larger `minWidth: 960`) bleeds through a hot-restart and keeps
  // the OS-level constraint at the old value. Re-applying it
  // imperatively guarantees the user can drag the window narrow
  // enough to exercise the Sidebar auto-collapse threshold.
  mainWindow.setMinimumSize(520, 520);

  if (isMac) {
    mainWindow.setBackgroundColor("#00000000");
    mainWindow.setVibrancy("sidebar");

    /* ────────────────────────────────────────────────────────────
       Mitigate the macOS transparent-window resize lag.

       Symptom: during a native window-edge drag, the HTML layer
       (base plate + floating island) visibly trails the native
       sidebar vibrancy by several frames — a strip of frosted
       vibrancy shows between the island's stale right edge and
       the window's fresh right edge, reading as "the floating
       island can't keep up with the frame".

       Root cause: Chromium's compositor throttles painting of
       alpha-composited (transparent) windows during live native
       resizes. The vibrancy is an NSVisualEffectView owned by
       the OS, so it repaints independently and instantly.

       There's no way to structurally fix this without giving up
       either transparency (kills vibrancy) or floating chrome.
       But Chromium exposes `webContents.invalidate()` which
       schedules a full repaint on the next frame. Calling it on
       every `will-resize` tick — which fires synchronously for
       each incremental size the window is about to take during
       the drag — forces Chromium to try to keep up instead of
       coalescing paints. In practice on Electron ≥ 28 this
       reduces the visible trailing gap from ~100–200px to a
       single-frame flicker.

       Guard: only attach on macOS, since this is purely a macOS
       vibrancy-driven compositor quirk and Windows/Linux
       transparent windows don't exhibit the same lag.
       ──────────────────────────────────────────────────────────── */
    mainWindow.on("will-resize", () => {
      mainWindow.webContents.invalidate();
    });
  }

  mainWindow.on("ready-to-show", () => {
    if (isMac) {
      mainWindow.setBackgroundColor("#00000000");
      mainWindow.setVibrancy("sidebar");
    }

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
