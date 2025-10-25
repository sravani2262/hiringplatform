import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Start MSW worker
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
