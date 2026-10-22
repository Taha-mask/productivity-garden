const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const time = value => Number.isFinite(value) && value >= 0;
export const emptyStep = () => ({ schemaVersion: 1, active: null });
export function validateStep(state) {
  if (!object(state) || state.schemaVersion !== 1) return false;
  const a = state.active;
  return a === null || (object(a) && ['react', 'standalone'].includes(a.entry)
    && (a.entry === 'react' ? Number.isSafeInteger(a.taskId) && a.taskId > 0 : typeof a.taskId === 'string' && a.taskId.length > 0)
    && typeof a.step === 'string' && a.step.length <= 240 && time(a.selectedAt)
    && (a.taskCreatedAt === undefined || time(a.taskCreatedAt))
    && (a.startedAt === null || time(a.startedAt)));
}
export function stepTransition(state, action) {
  if (!validateStep(state)) throw new TypeError('Invalid meaningful step state');
  let next;
  switch (action.type) {
    case 'CHOOSE':
      if (!time(action.taskCreatedAt)) throw new TypeError('Task creation time is required');
      if (state.active?.entry === action.entry && state.active?.taskId === action.taskId
        && state.active.taskCreatedAt === action.taskCreatedAt) return state;
      next = { schemaVersion: 1, active: { entry: action.entry, taskId: action.taskId,
        taskCreatedAt: action.taskCreatedAt, step: '', selectedAt: action.now, startedAt: null } };
      break;
    case 'EDIT':
      if (!state.active) return state;
      if (action.text !== undefined && typeof action.text !== 'string') throw new TypeError('Step must be text');
      next = { ...state, active: { ...state.active, step: (action.text ?? '').trim() } };
      break;
    case 'START':
      if (!state.active || state.active.startedAt !== null) return state;
      next = { ...state, active: { ...state.active, startedAt: action.now } };
      break;
    case 'CLEAR': return emptyStep();
    default: throw new TypeError('Unknown meaningful step action');
  }
  if (!validateStep(next)) throw new TypeError('Invalid meaningful step action');
  return next;
}
// Entry and ID type both matter: the two gardens never share task identity.
export function resolveStep(state, entry, plants) {
  if (!validateStep(state) || state.active?.entry !== entry || !Array.isArray(plants)) return null;
  // Older choices lacking the fingerprint stay saved, but need explicit reselection.
  if (!time(state.active.taskCreatedAt)) return null;
  return plants.find(p => p.id === state.active.taskId
    && (entry === 'react' ? p.plantedAt : p.created) === state.active.taskCreatedAt
    && (entry === 'react' ? p.matureId === null : p.done === false)) ?? null;
}
