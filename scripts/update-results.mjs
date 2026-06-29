import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const APP_PATH = path.join(ROOT, "app.js");
const RESULTS_PATH = path.join(ROOT, "data", "results.json");
const SCORE_BUFFER_MINUTES = Number(process.env.SCORE_BUFFER_MINUTES || 135);
const SCOREBOARD_URL = process.env.ESPN_SCOREBOARD_URL
  || "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const SCOREBOARD_DATES = process.env.ESPN_SCOREBOARD_DATES || "20260611-20260719";
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "FT-Pens"]);

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
  return [...teamBlock.matchAll(teamPattern)].map((match) => ({
    id: match[1],
    name: match[2],
    normalizedName: normalizeName(match[2]),
  }));
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

function teamLookup(teams) {
  const entries = [];
  for (const team of teams) {
    entries.push([team.normalizedName, team]);
    entries.push([team.normalizedName.replace(/\band\b/g, "").replace(/\s+/g, " ").trim(), team]);
  }
  const byId = Object.fromEntries(teams.map((team) => [team.id, team]));
  entries.push(["ivory coast", byId.civ]);
  entries.push(["south korea", byId.kor]);
  entries.push(["turkey", byId.tur]);
  entries.push(["cape verde", byId.cpv]);
  entries.push(["bosnia herzegovina", byId.bih]);
  return new Map(entries.filter((entry) => entry[1]));
}

async function fetchEspnScoreboard(date = SCOREBOARD_DATES) {
  const url = new URL(SCOREBOARD_URL);
  url.searchParams.set("dates", date.includes("-") ? date : espnDateKey(date));
  url.searchParams.set("limit", "200");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed for ${date}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return payload.events || [];
}

