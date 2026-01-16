import { contextBridge, ipcRenderer } from "electron";
import type { NewMaterial } from "./backend/modules/inventory/inventory";

contextBridge.exposeInMainWorld("api", {
  inventory: {
    getAll: () => ipcRenderer.invoke("inventory:getAll"),
    add: (material: NewMaterial) =>
      ipcRenderer.invoke("inventory:add", material),
  },
});
