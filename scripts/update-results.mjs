import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const APP_PATH = path.join(ROOT, "app.js");
const RESULTS_PATH = path.join(ROOT, "data", "results.json");
const API_KEY = process.env.API_FOOTBALL_KEY;
const API_HOST = process.env.API_FOOTBALL_HOST || "v3.football.api-sports.io";
const API_LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID || "1";
const API_SEASON = process.env.API_FOOTBALL_SEASON || "2026";
const SCORE_BUFFER_MINUTES = Number(process.env.SCORE_BUFFER_MINUTES || 135);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/\busa\b/i, "united states")
    .replace(/\bu\.s\.a\.\b/i, "united states")
    .replace(/\bturkiye\b/i, "turkey")
    .replace(/\bturkiye\b/i, "turkey")
    .replace(/\btürkiye\b/i, "turkey")
    .replace(/\bcote d'ivoire\b/i, "ivory coast")
    .replace(/\bcote divoire\b/i, "ivory coast")
    .replace(/\bkorea republic\b/i, "south korea")
    .replace(/\bir iran\b/i, "iran")
    .replace(/\bcuracao\b/i, "curacao")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseSchedule(appSource) {
  const matchPattern = /\[(\d+), "([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"\]/g;
  return [...appSource.matchAll(matchPattern)].map((match) => ({
    matchNumber: Number(match[1]),
    date: match[2],
    time: match[3],
    group: match[4],
    homeId: match[5],
    awayId: match[6],
    venue: match[7],
  }));
}

function parseTeams(appSource) {
  const teamBlock = appSource.slice(appSource.indexOf("const teams = ["), appSource.indexOf("].map(([id, name, confederation, flag, rank])"));
  const teamPattern = /\["([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", (\d+)\]/g;
  return Object.fromEntries([...teamBlock.matchAll(teamPattern)].map((match) => [
    match[1],
    {
      id: match[1],
      name: match[2],
      normalizedName: normalizeName(match[2]),
    },
  ]));
}

function kickoffDate(match) {
  const [hour, minute] = match.time.replace(" ET", "").split(":").map(Number);
  return new Date(`${match.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-04:00`);
}

function isDue(match, now = new Date()) {
  return now.getTime() >= kickoffDate(match).getTime() + (SCORE_BUFFER_MINUTES * 60 * 1000);
}

async function readExistingResults() {
  try {
    return JSON.parse(await fs.readFile(RESULTS_PATH, "utf8"));
  } catch {
    return { version: "initial", updatedAt: null, source: "missing", matches: [] };
  }
}

async function fetchFixtures() {
  if (!API_KEY) {
    console.log("API_FOOTBALL_KEY is not set. Skipping score update.");
    return [];
  }

  const url = new URL(`https://${API_HOST}/fixtures`);
  url.searchParams.set("league", API_LEAGUE_ID);
  url.searchParams.set("season", API_SEASON);

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (payload.errors && Object.keys(payload.errors).length) {
    throw new Error(`API-Football returned errors: ${JSON.stringify(payload.errors)}`);
  }

  return payload.response || [];
}

function fixtureTeams(fixture) {
  return {
    home: normalizeName(fixture.teams?.home?.name),
    away: normalizeName(fixture.teams?.away?.name),
  };
}

function findFixtureForMatch(fixtures, match, teams) {
  const homeName = teams[match.homeId]?.normalizedName;
  const awayName = teams[match.awayId]?.normalizedName;
  if (!homeName || !awayName) return null;

  return fixtures.find((fixture) => {
    const provider = fixtureTeams(fixture);
    return provider.home === homeName && provider.away === awayName;
  }) || fixtures.find((fixture) => {
    const provider = fixtureTeams(fixture);
    return provider.home === awayName && provider.away === homeName;
  }) || null;
}

function scoreFromFixture(fixture, match, teams) {
  const status = fixture.fixture?.status?.short;
  if (!FINISHED_STATUSES.has(status)) return null;
  if (!Number.isFinite(Number(fixture.goals?.home)) || !Number.isFinite(Number(fixture.goals?.away))) return null;

  const provider = fixtureTeams(fixture);
  const appHome = teams[match.homeId]?.normalizedName;
  const sameOrientation = provider.home === appHome;

  return {
    matchNumber: match.matchNumber,
    homeGoals: Number(sameOrientation ? fixture.goals.home : fixture.goals.away),
    awayGoals: Number(sameOrientation ? fixture.goals.away : fixture.goals.home),
    status,
  };
}

function mergeScores(existingScores, newScores) {
  const byMatch = new Map(existingScores.map((score) => [Number(score.matchNumber), score]));
  for (const score of newScores) {
    byMatch.set(Number(score.matchNumber), score);
  }
  return [...byMatch.values()].sort((a, b) => Number(a.matchNumber) - Number(b.matchNumber));
}

function buildVersion(scores) {
  const lastMatch = scores.reduce((max, score) => Math.max(max, Number(score.matchNumber)), 0);
  const date = new Date().toISOString().slice(0, 10);
  return `${date}-match-${lastMatch}`;
}

async function main() {
  const appSource = await fs.readFile(APP_PATH, "utf8");
  const schedule = parseSchedule(appSource);
  const teams = parseTeams(appSource);
  const existing = await readExistingResults();
  const fixtures = await fetchFixtures();
  if (!fixtures.length) return;

  const existingMatchNumbers = new Set((existing.matches || []).map((score) => Number(score.matchNumber)));
  const dueMatches = schedule.filter((match) => isDue(match));
  const newScores = [];

  for (const match of dueMatches) {
    const fixture = findFixtureForMatch(fixtures, match, teams);
    if (!fixture) continue;
    const score = scoreFromFixture(fixture, match, teams);
    if (!score) continue;

    const previous = (existing.matches || []).find((candidate) => Number(candidate.matchNumber) === match.matchNumber);
    if (!previous || previous.homeGoals !== score.homeGoals || previous.awayGoals !== score.awayGoals || previous.status !== score.status) {
      newScores.push(score);
    }
  }

  if (!newScores.length) {
    console.log(`No new finals. ${existing.matches?.length || 0} scores already recorded.`);
    return;
  }

  const matches = mergeScores(existing.matches || [], newScores);
  const nextPayload = {
    version: buildVersion(matches),
    updatedAt: new Date().toISOString(),
    source: `api-football:${API_LEAGUE_ID}:${API_SEASON}`,
    matches,
  };

  await fs.writeFile(RESULTS_PATH, `${JSON.stringify(nextPayload, null, 2)}\n`);
  const added = newScores
    .filter((score) => !existingMatchNumbers.has(Number(score.matchNumber)))
    .map((score) => `M${score.matchNumber} ${score.homeGoals}-${score.awayGoals}`)
    .join(", ");
  console.log(`Updated ${RESULTS_PATH}. Added/changed: ${added || "score corrections"}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
