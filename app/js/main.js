// Boot: loads the trophy data, wires the toolbar, the tabs and the
// export/import buttons, and re-renders the tracker on every change.
import { loadTrophies } from './data.js';
import { defaultState, exportFile, importFile, loadState, saveState } from './store.js';
import { renderHeader, renderMissables, renderRoadmap, renderTracker } from './views.js';

const TABS = ['tracker', 'roadmap', 'missables', 'about'];

const ui = {
  kindFilter: 'all',
  gradeFilter: 'all',
  sort: 'order',
  search: '',
};

let doc = null;
let state = loadState();
let currentTab = 'tracker';

function rerender() {
  const viewState = { ...state, ...ui };
  renderHeader(doc.trophies, state);
  renderTracker(doc.trophies, viewState, doc, actions);
  renderRoadmap(doc.trophies, state, actions);
  renderMissables(doc.trophies, viewState, doc, actions);
}

const actions = {
  rerender,
  openTrophy(id) {
    showTab('tracker');
    requestAnimationFrame(() => {
      const card = document.querySelector(`[data-trophy-id="${id}"]`);
      if (!card) return;
      card.scrollIntoView({ block: 'center' });
      const toggle = card.querySelector('.guide-toggle');
      if (toggle && toggle.getAttribute('aria-expanded') === 'false') toggle.click();
    });
  },
};

function showTab(tab) {
  if (!TABS.includes(tab)) tab = 'tracker';
  currentTab = tab;
  for (const t of TABS) {
    document.getElementById(`view-${t}`).hidden = t !== tab;
    document.getElementById(`tab-${t}`).classList.toggle('is-active', t === tab);
  }
  if (location.hash.slice(1) !== tab) history.replaceState(null, '', `#${tab}`);
}

function wireToolbar() {
  document.getElementById('search').addEventListener('input', (e) => {
    ui.search = e.target.value;
    rerender();
  });
  document.getElementById('kindChips').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-kind]');
    if (!chip) return;
    ui.kindFilter = chip.dataset.kind;
    for (const c of document.querySelectorAll('#kindChips .chip')) {
      c.classList.toggle('is-active', c === chip);
    }
    rerender();
  });
  document.getElementById('gradeFilter').addEventListener('change', (e) => {
    ui.gradeFilter = e.target.value;
    rerender();
  });
  document.getElementById('sortFilter').addEventListener('change', (e) => {
    ui.sort = e.target.value;
    rerender();
  });
  const spoiler = document.getElementById('spoilerToggle');
  spoiler.checked = state.settings.spoiler;
  spoiler.addEventListener('change', () => {
    state.settings.spoiler = spoiler.checked;
    saveState(state);
    rerender();
  });
  const hideEarned = document.getElementById('hideEarnedToggle');
  hideEarned.checked = state.settings.hideEarned;
  hideEarned.addEventListener('change', () => {
    state.settings.hideEarned = hideEarned.checked;
    saveState(state);
    rerender();
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportFile(state));
  document.getElementById('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const knownNames = new Set(doc.trophies.map((t) => t.name));
      state = await importFile(file, knownNames);
      spoiler.checked = state.settings.spoiler;
      hideEarned.checked = state.settings.hideEarned;
      rerender();
    } catch (err) {
      alert(`Could not import that file: ${err.message}`);
    }
    e.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned ticks, counters and notes? Export first if you want a backup.')) return;
    state = defaultState();
    saveState(state);
    spoiler.checked = false;
    hideEarned.checked = false;
    rerender();
  });
  for (const t of TABS) {
    document.getElementById(`tab-${t}`).addEventListener('click', () => showTab(t));
  }
  window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
}

async function boot() {
  doc = await loadTrophies();
  wireToolbar();
  showTab(location.hash.slice(1) || 'tracker');
  rerender();
}

boot().catch((err) => {
  document.getElementById('trophyList').replaceChildren();
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = `The guide could not load its trophy data: ${err.message}`;
  document.getElementById('trophyList').append(p);
});
