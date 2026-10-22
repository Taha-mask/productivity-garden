// Compatibility is explicit: sharing algorithms must not silently change economies.
const profile = value => {
  for (const table of Object.values(value.rewards)) {
    table.forEach(Object.freeze); Object.freeze(table);
  }
  Object.freeze(value.rewards);
  return Object.freeze(value);
};
export const TIERS = Object.freeze(['basic', 'rare', 'extinct']);
export const BANK_SIZE = 5;
export const STAGES = 5;
export const STANDALONE = profile({
  id: 'standalone-v1', key: 'productivity-garden-v1', speciesOnIssue: true,
  stageMs: 300000, clampNegativeTime: false, blockFullBankCompletion: true,
  rewards: {
    basic: [['basic', 50], ['rare', 50]],
    rare: [['basic', 25], ['rare', 50], ['extinct', 25]],
    extinct: [['basic', 25], ['rare', 50], ['extinct', 25]],
  },
});
export const REACT = profile({
  id: 'react-v2', key: 'productivity-garden:v2', speciesOnIssue: false,
  stageMs: 30000, clampNegativeTime: true, blockFullBankCompletion: false,
  rewards: {
    basic: [['basic', 50], ['rare', 50]],
    rare: [['extinct', 25], ['basic', 25], ['rare', 50]],
    extinct: [['extinct', 50], ['rare', 50]],
  },
});
