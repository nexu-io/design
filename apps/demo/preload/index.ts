import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openExternal(url: string) {
    return ipcRenderer.invoke("external:open", url);
  },
});
