
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Global fetch interceptor to prepend Catalyst function route in production
const originalFetch = window.fetch;
window.fetch = function (...args) {
  if (typeof args[0] === 'string' && args[0].startsWith('/api/')) {
    const prefix = import.meta.env?.DEV ? '' : '/server/node-server';
    args[0] = prefix + args[0];
  }
  return originalFetch.apply(this, args);
};

createRoot(document.getElementById("root")!).render(<App />);
