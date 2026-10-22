import { Svg, Petals, Sparkle, Leaf, Glow, useUid } from './parts.jsx';

const G = '#3f9c45';
const GD = '#2f7d36';
const GL = '#6cc86a';

const stem = (d, w = 3.5, c = G) => (
  <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
);

/* ───────────── BASIC: simple flat shapes ───────────── */

// b1 Sunpetal Daisy
const b1 = () => (
  <g>
    {stem('M50 90 L50 52')}
    <Leaf x={50} y={80} len={18} w={8} angle={-60} fill={GD} />
    <Leaf x={50} y={72} len={16} w={7} angle={60} fill={G} />
    <Petals cx={50} cy={42} n={12} len={20} w={8} fill="#ffd93b" />
    <circle cx="50" cy="42" r="8" fill="#a8641c" />
    <circle cx="50" cy="42" r="4" fill="#7a4310" />
  </g>
);

// b2 Mossbell
const b2 = () => (
  <g>
    {stem('M50 90 Q48 60 56 38', 3)}
    <Leaf x={49} y={86} len={22} w={8} angle={-55} fill={GD} />
    <Leaf x={50} y={80} len={20} w={7} angle={55} fill={G} />
    <path d="M44 36 Q44 18 58 20 Q70 24 66 38 Q56 44 44 36Z" fill="#5b7fd6" />
    <path d="M44 36 Q56 42 66 38 L68 44 Q56 50 42 42Z" fill="#7da0ee" />
    <circle cx="56" cy="46" r="2" fill="#fff" />
  </g>
);

// b3 Ember Tulip
const b3 = () => (
  <g>
    {stem('M50 90 L50 48')}
    <Leaf x={50} y={90} len={34} w={9} angle={-18} fill={GD} />
    <Leaf x={50} y={90} len={30} w={9} angle={20} fill={G} />
    <path d="M36 28 Q36 52 50 52 Q64 52 64 28 L57 36 L50 22 L43 36Z" fill="#e8452c" />
    <path d="M43 36 L50 22 L57 36 Q50 48 43 36Z" fill="#ff8a3d" />
  </g>
);

// b4 Dewclover
const b4 = () => (
  <g>
    {stem('M50 90 L50 56', 2.5)}
    {[0, 90, 180, 270].map((a, i) => (
      <g key={i} transform={`rotate(${a + 45} 50 44)`}>
        <path d="M50 44 C 38 40, 34 24, 44 22 C 48 22, 50 26, 50 30 C 50 26, 52 22, 56 22 C 66 24, 62 40, 50 44Z"
          fill={i % 2 ? GL : G} stroke={GD} strokeWidth="0.8" />
      </g>
    ))}
    <Leaf x={50} y={74} len={16} w={7} angle={-75} fill={GD} />
    <Leaf x={50} y={74} len={16} w={7} angle={75} fill={GD} />
    <circle cx="44" cy="36" r="1.8" fill="#d8f6ff" />
    <circle cx="56" cy="52" r="1.8" fill="#d8f6ff" />
  </g>
);

// b5 Moonpuff mushroom
const b5 = () => (
  <g>
    <path d="M42 90 Q44 64 46 56 L54 56 Q56 64 58 90Z" fill="#f3ead2" />
    <path d="M18 60 Q18 24 50 24 Q82 24 82 60 Q50 54 18 60Z" fill="#c9d2f5" />
    <circle cx="36" cy="42" r="5" fill="#fff" />
    <circle cx="58" cy="36" r="4" fill="#fff" />
    <circle cx="68" cy="50" r="3" fill="#fff" />
    <circle cx="48" cy="50" r="2.5" fill="#fff" />
  </g>
);

/* ───────────── RARE: layered, gradients, sparkles ───────────── */

