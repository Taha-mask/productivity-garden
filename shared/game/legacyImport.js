import { validateGarden } from '../persistence/gardenStores.js';
import { STANDALONE } from './profiles.js';
// Historical species order maps to the same tier/variant in our unified catalogue.
export const LEGACY_SPECIES = [
  'sunwhisper','mintmuse','cloudclover','emberbud','dewdrop',
  'moonlily','starfern','crystalrose','auroraorchid','dreamwillow',
  'phoenixbloom','chronolotus','celestialoak','dragonroot','infinityiris',
].map((id,i)=>({ id, tier:['basic','rare','extinct'][Math.floor(i/5)], target:['b','r','e'][Math.floor(i/5)]+(i%5+1) }));
export function importLegacy(current, raw) {
  if (current.legacyImported || !raw) return current;
  const old = JSON.parse(raw);
  if (!validateGarden(old, STANDALONE, LEGACY_SPECIES)) throw new Error('Invalid legacy garden');
  const species = id => LEGACY_SPECIES.find(p=>p.id===id);
  let nextId=current.nextId;
  const plants=old.garden.map(p=>({ ...p, id:nextId++, legacyId:p.id, tier:species(p.seed).tier,
    plantedAt:p.created, matureId:p.done?species(p.seed).target:null, legacySpecies:species(p.seed).target }));
  const matured={...current.matured};
  for (const [id,count] of Object.entries(old.counts)) {
    const target=species(id).target; matured[target]=(matured[target]||0)+count;
  }
  // Never discard seeds when five slots are full. The reserve can be claimed later.
  const reserve=[...(current.legacySeedReserve||[]),...old.seeds.filter(Boolean).map(id=>species(id).tier)];
  const bank=current.bank.map(seed=>seed || reserve.shift() || null);
  return {...current,bank,plants:[...current.plants,...plants],matured,nextId,
    legacySeedReserve:reserve,legacyImported:true};
}
export function claimLegacySeeds(state) {
  if (!state.legacySeedReserve?.length || !state.bank.includes(null)) return state;
  const reserve=state.legacySeedReserve.slice();
  return {...state, bank:state.bank.map(seed=>seed || reserve.shift() || null),legacySeedReserve:reserve};
}
