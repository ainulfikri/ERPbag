import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import * as inventory from "./backend/modules/inventory/inventory";
import * as tailor from "./backend/modules/tailor/tailor";
import * as production from "./backend/modules/production/production";
import * as product from "./backend/modules/product/product";
import * as sales from "./backend/modules/sales/sales";
import * as analytics from "./backend/modules/analytics/analytics";
import * as accounting from "./backend/modules/accounting/accounting";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadURL("http://localhost:5173"); // Fallback for local dev
  }
}

// IPC Registration
function registerIpcHandlers() {
  // Inventory
  ipcMain.handle("inventory:getAll", () => inventory.getAllMaterials());
  ipcMain.handle("inventory:add", (_event, material) => inventory.addMaterial(material));
  ipcMain.handle("inventory:update", (_event, { id, data }) => inventory.updateMaterial(id, data));
  ipcMain.handle("inventory:delete", (_event, id) => inventory.deleteMaterial(id));

  // Tailors
  ipcMain.handle("tailor:getAll", () => tailor.getAllTailors());
  ipcMain.handle("tailor:add", (_event, { name, phone }) => tailor.addTailor(name, phone));
  ipcMain.handle("tailor:toggleActive", (_event, { id, active }) => tailor.toggleTailorStatus(id, active));

  // Production
  ipcMain.handle("production:getAll", () => production.getAllBatches());
  ipcMain.handle("production:create", (_event, data) => production.createBatch(data));
  ipcMain.handle("production:updateStatus", (_event, { id, status }) => production.updateBatchStatus(id, status));

  // Products
  ipcMain.handle("product:getAll", () => product.getAll());
  ipcMain.handle("product:add", (_event, data) => product.add(data));
  ipcMain.handle("product:update", (_event, { id, data }) => product.update(id, data));
  ipcMain.handle("product:remove", (_event, id) => product.remove(id));

  // Sales
  ipcMain.handle("sales:getAllOrders", () => sales.getAllOrders());
  ipcMain.handle("sales:createOrder", (_event, data) => sales.createOrder(data));
  ipcMain.handle("sales:getAllCustomers", () => sales.getAllCustomers());
  ipcMain.handle("sales:addCustomer", (_event, data) => sales.addCustomer(data));
  ipcMain.handle("sales:getOrderItems", (_event, orderId) => sales.getOrderItems(orderId));

  // Analytics
  ipcMain.handle("analytics:getStats", () => analytics.getSummaryStats());
  ipcMain.handle("analytics:getLowStock", () => analytics.getLowStockMaterials());
  ipcMain.handle("analytics:getMonthlySales", (_event, { year }) => analytics.getMonthlySalesReport(year));
  ipcMain.handle("analytics:getMaterialUsage", (_event, { startDate, endDate }) => analytics.getMaterialUsageReport(startDate, endDate));
  ipcMain.handle("analytics:getRecentSales", () => analytics.getRecentSalesOrders(5));
  ipcMain.handle("analytics:getRecentBatches", () => analytics.getRecentProductionBatches(5));

  // Accounting
  ipcMain.handle("accounting:getAllTransactions", () => accounting.getAllTransactions());
  ipcMain.handle("accounting:addTransaction", (_event, data) => accounting.addTransaction(data));
  ipcMain.handle("accounting:getAllCategories", () => accounting.getAllCategories());
  ipcMain.handle("accounting:getProfitLoss", (_event, { startDate, endDate }) => accounting.getProfitLoss(startDate, endDate));
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});
