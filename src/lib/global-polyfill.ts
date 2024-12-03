// Polyfill for packages that expect the Node.js global object
if (typeof global === 'undefined') {
  (window as any).global = window;
  (window as any).global.global = window;
  (window as any).global.window = window;
  (window as any).global.self = window;
}