// r1 Prism Rose
const r1 = (u) => (
  <g>
    <defs>
      <radialGradient id={`${u}a`} cx="50%" cy="40%">
        <stop offset="0" stopColor="#ffd0f0" />
        <stop offset="0.6" stopColor="#ff5fb0" />
        <stop offset="1" stopColor="#8a2be2" />
      </radialGradient>
      <Glow id={`${u}g`} color="#ff8fe0" />
    </defs>
    <circle cx="50" cy="40" r="36" fill={`url(#${u}g)`} />
    {stem('M50 90 Q54 70 50 50')}
    <Leaf x={51} y={78} len={20} w={9} angle={-60} fill={GD} vein="#9be39a" />
    <Leaf x={51} y={68} len={18} w={8} angle={60} fill={G} vein="#9be39a" />
    <Petals cx={50} cy={40} n={8} len={26} w={16} fill={`url(#${u}a)`} stroke="#6a1b9a" />
    <Petals cx={50} cy={40} n={6} len={17} w={12} fill="#ff7cc4" start={30} stroke="#6a1b9a" />
    <circle cx="50" cy="40" r="6" fill="#ffd0f0" />
    <Sparkle x={20} y={22} r={5} />
    <Sparkle x={82} y={30} r={4} fill="#d8c3ff" />
    <Sparkle x={74} y={10} r={3} />
  </g>
);

