// Filters: kind, grade, search text and sort, plus the spoiler rule.
// The official list has no online trophies, so the online filter is an
// honest empty state, not a hidden bug.
import { isEarned } from './store.js';

export function isSpoilerHidden(trophy, state) {
  return state.settings.spoiler && trophy.kind === 'story' && !isEarned(state, trophy);
}

export function filterTrophies(trophies, state, query) {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kindFilter === 'story' && t.kind !== 'story') return false;
    if (state.kindFilter === 'missable' && !t.missable) return false;
    if (state.kindFilter === 'collectibles' && t.kind !== 'collectibles') return false;
    if (state.kindFilter === 'activities' && t.kind !== 'activities') return false;
    if (state.kindFilter === 'online') return false;
    if (state.gradeFilter !== 'all' && t.grade !== state.gradeFilter) return false;
    if (state.settings.hideEarned && isEarned(state, t)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const GRADE_RANK = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export function sortTrophies(list, sort) {
  const copy = [...list];
  if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'grade') {
    copy.sort((a, b) => GRADE_RANK[a.grade] - GRADE_RANK[b.grade] || a.id - b.id);
  }
  return copy;
}

export function nextUnearned(trophies, state) {
  return trophies.find((t) => !isEarned(state, t)) ?? null;
}
