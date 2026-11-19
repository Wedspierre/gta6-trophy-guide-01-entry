// Views: the tracker list, the roadmap, the missables page and the header
// progress — all rendered from the trophy data and the saved state.
import { getCount, isEarned, setCount, setNote, toggleEarned } from './store.js';
import { ROADMAP_STAGES, KIND_LABELS } from './data.js';
import { filterTrophies, isSpoilerHidden, nextUnearned, sortTrophies } from './filters.js';

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatTarget(trophy) {
  if (trophy.target === null || trophy.target === undefined) return '';
  const n = trophy.target.toLocaleString('en-US');
  return trophy.id === 52 || trophy.id === 53 ? `$${n}` : n;
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function trophyCard(trophy, state, doc, actions) {
  const li = el('li', 'trophy');
  li.dataset.trophyId = String(trophy.id);
  if (isEarned(state, trophy)) li.classList.add('is-earned');
  const hidden = isSpoilerHidden(trophy, state);

  const head = el('div', 'trophy-head');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned(state, trophy);
  box.setAttribute('aria-label', `Earned: ${trophy.name}`);
  box.addEventListener('change', () => {
    toggleEarned(state, trophy);
    actions.rerender();
  });
  head.append(box);

  const main = el('div', 'trophy-main');
  const name = el('div', 'trophy-name');
  name.append(el('span', 'num', `${trophy.id}.`));
  name.append(document.createTextNode(hidden ? 'Hidden story trophy' : trophy.name));
  main.append(name);
  main.append(el('p', 'trophy-desc', hidden ? 'Hidden until earned — tick it off once it pops on your PlayStation.' : trophy.description));

  const tags = el('div', 'tags');
  tags.append(el('span', `tag kind-${trophy.kind}`, KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.missable) tags.append(el('span', 'tag missable', 'Missable'));
  if (hidden) tags.append(el('span', 'tag spoilered', 'Spoiler hidden'));
  main.append(tags);

  if (trophy.target !== null && trophy.target !== undefined) {
    const counter = el('div', 'counter');
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', `Decrease count for ${trophy.name}`);
    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', `Increase count for ${trophy.name}`);
    const label = el('span', '', `${getCount(state, trophy).toLocaleString('en-US')} / ${formatTarget(trophy)}`);
    minus.addEventListener('click', () => {
      setCount(state, trophy, getCount(state, trophy) - 1);
      actions.rerender();
    });
    plus.addEventListener('click', () => {
      setCount(state, trophy, getCount(state, trophy) + 1);
      actions.rerender();
    });
    counter.append(minus, label, plus);
    main.append(counter);
  }

  if (!hidden) {
    const toggle = el('button', 'guide-toggle', 'Show guide & sources');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    const detail = el('div', 'detail');
    detail.hidden = true;
    toggle.addEventListener('click', () => {
      const open = detail.hidden;
      detail.hidden = !open;
      toggle.textContent = open ? 'Hide guide & sources' : 'Show guide & sources';
      toggle.setAttribute('aria-expanded', String(open));
      if (open && !detail.hasChildNodes()) buildDetail(detail, trophy, state, doc);
    });
    main.append(toggle, detail);
  }
  head.append(main);

  const badge = el('span', `grade-badge grade-${trophy.grade}`, gradeLabel(trophy.grade));
  head.append(badge);
  li.append(head);
  return li;
}

function buildDetail(detail, trophy, state, doc) {
  detail.append(el('h3', '', 'Guide'));
  detail.append(el('p', '', trophy.guide));
  if (trophy.missable && trophy.missableNote) {
    detail.append(el('p', 'missable-note', `Missable: ${trophy.missableNote}`));
  }
  const stage = ROADMAP_STAGES.find((s) => s.n === trophy.stage);
  if (stage) detail.append(el('p', 'stage-note', `Roadmap: stage ${stage.n} — ${stage.title}.`));
  detail.append(el('h3', '', 'Sources'));
  const list = el('ul', 'source-list');
  for (const s of doc.sources ?? []) {
    const item = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.label;
    a.target = '_blank';
    a.rel = 'noopener';
    item.append(a);
    list.append(item);
  }
  detail.append(list);
  detail.append(el('p', 'honesty', 'Guide written in our own words from the official description; not yet checked in the game (released 19 Nov 2026).'));
  const noteLabel = el('label', 'note-label', 'Your note');
  const note = document.createElement('textarea');
  note.className = 'note-field';
  note.placeholder = 'Where you found it, what worked, what to retry…';
  note.value = state.notes[trophy.name] ?? '';
  note.addEventListener('change', () => setNote(state, trophy, note.value));
  noteLabel.append(note);
  detail.append(noteLabel);
}

export function renderHeader(trophies, state) {
  const earned = trophies.filter((t) => isEarned(state, t)).length;
  document.getElementById('earnedCount').textContent = String(earned);
  const fill = document.getElementById('progressFill');
  fill.style.width = `${(earned / trophies.length) * 100}%`;
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
  const counts = {};
  for (const t of trophies) if (isEarned(state, t)) counts[t.grade] = (counts[t.grade] ?? 0) + 1;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map(
    (g) => `${counts[g] ?? 0} ${g}`,
  );
  document.getElementById('gradeCounts').textContent = parts.join(' · ');
  const next = nextUnearned(trophies, state);
  document.getElementById('nextUp').textContent = next
    ? `Next up: ${next.name}`
    : 'Platinum earned — Leonida Legend.';
}

export function renderTracker(trophies, state, doc, actions) {
  const list = document.getElementById('trophyList');
  const visible = sortTrophies(filterTrophies(trophies, state, state.search ?? ''), state.sort ?? 'order');
  list.replaceChildren();
  for (const t of visible) list.append(trophyCard(t, state, doc, actions));
  document.getElementById('emptyState').hidden = visible.length > 0;
  const shown = visible.length;
  const earnedShown = visible.filter((t) => isEarned(state, t)).length;
  document.getElementById('listMeta').textContent =
    state.kindFilter === 'online'
      ? 'The official list has no online trophies — every trophy is earned in single-player.'
      : `Showing ${shown} of ${trophies.length} trophies (${earnedShown} earned in this view).`;
}

export function renderRoadmap(trophies, state, actions) {
  const list = document.getElementById('stageList');
  list.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const li = el('li', 'stage');
    const head = el('div', 'stage-head');
    head.append(el('span', 'stage-num', String(stage.n)));
    head.append(el('h2', '', stage.title));
    const done = stage.ids.filter((id) => isEarned(state, byId.get(id))).length;
    head.append(el('span', 'stage-progress', `${done} / ${stage.ids.length} earned`));
    li.append(head);
    li.append(el('p', '', stage.text));
    const bar = el('div', 'bar');
    const fill = el('span', '');
    fill.style.width = `${(done / stage.ids.length) * 100}%`;
    bar.append(fill);
    li.append(bar);
    const chips = el('div', 'stage-trophies');
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (!t) continue;
      const chip = el('button', 'stage-trophy', t.name);
      chip.type = 'button';
      if (isEarned(state, t)) chip.classList.add('is-earned');
      if (t.missable) chip.classList.add('is-missable');
      chip.addEventListener('click', () => actions.openTrophy(t.id));
      chips.append(chip);
    }
    li.append(chips);
    list.append(li);
  }
}

export function renderMissables(trophies, state, doc, actions) {
  const list = document.getElementById('missableList');
  list.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    list.append(trophyCard(t, state, doc, actions));
  }
}