function easternDateTime(isoValue) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(isoValue));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hour = values.hour === "24" ? "00" : values.hour;
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${hour}:${values.minute} ET`,
  };
}

function eventCompetitors(event) {
  const competitors = event.competitions?.[0]?.competitors || [];
  const home = competitors.find((competitor) => competitor.homeAway === "home");
  const away = competitors.find((competitor) => competitor.homeAway === "away");
  if (!home || !away) return null;

  return {
    home: {
      name: normalizeName(home.team?.displayName || home.team?.name),
      rawName: home.team?.displayName || home.team?.name,
      score: Number(home.score),
      winner: Boolean(home.winner),
    },
    away: {
      name: normalizeName(away.team?.displayName || away.team?.name),
      rawName: away.team?.displayName || away.team?.name,
      score: Number(away.score),
      winner: Boolean(away.winner),
    },
    status: event.status?.type?.shortDetail || event.competitions?.[0]?.status?.type?.shortDetail,
    completed: Boolean(event.status?.type?.completed || event.competitions?.[0]?.status?.type?.completed),
  };
}

function eventStage(event) {
  const note = event.competitions?.[0]?.altGameNote || "";
  if (/Group [A-L]/.test(note)) return "group";
  if (/Round of 32/i.test(note)) return "r32";
  if (/Round of 16|Rd of 16/i.test(note)) return "r16";
  if (/Quarterfinal/i.test(note)) return "qf";
  if (/Semifinal/i.test(note)) return "sf";
  if (/Final/i.test(note)) return "final";
  return "knockout";
}

function eventGroup(event) {
  const note = event.competitions?.[0]?.altGameNote || "";
  return note.match(/Group ([A-L])/)?.[1] || "";
}

function winnerIdFromCompetitors(competitors, homeTeam, awayTeam) {
  if (competitors.home.winner) return homeTeam.id;
  if (competitors.away.winner) return awayTeam.id;
  if (competitors.home.score > competitors.away.score) return homeTeam.id;
  if (competitors.away.score > competitors.home.score) return awayTeam.id;
  return "";
}

function buildEventMatches(events, schedule, teams) {
  const lookup = teamLookup(teams);
  const staticGroupMatches = new Map(schedule.map((match) => [`${match.homeId}|${match.awayId}`, match]));
  const nextMatchNumber = { value: Math.max(...schedule.map((match) => Number(match.matchNumber))) + 1 };
  const mapped = [];

  for (const event of [...events].sort((a, b) => new Date(a.date) - new Date(b.date))) {
    const competitors = eventCompetitors(event);
    if (!competitors) continue;

    const homeTeam = lookup.get(competitors.home.name);
    const awayTeam = lookup.get(competitors.away.name);
    if (!homeTeam || !awayTeam) {
      console.warn(`Skipping unmapped ESPN event: ${competitors.home.rawName} vs ${competitors.away.rawName}`);
      continue;
    }

    const stage = eventStage(event);
    const staticMatch = stage === "group" ? staticGroupMatches.get(`${homeTeam.id}|${awayTeam.id}`) : null;
    const dateTime = easternDateTime(event.date);
    const matchNumber = staticMatch?.matchNumber || nextMatchNumber.value++;
    const competition = event.competitions?.[0] || {};

    mapped.push({
      espnId: event.id,
      matchNumber,
      date: dateTime.date,
      time: dateTime.time,
      stage,
      group: eventGroup(event),
      homeId: homeTeam.id,
      awayId: awayTeam.id,
      venue: competition.venue?.fullName || competition.venue?.displayName || "",
      status: competitors.status || "Scheduled",
      completed: competitors.completed,
      homeGoals: Number.isFinite(competitors.home.score) ? competitors.home.score : 0,
      awayGoals: Number.isFinite(competitors.away.score) ? competitors.away.score : 0,
      winnerId: winnerIdFromCompetitors(competitors, homeTeam, awayTeam),
    });
  }

  return mapped;
}

function scoreFromEventMatch(eventMatch) {
  if (!eventMatch.completed || !FINISHED_STATUSES.has(eventMatch.status)) return null;
  if (!Number.isFinite(eventMatch.homeGoals) || !Number.isFinite(eventMatch.awayGoals)) return null;
  const score = {
    matchNumber: eventMatch.matchNumber,
    homeGoals: eventMatch.homeGoals,
    awayGoals: eventMatch.awayGoals,
    status: eventMatch.status,
  };
  if (eventMatch.winnerId) score.winnerId = eventMatch.winnerId;
  return score;
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
  const eventMatches = buildEventMatches(await fetchEspnScoreboard(), schedule, teams);
  const eventsChanged = JSON.stringify(existing.events || []) !== JSON.stringify(eventMatches);
  const newScores = eventMatches
    .filter((match) => isDue(match))
    .map((match) => scoreFromEventMatch(match))
    .filter(Boolean)
    .filter((score) => {
      const previous = existingScores.find((candidate) => Number(candidate.matchNumber) === score.matchNumber);
      return !previous
        || previous.homeGoals !== score.homeGoals
        || previous.awayGoals !== score.awayGoals
        || previous.status !== score.status
        || (previous.winnerId || "") !== (score.winnerId || "");
    });

  if (!newScores.length && !eventsChanged) {
    console.log(`No new finals. ${existingScores.length} scores already recorded.`);
    return;
  }

  const matches = mergeScores(existingScores, newScores);
  const nextPayload = {
    version: buildVersion(matches),
    updatedAt: new Date().toISOString(),
    source: "espn:fifa.world",
    matches,
    events: eventMatches,
  };

  await fs.writeFile(RESULTS_PATH, `${JSON.stringify(nextPayload, null, 2)}\n`);
  const added = newScores
    .filter((score) => !existingMatchNumbers.has(Number(score.matchNumber)))
    .map((score) => `M${score.matchNumber} ${score.homeGoals}-${score.awayGoals}`)
    .join(", ");
  console.log(`Updated ${RESULTS_PATH}. Added/changed: ${added || (eventsChanged ? "event schedule" : "score corrections")}.`);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
