import type { Material, NewMaterial } from "./material";
import type { Tailor } from "./tailor";

export { };

declare global {
  interface Window {
    api: {
      inventory: {
        getAll: () => Promise<Material[]>;
        add: (data: NewMaterial) => Promise<number>;
        update: (id: number, data: NewMaterial) => Promise<any>;
        delete: (id: number) => Promise<any>;
      };
      tailor: {
        getAll: () => Promise<Tailor[]>;
        add: (data: { name: string; phone: string }) => Promise<number>;
        toggleActive: (id: number, active: number) => Promise<void>;
      };
      production: {
        getAll: () => Promise<any[]>;
        create: (data: { productId: number; materialId: number; tailorId: number; quantity: number }) => Promise<number>;
        updateStatus: (id: number, status: string) => Promise<void>;
      };
      product: {
        getAll: () => Promise<any[]>;
        add: (data: { name: string; unit: string }) => Promise<number>;
        update: (id: number, data: { name: string; unit: string }) => Promise<any>;
        remove: (id: number) => Promise<any>;
      };
      sales: {
        getAllOrders: () => Promise<any[]>;
        createOrder: (data: { customerId?: number; items: { productId: number; quantity: number; price: number }[] }) => Promise<number>;
        getAllCustomers: () => Promise<any[]>;
        addCustomer: (data: { name: string; phone?: string; address?: string }) => Promise<number>;
        getOrderItems: (orderId: number) => Promise<any[]>;
      };
      analytics: {
        getStats: () => Promise<{
          revenue: number;
          activeBatches: number;
          alerts: number;
          catalogSize: number;
        }>;
        getLowStock: () => Promise<any[]>;
      };
    };
  }
}