// r2 Aurora Lily
const r2 = (u) => (
  <g>
    <defs>
      <linearGradient id={`${u}a`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7df9e0" />
        <stop offset="0.5" stopColor="#6aa7ff" />
        <stop offset="1" stopColor="#c46bff" />
      </linearGradient>
      <Glow id={`${u}g`} color="#7df9e0" />
    </defs>
    <ellipse cx="50" cy="40" rx="38" ry="32" fill={`url(#${u}g)`} />
    {stem('M50 90 L50 54')}
    <Leaf x={50} y={90} len={36} w={8} angle={-25} fill={GD} />
    <Leaf x={50} y={90} len={32} w={8} angle={28} fill={G} />
    {[-60, -30, 0, 30, 60].map((a, i) => (
      <path
        key={i}
        d="M50 54 C 38 40, 42 18, 50 8 C 58 18, 62 40, 50 54Z"
        fill={`url(#${u}a)`}
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="0.8"
        opacity={i % 2 ? 0.8 : 1}
        transform={`rotate(${a} 50 54)`}
      />
    ))}
    {[-14, 0, 14].map((dx) => (
      <g key={dx}>
        <path d={`M50 54 L${50 + dx} 34`} stroke="#fff" strokeWidth="1" />
        <circle cx={50 + dx} cy="33" r="2" fill="#fff6b0" />
      </g>
    ))}
    <Sparkle x={18} y={26} r={4} fill="#c6fff2" />
    <Sparkle x={84} y={20} r={5} fill="#e5c6ff" />
  </g>
);

// r3 Crystal Cactus
const r3 = (u) => (
  <g>
    <defs>
      <linearGradient id={`${u}a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d3fff4" />
        <stop offset="0.5" stopColor="#4fd1c5" />
        <stop offset="1" stopColor="#2b7a9e" />
      </linearGradient>
      <Glow id={`${u}g`} color="#6ff2e4" />
    </defs>
    <circle cx="50" cy="55" r="38" fill={`url(#${u}g)`} />
    <path d="M38 90 L38 36 L44 20 L56 20 L62 36 L62 90Z" fill={`url(#${u}a)`} stroke="#1f6f86" strokeWidth="1" />
    <path d="M50 20 L50 90 M44 20 L38 36 M56 20 L62 36" stroke="#e9fffb" strokeOpacity="0.6" strokeWidth="1" />
    <path d="M38 64 L24 64 L22 46 L30 40 L32 56 L38 56Z" fill={`url(#${u}a)`} stroke="#1f6f86" strokeWidth="1" />
    <path d="M62 56 L76 54 L78 36 L70 32 L68 46 L62 46Z" fill={`url(#${u}a)`} stroke="#1f6f86" strokeWidth="1" />
    <path d="M44 20 L50 8 L56 20Z" fill="#ff9ad5" />
    <Sparkle x={26} y={24} r={4} fill="#d3fff4" />
    <Sparkle x={80} y={72} r={4} fill="#d3fff4" />
    <Sparkle x={66} y={14} r={3} />
  </g>
);

// r4 Starvine Orchid
const r4 = (u) => (
  <g>
    <defs>
      <Glow id={`${u}g`} color="#ffe27a" />
      <linearGradient id={`${u}a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff2a8" />
        <stop offset="1" stopColor="#f0a1ff" />
      </linearGradient>
    </defs>
    <circle cx="52" cy="40" r="36" fill={`url(#${u}g)`} />
    {stem('M46 90 Q30 70 48 54 Q66 42 52 28', 3)}
    <Leaf x={40} y={80} len={20} w={8} angle={-70} fill={GD} />
    <Leaf x={52} y={46} len={18} w={7} angle={70} fill={G} />
    {[[34, 62], [62, 50], [44, 38]].map(([x, y], i) => (
      <g key={i}>
        <Petals cx={x} cy={y} n={5} len={11} w={8} fill={`url(#${u}a)`} stroke="#a05bd0" start={i * 20} />
        <circle cx={x} cy={y} r="3" fill="#ffb347" />
      </g>
    ))}
    <Petals cx={52} cy={22} n={5} len={14} w={10} fill={`url(#${u}a)`} stroke="#a05bd0" />
    <circle cx="52" cy="22" r="3.5" fill="#ffb347" />
    <Sparkle x={16} y={40} r={5} />
    <Sparkle x={84} y={62} r={4} fill="#f0c6ff" />
    <Sparkle x={78} y={18} r={3} />
  </g>
);

// r5 Tidal Lotus
const r5 = (u) => (
  <g>
    <defs>
      <linearGradient id={`${u}a`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e1fbff" />
        <stop offset="1" stopColor="#3fa9f5" />
      </linearGradient>
      <Glow id={`${u}g`} color="#7fe0ff" />
    </defs>
    <ellipse cx="50" cy="60" rx="46" ry="30" fill={`url(#${u}g)`} />
    <ellipse cx="50" cy="86" rx="36" ry="7" fill="#2a78b8" opacity="0.7" />
    <ellipse cx="50" cy="84" rx="30" ry="5" fill="#4fb3ea" />
    <ellipse cx="22" cy="84" rx="12" ry="3.5" fill={GD} />
    <ellipse cx="80" cy="85" rx="11" ry="3.2" fill={G} />
    {[-70, -45, 45, 70].map((a) => (
      <path key={a} d="M50 82 C 38 66, 42 46, 50 38 C 58 46, 62 66, 50 82Z" fill="#8fd3ff" stroke="#2a78b8" strokeWidth="0.8"
        transform={`rotate(${a} 50 82)`} />
    ))}
    {[-22, 22].map((a) => (
      <path key={a} d="M50 82 C 38 62, 42 36, 50 26 C 58 36, 62 62, 50 82Z" fill={`url(#${u}a)`} stroke="#2a78b8" strokeWidth="0.8"
        transform={`rotate(${a} 50 82)`} />
    ))}
    <path d="M50 82 C 40 60, 44 34, 50 20 C 56 34, 60 60, 50 82Z" fill={`url(#${u}a)`} stroke="#2a78b8" strokeWidth="0.8" />
    <circle cx="50" cy="30" r="3" fill="#fff6b0" />
    <circle cx="30" cy="40" r="2.5" fill="#bfeaff" />
    <circle cx="72" cy="34" r="2" fill="#bfeaff" />
    <circle cx="82" cy="52" r="3" fill="#bfeaff" />
    <Sparkle x={18} y={22} r={4} fill="#e1fbff" />
  </g>
);

/* ───────────── EXTINCT: radiant, animated-feel, many layers ───────────── */

// e1 Phoenix Bloom
const e1 = (u) => (
  <g>
    <defs>
      <Glow id={`${u}g`} color="#ff9a1f" opacity={0.8} />
      <linearGradient id={`${u}a`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#b3000f" />
        <stop offset="0.5" stopColor="#ff6a00" />
        <stop offset="1" stopColor="#ffe45c" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="44" r="48" fill={`url(#${u}g)`} />
    {stem('M50 90 L50 56', 4, '#5c2a12')}
    <Leaf x={50} y={84} len={22} w={9} angle={-65} fill="#7a1c10" />
    <Leaf x={50} y={84} len={22} w={9} angle={65} fill="#7a1c10" />
    {[-78, -52, -26, 26, 52, 78].map((a, i) => (
      <path key={a}
        d="M50 58 C 34 44, 40 22, 46 6 C 52 22, 62 30, 50 58Z"
        fill={`url(#${u}a)`}
        transform={`rotate(${a} 50 58)`}
        opacity={0.95 - Math.abs(i - 2.5) * 0.05} />
    ))}
    <path d="M50 58 C 36 42, 42 22, 50 4 C 58 22, 64 42, 50 58Z" fill={`url(#${u}a)`} stroke="#fff3a0" strokeWidth="1" />
    <path d="M50 54 C 44 42, 46 28, 50 18 C 54 28, 56 42, 50 54Z" fill="#fff3a0" />
    <circle cx="50" cy="58" r="5" fill="#ffd54a" stroke="#b3000f" strokeWidth="1" />
    <Sparkle x={14} y={30} r={5} fill="#ffd54a" />
    <Sparkle x={86} y={26} r={5} fill="#ffd54a" />
    <Sparkle x={24} y={64} r={3} fill="#fff3a0" />
    <Sparkle x={78} y={62} r={3} fill="#fff3a0" />
  </g>
);

// e2 Worldtree Sapling
const e2 = (u) => (
  <g>
    <defs>
      <Glow id={`${u}g`} color="#9dffb0" opacity={0.7} />
      <radialGradient id={`${u}c`}>
        <stop offset="0" stopColor="#d9ffd0" />
        <stop offset="1" stopColor="#2fae5c" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="40" r="48" fill={`url(#${u}g)`} />
    <path d="M42 90 Q48 68 46 52 L54 52 Q52 68 58 90Z" fill="#6b4423" />
    <path d="M50 60 Q34 54 26 40 M50 56 Q66 50 76 36 M50 52 Q50 36 50 22 M48 70 Q36 68 28 62 M52 68 Q64 66 72 58"
      stroke="#6b4423" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[[26, 38, 12], [76, 34, 13], [50, 20, 15], [28, 60, 9], [72, 56, 9], [38, 28, 9], [64, 24, 9]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={`url(#${u}c)`} stroke="#1f8a46" strokeWidth="0.8" />
    ))}
    {[[22, 22], [80, 18], [50, 6], [14, 48], [86, 50]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#fffbc4" />
    ))}
    <Sparkle x={34} y={14} r={4} fill="#fffbc4" />
    <Sparkle x={68} y={10} r={3} fill="#fffbc4" />
    <Sparkle x={90} y={34} r={3} fill="#fffbc4" />
  </g>
);

// e3 Voidpetal Orchid
const e3 = (u) => (
  <g>
    <defs>
      <radialGradient id={`${u}a`} cx="50%" cy="50%">
        <stop offset="0" stopColor="#0b0221" />
        <stop offset="0.6" stopColor="#3b0f7a" />
        <stop offset="1" stopColor="#b45cff" />
      </radialGradient>
      <Glow id={`${u}g`} color="#b45cff" opacity={0.75} />
    </defs>
    <circle cx="50" cy="42" r="48" fill={`url(#${u}g)`} />
    {stem('M50 90 Q42 70 50 54', 3.5, '#2a1b4d')}
    <Leaf x={48} y={82} len={24} w={9} angle={-60} fill="#3a2a6a" vein="#b45cff" />
    <Leaf x={50} y={72} len={20} w={8} angle={62} fill="#3a2a6a" vein="#b45cff" />
    <Petals cx={50} cy={42} n={10} len={30} w={13} fill={`url(#${u}a)`} stroke="#d9a8ff" />
    <Petals cx={50} cy={42} n={5} len={19} w={11} fill="#5a1fb0" start={18} stroke="#d9a8ff" />
    <circle cx="50" cy="42" r="9" fill="#05010f" stroke="#e5c6ff" strokeWidth="1.2" />
    <circle cx="50" cy="42" r="3.5" fill="#fff" />
    <Sparkle x={14} y={20} r={5} fill="#e5c6ff" />
    <Sparkle x={86} y={24} r={4} fill="#e5c6ff" />
    <Sparkle x={20} y={70} r={3} fill="#fff" />
    <Sparkle x={82} y={68} r={4} fill="#fff" />
  </g>
);

// e4 Chrono Lotus
const e4 = (u) => (
  <g>
    <defs>
      <Glow id={`${u}g`} color="#ffd86b" opacity={0.8} />
      <linearGradient id={`${u}a`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff4c2" />
        <stop offset="1" stopColor="#d08a1c" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="48" r="48" fill={`url(#${u}g)`} />
    <ellipse cx="50" cy="88" rx="30" ry="5" fill="#8a5a12" opacity="0.7" />
    {[-80, -55, -30, 30, 55, 80].map((a) => (
      <path key={a} d="M50 84 C 40 66, 42 50, 50 42 C 58 50, 60 66, 50 84Z" fill={`url(#${u}a)`} stroke="#8a5a12" strokeWidth="0.8"
        transform={`rotate(${a} 50 84)`} />
    ))}
    <path d="M50 84 C 38 62, 42 36, 50 28 C 58 36, 62 62, 50 84Z" fill={`url(#${u}a)`} stroke="#8a5a12" strokeWidth="0.8" />
    {/* clock halo */}
    <circle cx="50" cy="40" r="24" fill="none" stroke="#fff4c2" strokeWidth="1.5" strokeDasharray="2 3" />
    <circle cx="50" cy="40" r="17" fill="#1b1a3a" stroke="#ffd86b" strokeWidth="2" />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1="50" y1="25.5" x2="50" y2={i % 3 === 0 ? 29 : 27.5} stroke="#ffd86b" strokeWidth="1"
        transform={`rotate(${i * 30} 50 40)`} />
    ))}
    <path d="M50 40 L50 29" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 40 L58 44" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="50" cy="40" r="2" fill="#ffd86b" />
    <Sparkle x={16} y={26} r={5} fill="#fff4c2" />
    <Sparkle x={84} y={30} r={5} fill="#fff4c2" />
    <Sparkle x={74} y={8} r={3} fill="#fff4c2" />
    <Sparkle x={26} y={8} r={3} fill="#fff4c2" />
  </g>
);

// e5 Galaxy Bonsai Bloom
const e5 = (u) => (
  <g>
    <defs>
      <radialGradient id={`${u}n`} cx="50%" cy="50%">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.25" stopColor="#ff8de6" />
        <stop offset="0.6" stopColor="#5a3bd6" />
        <stop offset="1" stopColor="#120a3a" />
      </radialGradient>
      <Glow id={`${u}g`} color="#8f7bff" opacity={0.7} />
    </defs>
    <circle cx="50" cy="44" r="48" fill={`url(#${u}g)`} />
    <path d="M32 90 L68 90 L62 80 L38 80Z" fill="#7a4a2a" />
    <path d="M50 80 Q44 66 52 56 Q60 46 46 36" stroke="#a9744a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <path d="M52 60 Q66 58 72 50" stroke="#a9744a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="46" cy="30" r="22" fill={`url(#${u}n)`} stroke="#d9c8ff" strokeWidth="1" />
    <ellipse cx="46" cy="30" rx="30" ry="7" fill="none" stroke="#ffe6fb" strokeWidth="1.3" transform="rotate(-20 46 30)" />
    <circle cx="74" cy="46" r="10" fill={`url(#${u}n)`} stroke="#d9c8ff" strokeWidth="0.8" />
    <circle cx="68" cy="14" r="2.5" fill="#ffe6fb" />
    <Sparkle x={14} y={14} r={5} fill="#ffe6fb" />
    <Sparkle x={86} y={22} r={4} fill="#ffe6fb" />
    <Sparkle x={20} y={56} r={3} fill="#fff" />
    <Sparkle x={36} y={8} r={3} fill="#fff" />
    <Sparkle x={88} y={64} r={3} fill="#fff" />
  </g>
);

const PLANTS = { b1, b2, b3, b4, b5, r1, r2, r3, r4, r5, e1, e2, e3, e4, e5 };

export default function MaturePlant({ id = 'b1', size = 64, silhouette = false }) {
  const u = useUid();
  const draw = PLANTS[id] || b1;
  return (
    <Svg size={size} silhouette={silhouette} label={`Plant ${id}`}>
      {draw(u)}
    </Svg>
  );
}
