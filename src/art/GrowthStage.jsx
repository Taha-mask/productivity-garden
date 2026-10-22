import { Svg, Leaf } from './parts.jsx';

const SOIL = '#7a5230';
const SOIL_DARK = '#5a3a20';
const STEM = '#3f9c45';
const LEAF = '#5cc05f';
const LEAF_DARK = '#2f7d36';

function Mound() {
  return (
    <g>
      <ellipse cx="50" cy="90" rx="26" ry="6" fill={SOIL_DARK} />
      <path d="M26 90 Q50 70 74 90 Z" fill={SOIL} />
    </g>
  );
}

const STAGES = {
  // 1: seed just buried, tiny sprout tip
  1: (
    <g>
      <Mound />
      <ellipse cx="50" cy="78" rx="3.5" ry="2.2" fill="#d9b779" transform="rotate(-15 50 78)" />
      <path d="M50 77 Q50 72 52 70" stroke={STEM} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  // 2: two cotyledon leaves
  2: (
    <g>
      <Mound />
      <path d="M50 82 L50 62" stroke={STEM} strokeWidth="2.5" strokeLinecap="round" />
      <Leaf x={50} y={64} len={16} w={8} angle={-60} fill={LEAF} />
      <Leaf x={50} y={64} len={16} w={8} angle={60} fill={LEAF} />
    </g>
  ),
  // 3: taller stem, true leaf pairs
  3: (
    <g>
      <Mound />
      <path d="M50 84 L50 44" stroke={STEM} strokeWidth="3" strokeLinecap="round" />
      <Leaf x={50} y={72} len={18} w={8} angle={-65} fill={LEAF_DARK} />
      <Leaf x={50} y={72} len={18} w={8} angle={65} fill={LEAF_DARK} />
      <Leaf x={50} y={56} len={16} w={7} angle={-50} fill={LEAF} />
      <Leaf x={50} y={56} len={16} w={7} angle={50} fill={LEAF} />
      <Leaf x={50} y={46} len={12} w={5} angle={0} fill={LEAF} />
    </g>
  ),
  // 4: branching, tiny bud forming
  4: (
    <g>
      <Mound />
      <path d="M50 84 L50 30" stroke={STEM} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 62 Q34 58 28 46" stroke={STEM} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 54 Q66 50 72 38" stroke={STEM} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Leaf x={50} y={76} len={20} w={9} angle={-70} fill={LEAF_DARK} />
      <Leaf x={50} y={76} len={20} w={9} angle={70} fill={LEAF_DARK} />
      <Leaf x={28} y={46} len={16} w={7} angle={-35} fill={LEAF} />
      <Leaf x={72} y={38} len={16} w={7} angle={35} fill={LEAF} />
      <Leaf x={50} y={64} len={16} w={7} angle={-45} fill={LEAF} />
      <Leaf x={50} y={64} len={16} w={7} angle={45} fill={LEAF} />
      <circle cx="50" cy="26" r="4.5" fill="#a8d86a" />
    </g>
  ),
  // 5: full unripe plant with a plump closed green bud
  5: (
    <g>
      <Mound />
      <path d="M50 84 L50 34" stroke={STEM} strokeWidth="4" strokeLinecap="round" />
      <path d="M50 66 Q30 62 22 48" stroke={STEM} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 58 Q70 54 78 40" stroke={STEM} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Leaf x={50} y={80} len={24} w={10} angle={-75} fill={LEAF_DARK} />
      <Leaf x={50} y={80} len={24} w={10} angle={75} fill={LEAF_DARK} />
      <Leaf x={22} y={48} len={18} w={8} angle={-40} fill={LEAF} />
      <Leaf x={78} y={40} len={18} w={8} angle={40} fill={LEAF} />
      <Leaf x={50} y={70} len={20} w={8} angle={-50} fill={LEAF} />
      <Leaf x={50} y={70} len={20} w={8} angle={50} fill={LEAF} />
      <ellipse cx="50" cy="24" rx="10" ry="13" fill="#8fcf5a" />
      <path d="M50 11 Q42 24 50 37 Q58 24 50 11" fill="#6fb544" />
      <path d="M40 22 Q50 16 60 22" stroke="#b6e27e" strokeWidth="1.5" fill="none" />
    </g>
  ),
};

export default function GrowthStage({ stage = 1, size = 64 }) {
  const s = Math.min(5, Math.max(1, Math.round(stage)));
  return (
    <Svg size={size} label={`Growth stage ${s}`}>
      {STAGES[s]}
    </Svg>
  );
}
