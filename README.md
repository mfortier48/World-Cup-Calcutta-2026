# World Cup 2026 Calcutta Pool

A first-pass MVP for a private World Cup 2026 Calcutta pool. This version is a self-contained static app that can be opened directly in a browser or served locally.

## What It Does

- Tracks all 48 World Cup teams individually.
- Records auction owner and price for each team.
- Enforces the $150 budget visually by warning when an owner exceeds it.
- Calculates the prize pot from actual auction spend.
- Tracks manual team results: stage reached, group wins, group draws, goals for, and goals against.
- Calculates projected payouts using the agreed hybrid formula.
- Saves data locally in the browser with `localStorage`.

## Payout Formula

- 15%: group-stage wins
- 5%: group-stage draws
- 8%: reach Round of 32
- 10%: reach Round of 16
- 12%: reach Quarterfinals
- 12%: reach Semifinals
- 8%: reach Final
- 15%: champion
- 5%: most goals scored
- 4%: best goal differential
- 3%: biggest single-match win
- 3%: worst goal differential

## Next Production Steps

1. Add real owner names and invite-only authentication.
2. Move data from browser storage to Supabase.
3. Add commissioner roles and audit history.
4. Add a scheduled live-results sync job.
5. Deploy publicly with private access on Vercel or a similar host.

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
