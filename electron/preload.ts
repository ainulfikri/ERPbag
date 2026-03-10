import { contextBridge, ipcRenderer } from "electron";
import type { NewMaterial } from "./backend/modules/inventory/inventory";

contextBridge.exposeInMainWorld("api", {
  inventory: {
    getAll: () => ipcRenderer.invoke("inventory:getAll"),
    add: (material: NewMaterial) =>
      ipcRenderer.invoke("inventory:add", material),
    update: (id: number, data: NewMaterial) =>
      ipcRenderer.invoke("inventory:update", { id, data }),
    delete: (id: number) => ipcRenderer.invoke("inventory:delete", id),
  },
  tailor: {
    getAll: () => ipcRenderer.invoke("tailor:getAll"),
    add: (data: { name: string; phone: string }) =>
      ipcRenderer.invoke("tailor:add", data),
    toggleActive: (id: number, active: number) =>
      ipcRenderer.invoke("tailor:toggleActive", { id, active }),
  },
  production: {
    getAll: () => ipcRenderer.invoke("production:getAll"),
    create: (data: { productId: number; materialId: number; tailorId: number; quantity: number }) =>
      ipcRenderer.invoke("production:create", data),
    updateStatus: (id: number, status: string) =>
      ipcRenderer.invoke("production:updateStatus", { id, status }),
  },
  product: {
    getAll: () => ipcRenderer.invoke("product:getAll"),
    add: (data: { name: string; unit: string }) => ipcRenderer.invoke("product:add", data),
    update: (id: number, data: { name: string; unit: string }) =>
      ipcRenderer.invoke("product:update", { id, data }),
    remove: (id: number) => ipcRenderer.invoke("product:remove", id),
  },
  sales: {
    getAllOrders: () => ipcRenderer.invoke("sales:getAllOrders"),
    createOrder: (data: { customerId?: number; items: { productId: number; quantity: number; price: number }[] }) =>
      ipcRenderer.invoke("sales:createOrder", data),
    getAllCustomers: () => ipcRenderer.invoke("sales:getAllCustomers"),
    addCustomer: (data: { name: string; phone?: string; address?: string }) =>
      ipcRenderer.invoke("sales:addCustomer", data),
    getOrderItems: (orderId: number) => ipcRenderer.invoke("sales:getOrderItems", orderId),
  },
  analytics: {
    getStats: () => ipcRenderer.invoke("analytics:getStats"),
    getLowStock: () => ipcRenderer.invoke("analytics:getLowStock"),
    getMonthlySales: (year?: number) => ipcRenderer.invoke("analytics:getMonthlySales", { year }),
    getMaterialUsage: (startDate?: string, endDate?: string) => ipcRenderer.invoke("analytics:getMaterialUsage", { startDate, endDate }),
    getRecentSales: () => ipcRenderer.invoke("analytics:getRecentSales"),
    getRecentBatches: () => ipcRenderer.invoke("analytics:getRecentBatches"),
  },
  accounting: {
    getAllTransactions: () => ipcRenderer.invoke("accounting:getAllTransactions"),
    addTransaction: (data: { categoryId: number; amount: number; description?: string; date?: string }) =>
      ipcRenderer.invoke("accounting:addTransaction", data),
    getAllCategories: () => ipcRenderer.invoke("accounting:getAllCategories"),
    getProfitLoss: (startDate?: string, endDate?: string) =>
      ipcRenderer.invoke("accounting:getProfitLoss", { startDate, endDate }),
  },
});
