import { useEffect, useMemo, useState } from 'react';
import Dialog from './Dialog.jsx';
import MaturePlant from '../art/MaturePlant.jsx';
import { CATALOGUE } from '../data/catalogue.js';
import { arabicLore } from '../i18n/plantLore.js';
import { revealFrames, prefersReducedMotion } from '../game/reveal.js';

// Optional, user-enabled reveal after a task is completed. The result is already decided and saved.
export default function HarvestReveal({ result, onClose, t, language }) {
  const frames = useMemo(() => (result ? revealFrames(result.tier, result.matureId) : []), [result]);
  const [index, setIndex] = useState(0);
  const animate = !prefersReducedMotion();

  useEffect(() => {
    setIndex(animate ? 0 : frames.length - 1);
  }, [frames, animate]);

  useEffect(() => {
    if (!frames.length || index >= frames.length - 1) return;
    const timer = setTimeout(() => setIndex(i => i + 1), frames[index].delay);
    return () => clearTimeout(timer);
  }, [index, frames]);

  if (!result) return null;
  const landed = index >= frames.length - 1;
  const shownId = frames[Math.min(index, frames.length - 1)]?.id ?? result.matureId;
  const entry = CATALOGUE.find(c => c.id === result.matureId);
  const name = language === 'ar' ? arabicLore[result.matureId]?.[0] : entry?.name;

  return (
    <Dialog open={Boolean(result)} onClose={onClose} title={t.revealTitle}>
      <div className="harvest-reveal">
        <p className="eyebrow">{t.revealTitle}</p>
        <div className={`reveal-plant${landed ? ' landed' : ''}`} aria-hidden={!landed}>
          <MaturePlant id={shownId} size={120} />
        </div>
        <p role="status" aria-live="polite">{landed ? <><strong>{name}</strong> · {t[result.tier]}</> : ' '}</p>
        {landed && result.seed && <p className="quiet">{t.revealNewSeed} {t[result.seed]}</p>}
        <div className="button-row">
          {landed
            ? <button className="primary" onClick={onClose}>{t.close}</button>
            : <button onClick={() => setIndex(frames.length - 1)}>{t.skip}</button>}
        </div>
      </div>
    </Dialog>
  );
}
