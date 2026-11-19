// Saved progress: everything the tracker remembers lives in localStorage
// under one key, and can be exported to a file and imported back.
export const STATE_KEY = 'leonida-ledger-v1';

export function defaultState() {
  return {
    earned: [],
    counts: {},
    notes: {},
    settings: { spoiler: false, hideEarned: false },
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const state = defaultState();
    if (Array.isArray(parsed.earned)) state.earned = parsed.earned.filter((n) => typeof n === 'string');
    if (parsed.counts && typeof parsed.counts === 'object') state.counts = parsed.counts;
    if (parsed.notes && typeof parsed.notes === 'object') state.notes = parsed.notes;
    if (parsed.settings && typeof parsed.settings === 'object') {
      state.settings.spoiler = Boolean(parsed.settings.spoiler);
      state.settings.hideEarned = Boolean(parsed.settings.hideEarned);
    }
    return state;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function isEarned(state, trophy) {
  return state.earned.includes(trophy.name);
}

export function toggleEarned(state, trophy) {
  const i = state.earned.indexOf(trophy.name);
  if (i === -1) state.earned.push(trophy.name);
  else state.earned.splice(i, 1);
  saveState(state);
}

export function getCount(state, trophy) {
  return state.counts[trophy.name] ?? 0;
}

export function setCount(state, trophy, value) {
  const target = trophy.target ?? Infinity;
  const clamped = Math.max(0, Math.min(target, value));
  state.counts[trophy.name] = clamped;
  saveState(state);
  return clamped;
}

export function setNote(state, trophy, text) {
  if (text.trim()) state.notes[trophy.name] = text;
  else delete state.notes[trophy.name];
  saveState(state);
}

export function exportFile(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importFile(file, knownNames) {
  const parsed = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file');
  const state = defaultState();
  if (Array.isArray(parsed.earned)) {
    state.earned = parsed.earned.filter((n) => knownNames.has(n));
  }
  if (parsed.counts && typeof parsed.counts === 'object') {
    for (const [name, value] of Object.entries(parsed.counts)) {
      if (knownNames.has(name) && Number.isFinite(value)) state.counts[name] = Math.max(0, value);
    }
  }
  if (parsed.notes && typeof parsed.notes === 'object') {
    for (const [name, text] of Object.entries(parsed.notes)) {
      if (knownNames.has(name) && typeof text === 'string') state.notes[name] = text;
    }
  }
  if (parsed.settings && typeof parsed.settings === 'object') {
    state.settings.spoiler = Boolean(parsed.settings.spoiler);
    state.settings.hideEarned = Boolean(parsed.settings.hideEarned);
  }
  saveState(state);
  return state;
}
