import { useState } from 'react';
const KEY = 'personal-growth-garden:preferences:v1';
export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      // The harvest reveal is opt-in: off unless the user turned it on.
      return { language: saved?.language === 'en' ? 'en' : 'ar', mode: saved?.mode === '2d' ? '2d' : '3d', reveal: saved?.reveal === true };
    } catch { return { language: 'ar', mode: '3d', reveal: false }; }
  });
  function update(patch) {
    const next = { ...preferences, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Preferences remain usable in memory if storage is unavailable. */ }
    setPreferences(next);
  }
  return [preferences, update];
}
