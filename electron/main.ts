import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMain } from "electron";
import { getAllMaterials } from "./backend/modules/inventory/inventory";

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
  return getAllMaterials();
});

app.whenReady().then(createWindow);
