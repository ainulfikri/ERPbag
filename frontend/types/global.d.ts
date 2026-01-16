import type { Material } from "./material";
import type { Tailor } from "./tailor";

export {};

declare global {
  interface Window {
    api: {
      inventory: {
        getAll: () => Promise<any[]>;  
        add?: (data: any) => Promise<number>;
      };
      tailor: {
        getAll: () => Promise<Tailor[]>;
        toggleActive(id: number): Promise<void>;
      };
    };
  }
}
