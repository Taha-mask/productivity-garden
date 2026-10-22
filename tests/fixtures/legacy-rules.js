// Frozen behavior captured from app.js and src/game/{rules,reducer}.js before extraction.
// This intentionally imports no production module: it is the compatibility oracle.
export const species = {
  basic: ['sunwhisper', 'mintmuse', 'cloudclover', 'emberbud', 'dewdrop'],
  rare: ['moonlily', 'starfern', 'crystalrose', 'auroraorchid', 'dreamwillow'],
  extinct: ['phoenixbloom', 'chronolotus', 'celestialoak', 'dragonroot', 'infinityiris'],
};
export const standaloneCatalogue = Object.entries(species).flatMap(([tier, ids]) => ids.map(id => ({id, tier})));
export const reactCatalogue = ['basic', 'rare', 'extinct'].flatMap((tier, index) => Array.from({length:5}, (_, i) => ({id: `${['b','r','e'][index]}${i+1}`, tier})));
const pick = (tier, catalogue, rng) => { const items = catalogue.filter(p => p.tier === tier); return items[Math.floor(rng()*5)].id; };
export const initialStandalone = rng => ({seeds: Array.from({length:5}, () => pick('basic', standaloneCatalogue, rng)), garden: [], counts: {}});
export const initialReact = () => ({bank: Array(5).fill('basic'), plants: [], matured: {}, nextId: 1});
export function rewardStandalone(tier, rng) { const r = rng(); return tier === 'basic' ? (r < .5 ? 'basic' : 'rare') : (r < .25 ? 'basic' : r < .75 ? 'rare' : 'extinct'); }
export function rewardReact(tier, rng) { const r = rng(); return tier === 'basic' ? (r < .5 ? 'basic' : 'rare') : tier === 'rare' ? (r < .25 ? 'extinct' : r < .5 ? 'basic' : 'rare') : (r < .5 ? 'extinct' : 'rare'); }
export function standalone(state, action, rng) {
  const next = structuredClone(state);
  if (action.type === 'PLANT') {
    if (!next.seeds[action.slot] || !action.title.trim()) return state;
    next.garden.push({id:action.id, seed:next.seeds[action.slot], title:action.title.trim(), x:action.x, y:action.y, created:action.now, done:false});
    next.seeds[action.slot] = null;
  } else if (action.type === 'COMPLETE') {
    const plant = next.garden.find(p => p.id === action.id), slot = next.seeds.findIndex(p => !p);
    if (!plant || plant.done || slot < 0) return state;
    plant.done = true;
    next.counts[plant.seed] = (next.counts[plant.seed] || 0) + 1;
    const tier = standaloneCatalogue.find(p => p.id === plant.seed).tier;
    next.seeds[slot] = pick(rewardStandalone(tier, rng), standaloneCatalogue, rng);
  } else return state;
  return next;
}
export function react(state, action, rng) {
  if (action.type === 'PLANT') {
    const tier = state.bank[action.slot]; if (!tier || !action.title.trim()) return state;
    const bank = state.bank.slice(); bank[action.slot] = null;
    return {...state, bank, plants:[...state.plants, {id:state.nextId, title:action.title.trim(), tier, x:action.x, y:action.y, plantedAt:action.now, matureId:null}], nextId:state.nextId+1};
  }
  if (action.type === 'COMPLETE') {
    const plant = state.plants.find(p => p.id === action.id); if (!plant || plant.matureId) return state;
    const matureId = pick(plant.tier, reactCatalogue, rng), seed = rewardReact(plant.tier, rng);
    const bank = state.bank.slice(), free = bank.indexOf(null); if (free !== -1) bank[free] = seed;
    return {...state, bank, plants:state.plants.map(p => p.id === plant.id ? {...p, matureId} : p), matured:{...state.matured, [matureId]:(state.matured[matureId] ?? 0)+1}, lastReward:{plantId:plant.id, matureId, seed}};
  }
  if (action.type === 'UPROOT') return {...state, plants:state.plants.filter(p => p.id !== action.id)};
  if (action.type === 'RESTART') return {...initialReact(), matured:state.matured, nextId:state.nextId};
  return state;
}
