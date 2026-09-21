import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-900.css';
import './index.css';
import App from './App';
import { initializeStorage } from './platform/storage';
import { useRoutineStore } from './store/useRoutineStore';

async function startApp() {
  await initializeStorage();
  await useRoutineStore.persist.rehydrate();

  // Dev only: lets scripts/screenshots/capture.mjs seed app state. Stripped from production builds.
  if (import.meta.env.DEV) window.__tb = useRoutineStore;

  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void startApp();
