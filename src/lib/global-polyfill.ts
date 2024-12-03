// Polyfill for packages that expect the Node.js global object
if (typeof window !== 'undefined') {
  window.global = window;
  global = window;
}

// Additional Node.js globals that might be needed
if (typeof process === 'undefined') {
  window.process = { env: {} };
}

// Buffer polyfill if needed
if (typeof window.Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: () => false,
    from: (data: any) => data,
  };
}