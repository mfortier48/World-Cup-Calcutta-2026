# World Cup 2026 Calcutta Pool

A first-pass MVP for a private World Cup 2026 Calcutta pool. This version is a self-contained static app that can be opened directly in a browser or served locally.

## What It Does

- Tracks all 48 World Cup teams individually.
- Records auction owner and price for each team.
- Enforces the $150 budget visually by warning when an owner exceeds it.
- Calculates the prize pot from actual auction spend.
- Tracks team results: stage reached, group wins, group draws, goals for, goals against, and upset gap.
- Calculates projected payouts using the agreed hybrid formula.
- Saves data locally in the browser with `localStorage`.
- Loads final scores from `data/results.json` and refreshes them periodically while the app is open.

## Payout Formula

- 17%: group-stage wins
- 3%: group-stage draws
- 4.5%: Round of 32 group winners
- 3.5%: Round of 32 group runners-up
- 2%: Round of 32 third-place qualifiers
- 12%: reach Round of 16
- 12%: reach Quarterfinals
- 12%: reach Semifinals
- 8%: reach Final
- 12%: champion
- 4%: most goals scored
- 4%: best goal differential
- 3%: biggest single-match upset
- 3%: worst goal differential

## Automatic Score Updates

The site is static, so the live update path is:

1. GitHub Actions runs `.github/workflows/update-results.yml` every 15 minutes.
2. `scripts/update-results.mjs` checks games that are at least 135 minutes past kickoff.
3. Final scores are fetched from ESPN's public FIFA World Cup scoreboard feed.
4. If new finals are available, the job updates `data/results.json`, commits, and pushes.
5. Vercel redeploys from the commit.
6. Open browsers refresh `data/results.json` every 5 minutes and recalculate payouts.

No API key or GitHub secret is required. The ESPN feed is a public endpoint, so if ESPN changes its response format or coverage during the tournament, the fallback is to update `data/results.json` manually or swap in a different score provider.

## Next Production Steps

1. Add real owner names and invite-only authentication.
2. Move data from browser storage to Supabase.
3. Add commissioner roles and audit history.
4. Deploy publicly with private access on Vercel or a similar host.

## Local Use

Open `index.html` in a browser, or run a simple local server from this folder:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy To Vercel

This MVP is currently a static site, so it can deploy on Vercel's free Hobby plan without a build step.

Recommended path:

1. Put this folder in a GitHub repository.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Leave framework preset as **Other**.
5. Leave build command and output directory blank.
6. Deploy.

The first deployment will get a free Vercel URL. A custom domain can be attached later.
