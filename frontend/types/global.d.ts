export {};

declare global {
  interface Window {
    api: {
      inventory: {
        getAll: () => Promise<any[]>;
        add?: (data: any) => Promise<void>;
      };
    };
  }
}
