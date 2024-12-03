/// <reference types="vite/client" />

declare global {
  interface Window {
    global: typeof globalThis;
    process: { env: Record<string, string> };
    Buffer: {
      isBuffer: (obj: any) => obj is Buffer;
      from: (data: any) => any;
    };
  }
}

declare var global: typeof globalThis;

export {};