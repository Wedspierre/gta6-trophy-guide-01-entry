[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Wedspierre/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Wedspierre/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/competitions/gta6-trophy-guide-01)

# Leonida Ledger — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: the official list (1 platinum, 2 gold, 6 silver, 46 bronze), a checklist saved in the browser, export/import, filters by kind, a spoiler setting, a six-stage roadmap to the platinum, the 14 missable trophies flagged, and a cited guide for every trophy — all in our own words, built from the official descriptions.

Built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/competitions/gta6-trophy-guide-01) by **Wedspierre**. Referral: `ta01qs0h`.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

No build step, no network: open `app/index.html` in a desktop browser with the network off and it works. Your progress lives in the browser only (localStorage) and can be exported to a file and imported back.

## Layout

- `app/` — the guide itself: `index.html`, `style.css`, `js/` (boot, data, store, filters, views) and `app/data/trophies.json` (the official 55 with our guides)
- `screenshots/` — 4 real renders of the guide in a browser
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `vendor/makefun-frontend.ts` — the kit's library, unchanged

## Honesty note

GTA VI released 19 November 2026, the day this guide was built, so no guide here has been checked in the game yet. Every guide is written from the trophy's official description and the counts PlayStation tracks, and where a place or step is not pinned down by the official description the guide says so instead of guessing. Sources: [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) (official list) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) (counts). Unofficial and fan-made; not affiliated with Rockstar Games or PlayStation. MIT licensed.
