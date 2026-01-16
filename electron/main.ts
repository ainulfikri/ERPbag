import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMain } from "electron";
import * as inventory from "./backend/modules/inventory/inventory";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173"); // Vite default
}

ipcMain.handle("inventory:getAll", () => {
  return inventory.getAllMaterials();
});

ipcMain.handle("inventory:add", (_event, material) => {
  return inventory.addMaterial(material);
});

app.whenReady().then(createWindow);
