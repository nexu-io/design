import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BrowserWindow, app, ipcMain, nativeTheme, shell } from "electron";
import type { IpcMainInvokeEvent } from "electron";

const __dirname = dirname(fileURLToPath(import.meta.url));

nativeTheme.themeSource = "light";
const devServerUrl = process.env.VITE_DEV_SERVER_URL;

function createMainWindow() {
  const isMacOS = process.platform === "darwin";

  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: isMacOS ? "#00000000" : "#fafafa",
    show: false,
    autoHideMenuBar: true,
    title: "Nexu Demo",
    ...(isMacOS
      ? {
          transparent: true,
          vibrancy: "sidebar" as const,
          visualEffectState: "followWindow" as const,
          titleBarStyle: "hiddenInset" as const,
          trafficLightPosition: { x: 16, y: 16 },
        }
      : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isMacOS) {
    window.setBackgroundColor("#00000000");
    window.setVibrancy("sidebar");
  }

  window.once("ready-to-show", () => {
    if (isMacOS) {
      window.setBackgroundColor("#00000000");
      window.setVibrancy("sidebar");
    }

    window.show();
  });

  window.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  if (devServerUrl) {
    void window.loadURL(devServerUrl);
    window.webContents.openDevTools({ mode: "detach" });
    return window;
  }

  void window.loadFile(join(__dirname, "../../dist/index.html"));
  return window;
}

ipcMain.handle("external:open", (_event: IpcMainInvokeEvent, url: string) => {
  return shell.openExternal(url);
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
