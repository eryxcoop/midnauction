// Global configuration for the Midnauction application

// Polyfill for global if not available (for some environments)
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Ensure Buffer is available globally if needed
if (typeof window !== 'undefined' && !window.Buffer) {
  // Buffer polyfill can be added here if needed
}

export {};
