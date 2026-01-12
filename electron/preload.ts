import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  inventory: {
    getAll: () => ipcRenderer.invoke("inventory:getAll"),
  },
});
