import { useState } from 'react';
import MaturePlant from '../art/MaturePlant.jsx';
import { CATALOGUE } from '../data/catalogue.js';
import { arabicLore } from '../i18n/plantLore.js';
import { TIERS } from '../game/rules.js';

export default function Catalogue({ matured, t, language }) {
  const [tier, setTier] = useState('basic');
  const [selected, setSelected] = useState(null);
  const entries = CATALOGUE.filter((c) => c.tier === tier);
  const detail = CATALOGUE.find((c) => c.id === selected);

  return (
    <aside className="catalogue">
      <p>{t.collectionHint}</p>
      <div className="tabs">
        {TIERS.map((tierId) => (
          <button
            key={tierId}
            className={tierId === tier ? 'active' : ''}
            onClick={() => {
              setTier(tierId);
              setSelected(null);
            }}
          >
            {t[tierId]}
          </button>
        ))}
      </div>

      <div className="cards">
        {entries.map((c) => {
          const count = matured[c.id] ?? 0;
          return (
            <button
              key={c.id}
              className={`card${selected === c.id ? ' selected' : ''}${count ? '' : ' unknown'}`}
              onClick={() => setSelected(c.id)}
              title={count ? (language==='ar'?arabicLore[c.id][0]:c.name) : t.unknown}
              aria-label={`${count ? (language==='ar'?arabicLore[c.id][0]:c.name) : t.unknown} ${count}`}
            >
              <MaturePlant id={c.id} size={56} silhouette={count === 0} />
              <span className="badge">{count}</span>
            </button>
          );
        })}
      </div>

      {detail && (
        <div className="detail">
          <small>{t.lore}</small><h3>{matured[detail.id] ? (language==='ar'?arabicLore[detail.id][0]:detail.name) : t.unknown}</h3>
          <p>
            {matured[detail.id]
              ? (language==='ar'?arabicLore[detail.id][1]:detail.description)
              : t.reveal}
          </p>
        </div>
      )}
    </aside>
  );
}
