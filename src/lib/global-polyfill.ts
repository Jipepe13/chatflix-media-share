// Polyfill for packages that expect the Node.js global object
if (typeof global === 'undefined') {
  (window as any).global = window;
}