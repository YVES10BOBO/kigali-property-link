declare global {
  interface Window {
    // Minimal typing to allow runtime access to Google Maps on `window.google`
    google?: any;
  }
}

export {};
