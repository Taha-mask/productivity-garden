const TIER_COLOR = { basic: '#8b6b3e', rare: '#3b82c4', extinct: '#b04bd8' };

export function SeedIcon({ tier, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-label={`${tier} seed`}>
      <ellipse cx="20" cy="22" rx="10" ry="13" fill={TIER_COLOR[tier]} />
      <ellipse cx="16" cy="17" rx="3" ry="5" fill="#fff" opacity="0.35" />
    </svg>
  );
}

export default function SeedBank({ bank, selected, fresh = null, onSelect, t }) {
  return (
    <div className="seed-bank">
      <h2 className="sr-only">{t?.seedBank || 'Seed bank'}</h2>
      <div className="slots">
        {bank.map((tier, i) => (
          <button
            key={i}
            className={`slot${selected === i ? ' selected' : ''}${tier ? '' : ' empty'}${fresh === i ? ' fresh' : ''}`}
            disabled={!tier}
            onClick={() => onSelect(i)}
            aria-label={tier ? `${t?.[tier] || tier} ${t?.seed || 'seed'} ${i+1}` : t?.empty || 'empty'}
          >
            {tier ? <SeedIcon tier={tier} /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
