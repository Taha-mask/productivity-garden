import { REACT } from '../../shared/game/profiles.js';
import { transition } from '../../shared/game/transitions.js';
export { isStuck } from '../../shared/game/transitions.js';
export const gardenReducer = (state, action) => transition(state, action, REACT);
