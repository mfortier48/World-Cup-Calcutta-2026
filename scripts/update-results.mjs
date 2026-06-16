import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const APP_PATH = path.join(ROOT, "app.js");
const RESULTS_PATH = path.join(ROOT, "data", "results.json");
const SCORE_BUFFER_MINUTES = Number(process.env.SCORE_BUFFER_MINUTES || 135);
const SCOREBOARD_URL = process.env.ESPN_SCOREBOARD_URL
  || "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/\busa\b/i, "united states")
    .replace(/\bu\.s\.a\.\b/i, "united states")
    .replace(/\bturkiye\b/i, "turkey")
    .replace(/\btürkiye\b/i, "turkey")
    .replace(/\bcabo verde\b/i, "cape verde")
    .replace(/\bcote d'ivoire\b/i, "ivory coast")
    .replace(/\bcote divoire\b/i, "ivory coast")
    .replace(/\bkorea republic\b/i, "south korea")
    .replace(/\bir iran\b/i, "iran")
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
  const teamBlock = appSource.slice(
    appSource.indexOf("const teams = ["),
    appSource.indexOf("].map(([id, name, confederation, flag, rank])"),
  );
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

function espnDateKey(date) {
  return date.replaceAll("-", "");
}

async function readExistingResults() {
  try {
    return JSON.parse(await fs.readFile(RESULTS_PATH, "utf8"));
  } catch {
    return { version: "initial", updatedAt: null, source: "missing", matches: [] };
  }
}

async function fetchEspnScoreboard(date) {
  const url = new URL(SCOREBOARD_URL);
  url.searchParams.set("dates", espnDateKey(date));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed for ${date}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return payload.events || [];
}

function eventCompetitors(event) {
  const competitors = event.competitions?.[0]?.competitors || [];
  const home = competitors.find((competitor) => competitor.homeAway === "home");
  const away = competitors.find((competitor) => competitor.homeAway === "away");
  if (!home || !away) return null;

  return {
    home: {
      name: normalizeName(home.team?.displayName || home.team?.name),
      score: Number(home.score),
    },
    away: {
      name: normalizeName(away.team?.displayName || away.team?.name),
      score: Number(away.score),
    },
    status: event.status?.type?.shortDetail || event.competitions?.[0]?.status?.type?.shortDetail,
    completed: Boolean(event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed),
  };
}

function findEventForMatch(events, match, teams) {
  const appHome = teams[match.homeId]?.normalizedName;
  const appAway = teams[match.awayId]?.normalizedName;
  if (!appHome || !appAway) return null;

  return events.find((event) => {
    const competitors = eventCompetitors(event);
    if (!competitors) return false;
    return competitors.home.name === appHome && competitors.away.name === appAway;
  }) || events.find((event) => {
    const competitors = eventCompetitors(event);
    if (!competitors) return false;
    return competitors.home.name === appAway && competitors.away.name === appHome;
  }) || null;
}

function scoreFromEvent(event, match, teams) {
  const competitors = eventCompetitors(event);
  if (!competitors || !competitors.completed || !FINISHED_STATUSES.has(competitors.status)) return null;
  if (!Number.isFinite(competitors.home.score) || !Number.isFinite(competitors.away.score)) return null;

  const appHome = teams[match.homeId]?.normalizedName;
  const sameOrientation = competitors.home.name === appHome;

  return {
    matchNumber: match.matchNumber,
    homeGoals: sameOrientation ? competitors.home.score : competitors.away.score,
    awayGoals: sameOrientation ? competitors.away.score : competitors.home.score,
    status: competitors.status,
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
  const existingScores = existing.matches || [];
  const existingMatchNumbers = new Set(existingScores.map((score) => Number(score.matchNumber)));
  const dueMatches = schedule.filter((match) => isDue(match));
  const dates = [...new Set(dueMatches.map((match) => match.date))];
  const eventsByDate = new Map();

  for (const date of dates) {
    eventsByDate.set(date, await fetchEspnScoreboard(date));
  }

  const newScores = [];
  for (const match of dueMatches) {
    const event = findEventForMatch(eventsByDate.get(match.date) || [], match, teams);
    if (!event) continue;

    const score = scoreFromEvent(event, match, teams);
    if (!score) continue;

    const previous = existingScores.find((candidate) => Number(candidate.matchNumber) === match.matchNumber);
    if (!previous || previous.homeGoals !== score.homeGoals || previous.awayGoals !== score.awayGoals || previous.status !== score.status) {
      newScores.push(score);
    }
  }

  if (!newScores.length) {
    console.log(`No new finals. ${existingScores.length} scores already recorded.`);
    return;
  }

  const matches = mergeScores(existingScores, newScores);
  const nextPayload = {
    version: buildVersion(matches),
    updatedAt: new Date().toISOString(),
    source: "espn:fifa.world",
    matches,
  };

  await fs.writeFile(RESULTS_PATH, `${JSON.stringify(nextPayload, null, 2)}\n`);
  const added = newScores
    .filter((score) => !existingMatchNumbers.has(Number(score.matchNumber)))
    .map((score) => `M${score.matchNumber} ${score.homeGoals}-${score.awayGoals}`)
    .join(", ");
  console.log(`Updated ${RESULTS_PATH}. Added/changed: ${added || "score corrections"}.`);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
