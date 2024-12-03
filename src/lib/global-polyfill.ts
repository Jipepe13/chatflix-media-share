// Polyfill for packages that expect the Node.js global object
if (typeof window !== 'undefined') {
  window.global = window;
  global = window;
}

// Additional Node.js globals that might be needed
if (typeof process === 'undefined') {
  // Using a minimal process object with just the required env property
  (window as any).process = {
    env: {} as Record<string, string>
  };
}

// Buffer polyfill if needed
if (typeof window.Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: (obj: any): obj is Buffer => false,
    from: (data: any) => data,
  };
}