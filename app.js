const BUDGET_CAP = 150;
const STORAGE_KEY = "calcuttaStateDraft20260609Final12";
const SCENARIO_KEY = "calcuttaScenarioCalculatorV1";
const RESULTS_URL = "./data/results.json";
const RESULTS_REFRESH_MS = 5 * 60 * 1000;
const FALLBACK_RESULTS_VERSION = "2026-06-14-match-11";
const ESTIMATED_DRAW_TEAM_RESULTS = 36;

const players = [
  "Meli",
  "Eva",
  "Sarah",
  "Hillary",
  "Gabo",
  "Tommy",
  "Fabrice",
  "Zach",
  "Matt",
  "Sergio",
  "Ellie & Greg",
  "Juan Pablo",
];

const stages = [
  { value: "group", label: "Group Stage", rank: 0 },
  { value: "r32", label: "Round of 32", rank: 1 },
  { value: "r16", label: "Round of 16", rank: 2 },
  { value: "qf", label: "Quarterfinals", rank: 3 },
  { value: "sf", label: "Semifinals", rank: 4 },
  { value: "final", label: "Final", rank: 5 },
  { value: "champion", label: "Champion", rank: 6 },
];

const groupFinishes = [
  { value: "", label: "Not advanced" },
  { value: "winner", label: "Group winner" },
  { value: "runnerUp", label: "Group runner-up" },
  { value: "third", label: "Third-place qualifier" },
];

const groupResultOptions = [
  { value: "loss", label: "Loss" },
  { value: "draw", label: "Draw" },
  { value: "win", label: "Win" },
];

const sidePotOptions = [
  { key: "mostGoals", label: "Most goals scored" },
  { key: "bestDiff", label: "Best goal differential" },
  { key: "biggestUpset", label: "Biggest single-match upset" },
  { key: "worstDiff", label: "Worst goal differential" },
];

const payoutRules = [
  { key: "wins", label: "Group-stage wins", pct: 17, type: "unit", field: "wins" },
  { key: "draws", label: "Group-stage draws", pct: 3, type: "unit", field: "draws" },
  { key: "r32Winner", label: "Round of 32: group winners", pct: 4.5, type: "groupFinish", finish: "winner" },
  { key: "r32RunnerUp", label: "Round of 32: group runners-up", pct: 3.5, type: "groupFinish", finish: "runnerUp" },
  { key: "r32Third", label: "Round of 32: third-place qualifiers", pct: 2, type: "groupFinish", finish: "third" },
  { key: "r16", label: "Reach Round of 16", pct: 12, type: "stage", stage: "r16" },
  { key: "qf", label: "Reach Quarterfinals", pct: 12, type: "stage", stage: "qf" },
  { key: "sf", label: "Reach Semifinals", pct: 12, type: "stage", stage: "sf" },
  { key: "final", label: "Reach Final", pct: 8, type: "stage", stage: "final" },
  { key: "champion", label: "Champion", pct: 12, type: "stage", stage: "champion" },
  { key: "mostGoals", label: "Most goals scored", pct: 4, type: "max", field: "gf" },
  { key: "bestDiff", label: "Best goal differential", pct: 4, type: "max", field: "gd" },
  { key: "biggestUpset", label: "Biggest single-match upset", pct: 3, type: "max", field: "biggestUpset" },
  { key: "worstDiff", label: "Worst goal differential", pct: 3, type: "min", field: "gd" },
];

const teams = [
  ["arg", "Argentina", "CONMEBOL", "🇦🇷", 1],
  ["aus", "Australia", "AFC", "🇦🇺", 27],
  ["aut", "Austria", "UEFA", "🇦🇹", 24],
  ["bel", "Belgium", "UEFA", "🇧🇪", 9],
  ["bih", "Bosnia and Herzegovina", "UEFA", "🇧🇦", 64],
  ["bra", "Brazil", "CONMEBOL", "🇧🇷", 6],
  ["can", "Canada", "CONCACAF", "🇨🇦", 30],
  ["cpv", "Cabo Verde", "CAF", "🇨🇻", 67],
  ["col", "Colombia", "CONMEBOL", "🇨🇴", 13],
  ["cod", "Congo DR", "CAF", "🇨🇩", 46],
  ["crc", "Curacao", "CONCACAF", "🇨🇼", 82],
  ["cro", "Croatia", "UEFA", "🇭🇷", 11],
  ["cze", "Czechia", "UEFA", "🇨🇿", 40],
  ["ecu", "Ecuador", "CONMEBOL", "🇪🇨", 23],
  ["egy", "Egypt", "CAF", "🇪🇬", 29],
  ["eng", "England", "UEFA", "🏴", 4],
  ["fra", "France", "UEFA", "🇫🇷", 3],
  ["ger", "Germany", "UEFA", "🇩🇪", 10],
  ["gha", "Ghana", "CAF", "🇬🇭", 73],
  ["hai", "Haiti", "CONCACAF", "🇭🇹", 83],
  ["irn", "IR Iran", "AFC", "🇮🇷", 20],
  ["irq", "Iraq", "AFC", "🇮🇶", 57],
  ["civ", "Cote d'Ivoire", "CAF", "🇨🇮", 33],
  ["jpn", "Japan", "AFC", "🇯🇵", 18],
  ["jor", "Jordan", "AFC", "🇯🇴", 63],
  ["kor", "Korea Republic", "AFC", "🇰🇷", 25],
  ["mex", "Mexico", "CONCACAF", "🇲🇽", 14],
  ["mar", "Morocco", "CAF", "🇲🇦", 7],
  ["ned", "Netherlands", "UEFA", "🇳🇱", 8],
  ["nzl", "New Zealand", "OFC", "🇳🇿", 85],
  ["nor", "Norway", "UEFA", "🇳🇴", 31],
  ["pan", "Panama", "CONCACAF", "🇵🇦", 34],
  ["par", "Paraguay", "CONMEBOL", "🇵🇾", 41],
  ["por", "Portugal", "UEFA", "🇵🇹", 5],
  ["qat", "Qatar", "AFC", "🇶🇦", 56],
  ["ksa", "Saudi Arabia", "AFC", "🇸🇦", 61],
  ["sco", "Scotland", "UEFA", "🏴", 42],
  ["sen", "Senegal", "CAF", "🇸🇳", 15],
  ["rsa", "South Africa", "CAF", "🇿🇦", 60],
  ["esp", "Spain", "UEFA", "🇪🇸", 2],
  ["swe", "Sweden", "UEFA", "🇸🇪", 38],
  ["sui", "Switzerland", "UEFA", "🇨🇭", 19],
  ["tun", "Tunisia", "CAF", "🇹🇳", 45],
  ["tur", "Turkiye", "UEFA", "🇹🇷", 22],
  ["uru", "Uruguay", "CONMEBOL", "🇺🇾", 16],
  ["usa", "United States", "CONCACAF", "🇺🇸", 17],
  ["uzb", "Uzbekistan", "AFC", "🇺🇿", 50],
  ["alg", "Algeria", "CAF", "🇩🇿", 28],
].map(([id, name, confederation, flag, rank]) => ({ id, name, confederation, flag, rank }));

const draftAuction = {
  arg: { owner: "Eva", price: 80 },
  aus: { owner: "Fabrice", price: 13 },
  aut: { owner: "Tommy", price: 26 },
  bel: { owner: "Fabrice", price: 40 },
  bih: { owner: "Hillary", price: 13 },
  bra: { owner: "Meli", price: 70 },
  can: { owner: "Ellie & Greg", price: 15 },
  cpv: { owner: "Gabo", price: 10 },
  col: { owner: "Tommy", price: 45 },
  cod: { owner: "Ellie & Greg", price: 8 },
  crc: { owner: "Sergio", price: 5 },
  cro: { owner: "Juan Pablo", price: 45 },
  cze: { owner: "Fabrice", price: 11 },
  ecu: { owner: "Ellie & Greg", price: 40 },
  egy: { owner: "Tommy", price: 42 },
  eng: { owner: "Zach", price: 70 },
  fra: { owner: "Gabo", price: 95 },
  ger: { owner: "Hillary", price: 45 },
  gha: { owner: "Sarah", price: 8 },
  hai: { owner: "Hillary", price: 5 },
  irn: { owner: "Fabrice", price: 20 },
  irq: { owner: "Gabo", price: 6 },
  civ: { owner: "Meli", price: 15 },
  jpn: { owner: "Matt", price: 35 },
  jor: { owner: "Gabo", price: 6 },
  kor: { owner: "Ellie & Greg", price: 20 },
  mex: { owner: "Sergio", price: 65 },
  mar: { owner: "Zach", price: 70 },
  ned: { owner: "Sarah", price: 70 },
  nzl: { owner: "Sarah", price: 10 },
  nor: { owner: "Ellie & Greg", price: 25 },
  pan: { owner: "Fabrice", price: 8 },
  par: { owner: "Matt", price: 15 },
  por: { owner: "Hillary", price: 65 },
  qat: { owner: "Fabrice", price: 6 },
  ksa: { owner: "Fabrice", price: 3 },
  sco: { owner: "Sarah", price: 26 },
  sen: { owner: "Fabrice", price: 29 },
  rsa: { owner: "Fabrice", price: 6 },
  esp: { owner: "Matt", price: 80 },
  swe: { owner: "Sarah", price: 13 },
  sui: { owner: "Meli", price: 60 },
  tun: { owner: "Gabo", price: 23 },
  tur: { owner: "Tommy", price: 35 },
  uru: { owner: "Juan Pablo", price: 55 },
  usa: { owner: "Sergio", price: 40 },
  uzb: { owner: "Ellie & Greg", price: 8 },
  alg: { owner: "Matt", price: 13 },
};

const groupMatches = [
  [1, "2026-06-11", "15:00 ET", "A", "mex", "rsa", "Mexico City"],
  [2, "2026-06-11", "22:00 ET", "A", "kor", "cze", "Guadalajara"],
  [3, "2026-06-12", "15:00 ET", "B", "can", "bih", "Toronto"],
  [4, "2026-06-12", "21:00 ET", "D", "usa", "par", "Los Angeles"],
  [8, "2026-06-13", "15:00 ET", "B", "qat", "sui", "San Francisco Bay Area"],
  [5, "2026-06-13", "18:00 ET", "C", "bra", "mar", "New York/New Jersey"],
  [6, "2026-06-13", "21:00 ET", "C", "hai", "sco", "Boston"],
  [7, "2026-06-14", "00:00 ET", "D", "aus", "tur", "Vancouver"],
  [9, "2026-06-14", "13:00 ET", "E", "ger", "crc", "Houston"],
  [10, "2026-06-14", "16:00 ET", "F", "ned", "jpn", "Dallas"],
  [11, "2026-06-14", "19:00 ET", "E", "civ", "ecu", "Philadelphia"],
  [12, "2026-06-14", "22:00 ET", "F", "swe", "tun", "Monterrey"],
  [13, "2026-06-15", "12:00 ET", "H", "esp", "cpv", "Atlanta"],
  [14, "2026-06-15", "15:00 ET", "G", "bel", "egy", "Seattle"],
  [15, "2026-06-15", "18:00 ET", "H", "ksa", "uru", "Miami"],
  [16, "2026-06-15", "21:00 ET", "G", "irn", "nzl", "Los Angeles"],
  [17, "2026-06-16", "15:00 ET", "I", "fra", "sen", "New York/New Jersey"],
  [18, "2026-06-16", "18:00 ET", "I", "irq", "nor", "Boston"],
  [19, "2026-06-16", "21:00 ET", "J", "arg", "alg", "Kansas City"],
  [20, "2026-06-17", "00:00 ET", "J", "aut", "jor", "San Francisco Bay Area"],
  [21, "2026-06-17", "13:00 ET", "K", "por", "cod", "Houston"],
  [22, "2026-06-17", "16:00 ET", "L", "eng", "cro", "Dallas"],
  [23, "2026-06-17", "19:00 ET", "L", "gha", "pan", "Toronto"],
  [24, "2026-06-17", "22:00 ET", "K", "uzb", "col", "Mexico City"],
  [25, "2026-06-18", "12:00 ET", "A", "cze", "rsa", "Atlanta"],
  [26, "2026-06-18", "15:00 ET", "B", "sui", "bih", "Los Angeles"],
  [27, "2026-06-19", "18:00 ET", "B", "can", "qat", "Vancouver"],
  [28, "2026-06-18", "21:00 ET", "A", "mex", "kor", "Guadalajara"],
  [29, "2026-06-19", "15:00 ET", "D", "usa", "aus", "Seattle"],
  [30, "2026-06-19", "18:00 ET", "C", "sco", "mar", "Boston"],
  [31, "2026-06-19", "20:30 ET", "C", "bra", "hai", "Philadelphia"],
  [32, "2026-06-19", "23:00 ET", "D", "tur", "par", "San Francisco Bay Area"],
  [33, "2026-06-20", "13:00 ET", "F", "ned", "swe", "Houston"],
  [34, "2026-06-20", "16:00 ET", "E", "ger", "civ", "Toronto"],
  [35, "2026-06-20", "20:00 ET", "E", "ecu", "crc", "Kansas City"],
  [36, "2026-06-21", "00:00 ET", "F", "tun", "jpn", "Monterrey"],
  [37, "2026-06-21", "12:00 ET", "H", "esp", "ksa", "Atlanta"],
  [38, "2026-06-21", "15:00 ET", "G", "bel", "irn", "Los Angeles"],
  [39, "2026-06-21", "18:00 ET", "H", "uru", "cpv", "Miami"],
  [40, "2026-06-21", "21:00 ET", "G", "nzl", "egy", "Vancouver"],
  [41, "2026-06-22", "13:00 ET", "J", "arg", "aut", "Dallas"],
  [42, "2026-06-22", "17:00 ET", "I", "fra", "irq", "Philadelphia"],
  [43, "2026-06-22", "20:00 ET", "I", "nor", "sen", "New York/New Jersey"],
  [44, "2026-06-22", "23:00 ET", "J", "jor", "alg", "San Francisco Bay Area"],
  [45, "2026-06-23", "13:00 ET", "K", "por", "uzb", "Houston"],
  [46, "2026-06-23", "16:00 ET", "L", "eng", "gha", "Boston"],
  [47, "2026-06-23", "19:00 ET", "L", "pan", "cro", "Toronto"],
  [48, "2026-06-23", "22:00 ET", "K", "col", "cod", "Guadalajara"],
  [49, "2026-06-24", "15:00 ET", "B", "sui", "can", "Vancouver"],
  [50, "2026-06-24", "15:00 ET", "B", "bih", "qat", "Seattle"],
  [51, "2026-06-24", "18:00 ET", "C", "sco", "bra", "Miami"],
  [52, "2026-06-24", "18:00 ET", "C", "mar", "hai", "Atlanta"],
  [53, "2026-06-24", "21:00 ET", "A", "cze", "mex", "Mexico City"],
  [54, "2026-06-24", "21:00 ET", "A", "rsa", "kor", "Monterrey"],
  [55, "2026-06-25", "16:00 ET", "E", "crc", "civ", "Philadelphia"],
  [56, "2026-06-25", "16:00 ET", "E", "ecu", "ger", "New York/New Jersey"],
  [57, "2026-06-25", "19:00 ET", "F", "jpn", "swe", "Dallas"],
  [58, "2026-06-25", "19:00 ET", "F", "tun", "ned", "Kansas City"],
  [59, "2026-06-25", "22:00 ET", "D", "tur", "usa", "Los Angeles"],
  [60, "2026-06-25", "22:00 ET", "D", "par", "aus", "San Francisco Bay Area"],
  [61, "2026-06-26", "15:00 ET", "I", "nor", "fra", "Boston"],
  [62, "2026-06-26", "15:00 ET", "I", "sen", "irq", "Toronto"],
  [63, "2026-06-26", "20:00 ET", "H", "cpv", "ksa", "Houston"],
  [64, "2026-06-26", "20:00 ET", "H", "uru", "esp", "Guadalajara"],
  [65, "2026-06-26", "23:00 ET", "G", "egy", "irn", "Seattle"],
  [66, "2026-06-26", "23:00 ET", "G", "nzl", "bel", "Vancouver"],
  [67, "2026-06-27", "17:00 ET", "L", "pan", "eng", "New York/New Jersey"],
  [68, "2026-06-27", "17:00 ET", "L", "cro", "gha", "Philadelphia"],
  [69, "2026-06-27", "19:30 ET", "K", "col", "por", "Miami"],
  [70, "2026-06-27", "19:30 ET", "K", "cod", "uzb", "Atlanta"],
  [71, "2026-06-27", "22:00 ET", "J", "alg", "aut", "Kansas City"],
  [72, "2026-06-27", "22:00 ET", "J", "jor", "arg", "Dallas"],
].map(([matchNumber, date, time, group, homeId, awayId, venue]) => ({
  matchNumber,
  date,
  time,
  group,
  homeId,
  awayId,
  venue,
}));

const fallbackCompletedMatchScores = [
  { matchNumber: 1, homeGoals: 2, awayGoals: 0 },
  { matchNumber: 2, homeGoals: 2, awayGoals: 1 },
  { matchNumber: 3, homeGoals: 1, awayGoals: 1 },
  { matchNumber: 4, homeGoals: 4, awayGoals: 1 },
  { matchNumber: 8, homeGoals: 1, awayGoals: 1 },
  { matchNumber: 5, homeGoals: 1, awayGoals: 1 },
  { matchNumber: 6, homeGoals: 0, awayGoals: 1 },
  { matchNumber: 7, homeGoals: 2, awayGoals: 0 },
  { matchNumber: 9, homeGoals: 7, awayGoals: 1 },
  { matchNumber: 10, homeGoals: 2, awayGoals: 2 },
  { matchNumber: 11, homeGoals: 1, awayGoals: 0 },
];

let completedMatchScores = [...fallbackCompletedMatchScores];
let scoreByMatch = Object.fromEntries(completedMatchScores.map((score) => [score.matchNumber, score]));
let activeResultsVersion = FALLBACK_RESULTS_VERSION;
let activeResultsSource = "fallback";

const teamCardRanks = [
  "A", "A", "K", "K", "Q", "Q", "J", "J", "10", "10", "9", "9",
  "8", "8", "7", "7", "6", "6", "5", "5", "4", "4", "3", "3",
  "2", "2", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5",
  "4", "3", "2", "A", "K", "Q", "J", "10", "9", "8", "7", "6",
];

const teamPowerOrder = [
  "arg", "esp", "fra", "eng", "por", "bra", "mar", "ned", "bel", "ger", "cro", "col",
  "mex", "sen", "uru", "usa", "jpn", "sui", "irn", "tur", "ecu", "aut", "kor", "aus",
  "alg", "egy", "can", "nor", "civ", "pan", "swe", "cze", "par", "sco", "tun", "cod",
  "uzb", "qat", "irq", "rsa", "ksa", "jor", "bih", "cpv", "gha", "crc", "hai", "nzl",
];

const suits = [
  { symbol: "♠", name: "spades", color: "black" },
  { symbol: "♥", name: "hearts", color: "red" },
  { symbol: "♦", name: "diamonds", color: "red" },
  { symbol: "♣", name: "clubs", color: "black" },
];

const socialCards = [
  { id: "social-1", type: "social", rank: "Joker", suit: "★", suitName: "gold", color: "gold", label: "Social" },
  { id: "social-2", type: "social", rank: "Joker", suit: "✦", suitName: "green", color: "green", label: "Social" },
  { id: "social-3", type: "social", rank: "Joker", suit: "✷", suitName: "blue", color: "blue", label: "Social" },
  { id: "social-4", type: "social", rank: "Joker", suit: "✹", suitName: "red", color: "red", label: "Social" },
];

function buildDeck() {
  const teamById = Object.fromEntries(teams.map((team) => [team.id, team]));
  const teamCards = teamPowerOrder.map((teamId, index) => {
    const team = teamById[teamId];
    const suit = suits[index % suits.length];
    return {
      id: `team-${team.id}`,
      type: "team",
      teamId: team.id,
      rank: teamCardRanks[index],
      suit: suit.symbol,
      suitName: suit.name,
      color: suit.color,
    };
  });

  return [...teamCards, ...socialCards];
}

function shuffle(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function freshDeckState() {
  return {
    deck: shuffle(buildDeck().map((card) => card.id)),
    drawn: [],
    currentCardId: "",
    shuffling: false,
  };
}

const cardById = Object.fromEntries(buildDeck().map((card) => [card.id, card]));

function normalizeCompletedScores(scores = []) {
  return scores
    .filter((score) => Number.isFinite(Number(score.matchNumber)))
    .map((score) => ({
      matchNumber: Number(score.matchNumber),
      homeGoals: Number(score.homeGoals),
      awayGoals: Number(score.awayGoals),
      status: score.status || "FT",
    }))
    .filter((score) => Number.isFinite(score.homeGoals) && Number.isFinite(score.awayGoals))
    .sort((a, b) => a.matchNumber - b.matchNumber);
}

function setCompletedScores(scores, version = FALLBACK_RESULTS_VERSION, source = "manual") {
  completedMatchScores = normalizeCompletedScores(scores);
  scoreByMatch = Object.fromEntries(completedMatchScores.map((score) => [score.matchNumber, score]));
  activeResultsVersion = version;
  activeResultsSource = source;
}

function blankTeamResult() {
  return { stage: "group", groupFinish: "", wins: 0, draws: 0, gf: 0, ga: 0, biggestUpset: 0 };
}

function buildOfficialResults() {
  const results = Object.fromEntries(teams.map((team) => [team.id, blankTeamResult()]));

  for (const score of completedMatchScores) {
    const match = groupMatches.find((candidate) => candidate.matchNumber === score.matchNumber);
    if (!match) continue;

    const home = teams.find((team) => team.id === match.homeId);
    const away = teams.find((team) => team.id === match.awayId);
    const homeResult = results[match.homeId];
    const awayResult = results[match.awayId];
    homeResult.gf += score.homeGoals;
    homeResult.ga += score.awayGoals;
    awayResult.gf += score.awayGoals;
    awayResult.ga += score.homeGoals;

    if (score.homeGoals === score.awayGoals) {
      homeResult.draws += 1;
      awayResult.draws += 1;
      continue;
    }

    const winner = score.homeGoals > score.awayGoals ? home : away;
    const loser = winner.id === home.id ? away : home;
    const winnerResult = results[winner.id];
    winnerResult.wins += 1;
    if (winner.rank > loser.rank) {
      winnerResult.biggestUpset = Math.max(winnerResult.biggestUpset, winner.rank - loser.rank);
    }
  }

  return results;
}

const defaultState = {
  auction: Object.fromEntries(teams.map((team) => [team.id, draftAuction[team.id] || { owner: "", price: 0 }])),
  results: buildOfficialResults(),
  resultsVersion: activeResultsVersion,
  auctionRoom: {
    currentTeamId: teams[0].id,
    currentBidder: "",
    currentBid: 1,
    saleLog: [],
    deckState: freshDeckState(),
  },
};

let state = loadState();
let scenarioState = loadScenarioState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);

  try {
    const parsed = JSON.parse(saved);
    const officialResults = buildOfficialResults();
    const resultsAreCurrent = parsed.resultsVersion === activeResultsVersion;
    return {
      ...structuredClone(defaultState),
      ...parsed,
      auction: { ...structuredClone(defaultState).auction, ...(parsed.auction || {}) },
      results: resultsAreCurrent ? { ...officialResults, ...(parsed.results || {}) } : officialResults,
      resultsVersion: activeResultsVersion,
      auctionRoom: {
        ...structuredClone(defaultState).auctionRoom,
        ...(parsed.auctionRoom || {}),
        deckState: {
          ...freshDeckState(),
          ...((parsed.auctionRoom && parsed.auctionRoom.deckState) || {}),
        },
      },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyResultsPayload(payload) {
  if (!payload || !Array.isArray(payload.matches)) return false;
  const nextVersion = payload.version || payload.updatedAt || FALLBACK_RESULTS_VERSION;
  if (nextVersion === activeResultsVersion && state.resultsVersion === activeResultsVersion) return false;

  setCompletedScores(payload.matches, nextVersion, payload.source || "data/results.json");
  state.results = buildOfficialResults();
  state.resultsVersion = activeResultsVersion;
  saveState();
  return true;
}

async function refreshLiveResults() {
  try {
    const response = await fetch(`${RESULTS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (applyResultsPayload(payload)) render();
  } catch {
    // Static fallback data remains usable if the result file cannot be fetched.
  }
}

function defaultScenarioEntry(teamId = teams[0].id) {
  return {
    id: `scenario-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    teamId,
    groupResults: ["loss", "loss", "loss"],
    groupFinish: "",
    stage: "group",
    sidePots: Object.fromEntries(sidePotOptions.map((option) => [option.key, false])),
  };
}

function loadScenarioState() {
  const saved = localStorage.getItem(SCENARIO_KEY);
  if (!saved) return { entries: [defaultScenarioEntry()] };

  try {
    const parsed = JSON.parse(saved);
    const entries = Array.isArray(parsed.entries) && parsed.entries.length
      ? parsed.entries.map((entry) => ({
        ...defaultScenarioEntry(entry.teamId || teams[0].id),
        ...entry,
        groupResults: Array.isArray(entry.groupResults)
          ? entry.groupResults.slice(0, 3).concat(["loss", "loss", "loss"]).slice(0, 3)
          : ["loss", "loss", "loss"],
        sidePots: {
          ...Object.fromEntries(sidePotOptions.map((option) => [option.key, false])),
          ...(entry.sidePots || {}),
        },
      }))
      : [defaultScenarioEntry()];
    return { entries };
  } catch {
    return { entries: [defaultScenarioEntry()] };
  }
}

function saveScenarioState() {
  localStorage.setItem(SCENARIO_KEY, JSON.stringify(scenarioState));
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function stageRank(stage) {
  return stages.find((item) => item.value === stage)?.rank ?? 0;
}

function teamCell(team) {
  return `<span class="team-cell"><span class="flag">${team.flag}</span>${teamLabel(team)}</span>`;
}

function teamLabel(team) {
  return `${team.name} (${team.rank})`;
}

function teamById(teamId) {
  return teams.find((team) => team.id === teamId);
}

function teamOwner(teamId) {
  const owner = state.auction[teamId]?.owner;
  return owner || "Unassigned";
}

function ownerOptions(selected = "") {
  const options = [`<option value="">Unassigned</option>`]
    .concat(players.map((player) => `<option value="${player}" ${player === selected ? "selected" : ""}>${player}</option>`));
  return options.join("");
}

function unsoldTeams() {
  return teams.filter((team) => !state.auction[team.id]?.owner);
}

function currentTeam() {
  return teams.find((team) => team.id === state.auctionRoom.currentTeamId) || unsoldTeams()[0] || teams[0];
}

function cardTeam(card) {
  return card?.teamId ? teams.find((team) => team.id === card.teamId) : null;
}

function cardMarkup(cardId, compact = false) {
  const card = cardById[cardId];
  if (!card) {
    return `
      <div class="card-inner card-back">
        <span>26</span>
        <strong>Draw</strong>
      </div>
    `;
  }

  if (card.type === "social") {
    return `
      <div class="card-inner social-card ${compact ? "compact-card" : ""}">
        <div class="card-corner"><strong>${card.rank}</strong><span>${card.suit}</span></div>
        <div class="card-center">
          <span class="social-symbol">${card.suit}</span>
          <strong>Social</strong>
          <em>Everyone drinks</em>
        </div>
        <div class="card-corner bottom"><strong>${card.rank}</strong><span>${card.suit}</span></div>
      </div>
    `;
  }

  const team = cardTeam(card);
  return `
    <div class="card-inner team-card ${card.color} ${compact ? "compact-card" : ""}">
      <div class="card-corner"><strong>${card.rank}</strong><span>${card.suit}</span></div>
      <div class="card-center">
        <span class="card-logo">${team.flag}</span>
        <strong>${teamLabel(team)}</strong>
        <em>${team.confederation}</em>
      </div>
      <div class="card-corner bottom"><strong>${card.rank}</strong><span>${card.suit}</span></div>
    </div>
  `;
}

function stageOptions(selected = "group") {
  return stages
    .map((stage) => `<option value="${stage.value}" ${stage.value === selected ? "selected" : ""}>${stage.label}</option>`)
    .join("");
}

function groupFinishOptions(selected = "") {
  return groupFinishes
    .map((finish) => `<option value="${finish.value}" ${finish.value === selected ? "selected" : ""}>${finish.label}</option>`)
    .join("");
}

function groupResultSelectOptions(selected = "loss") {
  return groupResultOptions
    .map((result) => `<option value="${result.value}" ${result.value === selected ? "selected" : ""}>${result.label}</option>`)
    .join("");
}

function scenarioTeamOptions(selected = "") {
  return teams
    .map((team) => {
      const auction = state.auction[team.id] || { owner: "Unassigned", price: 0 };
      const label = `${teamLabel(team)} - ${auction.owner || "Unassigned"} - ${currency(auction.price)}`;
      return `<option value="${team.id}" ${team.id === selected ? "selected" : ""}>${label}</option>`;
    })
    .join("");
}

function getTeamMetrics(team) {
  const result = state.results[team.id];
  return {
    ...result,
    gd: Number(result.gf) - Number(result.ga),
    biggestUpset: Number(result.biggestUpset ?? result.biggestWin ?? 0),
  };
}

function calculatePayouts() {
  const pot = teams.reduce((sum, team) => sum + Number(state.auction[team.id]?.price || 0), 0);
  const teamPayouts = Object.fromEntries(teams.map((team) => [team.id, 0]));
  const groupStageComplete = completedMatchScores.length >= 72;

  for (const rule of payoutRules) {
    const rulePot = pot * (rule.pct / 100);
    if (!rulePot) continue;

    if (rule.type === "unit") {
      const totalUnits = teams.reduce((sum, team) => sum + Number(getTeamMetrics(team)[rule.field] || 0), 0);
      if (!totalUnits) continue;
      const projectedUnits = rule.key === "wins" ? 72 : ESTIMATED_DRAW_TEAM_RESULTS;
      const denominator = groupStageComplete ? totalUnits : Math.max(totalUnits, projectedUnits);
      for (const team of teams) {
        teamPayouts[team.id] += rulePot * (Number(getTeamMetrics(team)[rule.field] || 0) / denominator);
      }
    }

    if (rule.type === "stage") {
      const qualifiers = teams.filter((team) => stageRank(state.results[team.id].stage) >= stageRank(rule.stage));
      if (!qualifiers.length) continue;
      for (const team of qualifiers) {
        teamPayouts[team.id] += rulePot / qualifiers.length;
      }
    }

    if (rule.type === "groupFinish") {
      const qualifiers = teams.filter((team) => {
        return stageRank(state.results[team.id].stage) >= stageRank("r32")
          && state.results[team.id].groupFinish === rule.finish;
      });
      if (!qualifiers.length) continue;
      for (const team of qualifiers) {
        teamPayouts[team.id] += rulePot / qualifiers.length;
      }
    }

    if (rule.type === "max" || rule.type === "min") {
      const values = teams.map((team) => ({ team, value: Number(getTeamMetrics(team)[rule.field] || 0) }));
      const activeValues = values.filter(({ value }) => value !== 0);
      if (!activeValues.length) continue;
      const target = rule.type === "max"
        ? Math.max(...activeValues.map(({ value }) => value))
        : Math.min(...activeValues.map(({ value }) => value));
      const winners = activeValues.filter(({ value }) => value === target);
      for (const { team } of winners) {
        teamPayouts[team.id] += rulePot / winners.length;
      }
    }
  }

  return { pot, teamPayouts };
}

function actualPot() {
  return teams.reduce((sum, team) => sum + Number(state.auction[team.id]?.price || 0), 0);
}

function payoutRuleByKey(key) {
  return payoutRules.find((rule) => rule.key === key);
}

function rulePool(key, pot = actualPot()) {
  const rule = payoutRuleByKey(key);
  return rule ? pot * (rule.pct / 100) : 0;
}

function scenarioTeamCost(teamId) {
  return Number(state.auction[teamId]?.price || 0);
}

function scenarioStagePayout(stage, pot) {
  const stageUnits = {
    r16: 16,
    qf: 8,
    sf: 4,
    final: 2,
    champion: 1,
  };
  return ["r16", "qf", "sf", "final", "champion"].reduce((sum, stageKey) => {
    if (stageRank(stage) < stageRank(stageKey)) return sum;
    return sum + (rulePool(stageKey, pot) / stageUnits[stageKey]);
  }, 0);
}

function scenarioGroupFinishPayout(finish, pot) {
  const finishUnits = {
    winner: 12,
    runnerUp: 12,
    third: 8,
  };
  const ruleKeys = {
    winner: "r32Winner",
    runnerUp: "r32RunnerUp",
    third: "r32Third",
  };
  return finish && finishUnits[finish] ? rulePool(ruleKeys[finish], pot) / finishUnits[finish] : 0;
}

function scenarioPayoutBreakdown(entry) {
  const pot = actualPot();
  const winCount = entry.groupResults.filter((result) => result === "win").length;
  const drawCount = entry.groupResults.filter((result) => result === "draw").length;
  const groupWins = winCount * (rulePool("wins", pot) / 72);
  const groupDraws = drawCount * (rulePool("draws", pot) / ESTIMATED_DRAW_TEAM_RESULTS);
  const groupFinish = scenarioGroupFinishPayout(entry.groupFinish, pot);
  const advancement = scenarioStagePayout(entry.stage, pot);
  const sidePots = sidePotOptions.reduce((sum, option) => (
    entry.sidePots?.[option.key] ? sum + rulePool(option.key, pot) : sum
  ), 0);
  const gross = groupWins + groupDraws + groupFinish + advancement + sidePots;
  const cost = scenarioTeamCost(entry.teamId);

  return {
    pot,
    winCount,
    drawCount,
    groupWins,
    groupDraws,
    groupFinish,
    advancement,
    sidePots,
    gross,
    cost,
    net: gross - cost,
  };
}

function firstUnusedScenarioTeam() {
  const used = new Set(scenarioState.entries.map((entry) => entry.teamId));
  return teams.find((team) => !used.has(team.id))?.id || teams[0].id;
}

function scenarioEntrySummary(entry) {
  const team = teamById(entry.teamId);
  const breakdown = scenarioPayoutBreakdown(entry);
  return {
    team: team ? teamLabel(team) : entry.teamId,
    owner: team ? teamOwner(team.id) : "Unassigned",
    originalCost: Math.round(breakdown.cost),
    grossPayout: Math.round(breakdown.gross),
    net: Math.round(breakdown.net),
    groupResults: entry.groupResults,
    groupFinish: groupFinishes.find((finish) => finish.value === entry.groupFinish)?.label || "Not advanced",
    stage: stages.find((stage) => stage.value === entry.stage)?.label || "Group Stage",
    sidePots: sidePotOptions.filter((option) => entry.sidePots?.[option.key]).map((option) => option.label),
  };
}

function renderAuction() {
  const ownerSpend = getOwnerSpend();
  document.getElementById("auctionRows").innerHTML = teams
    .map((team) => {
      const auction = state.auction[team.id];
      const ownerTotal = auction.owner ? ownerSpend[auction.owner] : 0;
      const budgetClass = ownerTotal > BUDGET_CAP ? "budget-warn" : "budget-ok";
      return `
        <tr>
          <td>${teamCell(team)}</td>
          <td>${team.confederation}</td>
          <td>
            <select data-kind="auction" data-field="owner" data-team="${team.id}" aria-label="${team.name} owner">
              ${ownerOptions(auction.owner)}
            </select>
          </td>
          <td>
            <input type="number" min="0" step="1" value="${auction.price}" data-kind="auction" data-field="price" data-team="${team.id}" aria-label="${team.name} price" />
          </td>
          <td class="${budgetClass}">${auction.owner ? currency(ownerTotal) : "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function renderAuctionRoom() {
  const team = currentTeam();
  const auction = state.auction[team.id] || { owner: "", price: 0 };
  const ownerSpend = getOwnerSpend();
  const unsold = unsoldTeams();
  const deckState = state.auctionRoom.deckState || freshDeckState();
  state.auctionRoom.deckState = deckState;
  const currentCard = cardById[deckState.currentCardId];
  const currentBid = Number(state.auctionRoom.currentBid || 0);
  const selectedBidder = state.auctionRoom.currentBidder;
  const bidderSpend = selectedBidder ? ownerSpend[selectedBidder] : 0;
  const bidderRemaining = selectedBidder ? BUDGET_CAP - bidderSpend - currentBid : BUDGET_CAP;
  const bidClass = selectedBidder && bidderSpend + currentBid > BUDGET_CAP ? "budget-warn" : "budget-ok";

  document.getElementById("auctionRoomStatus").textContent = `${unsold.length} unsold`;
  document.getElementById("deckStatus").textContent = `${deckState.deck.length} in deck · ${deckState.drawn.length} drawn`;
  const drawnCard = document.getElementById("drawnCard");
  drawnCard.classList.toggle("is-shuffling", Boolean(deckState.shuffling));
  drawnCard.innerHTML = cardMarkup(deckState.currentCardId);

  document.getElementById("currentTeamCard").innerHTML = `
    <div class="current-team-main">
      <span class="current-flag">${team.flag}</span>
      <div>
        <p class="eyebrow">${team.confederation}</p>
        <strong>${teamLabel(team)}</strong>
        <span>${auction.owner ? `Sold to ${auction.owner} for ${currency(auction.price)}` : "Available"}</span>
      </div>
    </div>
    <div class="current-bid-summary">
      <span>Current bid</span>
      <strong>${currency(currentBid)}</strong>
      <em class="${bidClass}">${selectedBidder ? `${selectedBidder} would have ${currency(bidderRemaining)} left after this bid` : "Choose a high bidder"}</em>
    </div>
  `;

  document.getElementById("liveBidderSelect").innerHTML = ownerOptions(selectedBidder);
  document.getElementById("liveBidInput").value = currentBid;

  document.getElementById("budgetBoard").innerHTML = players
    .map((player) => {
      const spent = ownerSpend[player];
      const remaining = BUDGET_CAP - spent;
      return `
        <div class="budget-row">
          <span>${player}</span>
          <strong class="${remaining < 0 ? "budget-warn" : "budget-ok"}">${currency(remaining)}</strong>
        </div>
      `;
    })
    .join("");

  const saleLog = state.auctionRoom.saleLog || [];
  document.getElementById("saleLog").innerHTML = saleLog.length
    ? saleLog
      .slice(-8)
      .reverse()
      .map((sale) => {
        const soldTeam = teams.find((candidate) => candidate.id === sale.teamId);
        return `
          <div class="sale-row">
            <span>${soldTeam ? `${soldTeam.flag} ${teamLabel(soldTeam)}` : "Team"}</span>
            <strong>${sale.owner} · ${currency(sale.price)}</strong>
          </div>
        `;
      })
      .join("")
    : `<div class="empty-note">No sales yet.</div>`;
}

function drawCard() {
  const deckState = state.auctionRoom.deckState || freshDeckState();
  if (!deckState.deck.length) return;

  const [cardId, ...remainingDeck] = deckState.deck;
  const card = cardById[cardId];
  deckState.deck = remainingDeck;
  deckState.drawn = [...(deckState.drawn || []), cardId];
  deckState.currentCardId = cardId;
  deckState.shuffling = false;

  if (card?.type === "team") {
    setCurrentTeam(card.teamId);
    state.auctionRoom.currentBidder = "";
    state.auctionRoom.currentBid = 1;
  }
}

function shuffleDeck() {
  const deckState = state.auctionRoom.deckState || freshDeckState();
  deckState.deck = shuffle(deckState.deck || []);
  deckState.shuffling = true;
  window.setTimeout(() => {
    state.auctionRoom.deckState.shuffling = false;
    saveState();
    render();
  }, 650);
}

function returnJokersToDeck() {
  const deckState = state.auctionRoom.deckState || freshDeckState();
  const socialIds = socialCards.map((card) => card.id);
  deckState.drawn = (deckState.drawn || []).filter((cardId) => !socialIds.includes(cardId));
  deckState.deck = shuffle([...new Set([...(deckState.deck || []), ...socialIds])]);
  if (socialIds.includes(deckState.currentCardId)) deckState.currentCardId = "";
}

function exportState() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "World Cup Calcutta 2026",
    version: 1,
    state,
  };
  downloadText(`world-cup-calcutta-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2));
}

function importState(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(reader.result);
      state = {
        ...structuredClone(defaultState),
        ...(payload.state || payload),
      };
      state.auctionRoom = {
        ...structuredClone(defaultState).auctionRoom,
        ...(state.auctionRoom || {}),
        deckState: {
          ...freshDeckState(),
          ...((state.auctionRoom && state.auctionRoom.deckState) || {}),
        },
      };
      saveState();
      render();
    } catch {
      window.alert("That file could not be imported.");
    }
  });
  reader.readAsText(file);
}

function renderResults() {
  document.getElementById("resultRows").innerHTML = teams
    .map((team) => {
      const result = state.results[team.id];
      return `
        <tr>
          <td>${teamCell(team)}</td>
          <td>
            <select data-kind="result" data-field="stage" data-team="${team.id}" aria-label="${team.name} stage">
              ${stageOptions(result.stage)}
            </select>
          </td>
          <td>
            <select data-kind="result" data-field="groupFinish" data-team="${team.id}" aria-label="${team.name} group finish">
              ${groupFinishOptions(result.groupFinish || "")}
            </select>
          </td>
          <td><input type="number" min="0" step="1" value="${result.wins}" data-kind="result" data-field="wins" data-team="${team.id}" aria-label="${team.name} wins" /></td>
          <td><input type="number" min="0" step="1" value="${result.draws}" data-kind="result" data-field="draws" data-team="${team.id}" aria-label="${team.name} draws" /></td>
          <td><input type="number" min="0" step="1" value="${result.gf}" data-kind="result" data-field="gf" data-team="${team.id}" aria-label="${team.name} goals for" /></td>
          <td><input type="number" min="0" step="1" value="${result.ga}" data-kind="result" data-field="ga" data-team="${team.id}" aria-label="${team.name} goals against" /></td>
          <td><input type="number" min="0" step="1" value="${result.biggestUpset ?? result.biggestWin ?? 0}" data-kind="result" data-field="biggestUpset" data-team="${team.id}" aria-label="${team.name} biggest upset ranking gap" /></td>
        </tr>
      `;
    })
    .join("");
}

function gameStatus(match) {
  if (scoreByMatch[match.matchNumber]) return "Final";
  const todayKey = localDateKey();
  const matchDate = new Date(`${match.date}T12:00:00`);
  if (match.date === todayKey) return "Today";
  return matchDate < new Date(`${todayKey}T00:00:00`) ? "Past" : "Upcoming";
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayMatchTime(match) {
  return match.time === "00:00 ET" ? "Midnight ET" : match.time;
}

function matchScore(match) {
  return scoreByMatch[match.matchNumber] || null;
}

function gameCard(match, compact = false) {
  const home = teamById(match.homeId);
  const away = teamById(match.awayId);
  const status = gameStatus(match);
  const score = matchScore(match);
  return `
    <article class="game-card ${compact ? "compact-game" : ""}">
      <div class="game-meta">
        <span class="game-status ${status.toLowerCase()}">${status}</span>
        <strong>Match ${match.matchNumber}</strong>
        <span>Group ${match.group} · ${match.date} · ${displayMatchTime(match)}</span>
      </div>
      ${score ? `
        <div class="game-score" aria-label="Final score">
          <span>${score.homeGoals}</span>
          <strong>Final</strong>
          <span>${score.awayGoals}</span>
        </div>
      ` : ""}
      <div class="game-matchup">
        <div class="game-team">
          <span class="game-flag">${home.flag}</span>
          <div>
            <strong>${teamLabel(home)}</strong>
            <span>${teamOwner(home.id)}</span>
          </div>
        </div>
        <span class="versus">vs</span>
        <div class="game-team">
          <span class="game-flag">${away.flag}</span>
          <div>
            <strong>${teamLabel(away)}</strong>
            <span>${teamOwner(away.id)}</span>
          </div>
        </div>
      </div>
      <div class="game-venue">${match.venue}</div>
    </article>
  `;
}

function renderGames() {
  document.getElementById("gameList").innerHTML = groupMatches
    .map((match) => gameCard(match))
    .join("");
}

function renderMatchTicker() {
  const todayKey = localDateKey();
  const nextMatches = groupMatches
    .filter((match) => match.date >= todayKey)
    .slice(0, 4);
  document.getElementById("matchTicker").innerHTML = nextMatches.length
    ? nextMatches.map((match) => gameCard(match, true)).join("")
    : `<div class="empty-note">Group-stage schedule complete.</div>`;
}

function getOwnerSpend() {
  return players.reduce((totals, player) => {
    totals[player] = teams.reduce((sum, team) => {
      const auction = state.auction[team.id];
      return sum + (auction.owner === player ? Number(auction.price || 0) : 0);
    }, 0);
    return totals;
  }, {});
}

function getOwnerPurchases() {
  return players.map((player) => {
    const purchases = teams
      .filter((team) => state.auction[team.id]?.owner === player)
      .map((team) => ({
        team,
        price: Number(state.auction[team.id]?.price || 0),
      }))
      .sort((a, b) => b.price - a.price || a.team.name.localeCompare(b.team.name));

    return {
      player,
      purchases,
      total: purchases.reduce((sum, purchase) => sum + purchase.price, 0),
    };
  });
}

function renderAuctionSummary() {
  const ownerPurchases = getOwnerPurchases();
  const soldTeams = teams.filter((team) => state.auction[team.id].owner && Number(state.auction[team.id].price) > 0);
  const pot = ownerPurchases.reduce((sum, owner) => sum + owner.total, 0);
  const averagePrice = soldTeams.length ? pot / soldTeams.length : 0;
  const leader = [...ownerPurchases].sort((a, b) => b.total - a.total)[0];

  document.getElementById("auctionSummaryPot").textContent = currency(pot);
  document.getElementById("auctionSummarySold").textContent = `${soldTeams.length} / ${teams.length}`;
  document.getElementById("auctionSummaryAverage").textContent = currency(averagePrice);

  document.getElementById("auctionOwnerSummary").innerHTML = ownerPurchases
    .sort((a, b) => b.total - a.total || a.player.localeCompare(b.player))
    .map((owner) => {
      const remaining = BUDGET_CAP - owner.total;
      const isLeader = leader && owner.player === leader.player && owner.total > 0;
      const teamsText = owner.purchases.length
        ? owner.purchases
          .map(({ team, price }) => `
            <span class="team-pill" title="${team.name}">
              <span>${team.flag}</span>
              <strong>${team.name}</strong>
              <em>${currency(price)}</em>
            </span>
          `)
          .join("")
        : `<span class="empty-note">No teams yet.</span>`;

      return `
        <article class="owner-summary-card ${isLeader ? "top-spender" : ""}">
          <div class="owner-summary-head">
            <div>
              <span class="owner-rank">${owner.purchases.length} team${owner.purchases.length === 1 ? "" : "s"}</span>
              <h4>${owner.player}</h4>
            </div>
            <div class="owner-total">
              <span>Spent</span>
              <strong>${currency(owner.total)}</strong>
            </div>
          </div>
          <div class="owner-budget-line">
            <span class="${remaining < 0 ? "budget-warn" : "budget-ok"}">${currency(remaining)} left</span>
            <div class="budget-meter" aria-hidden="true">
              <span style="width: ${Math.min(100, Math.max(0, (owner.total / BUDGET_CAP) * 100))}%"></span>
            </div>
          </div>
          <div class="owner-team-list">${teamsText}</div>
        </article>
      `;
    })
    .join("");
}

function renderDashboard() {
  const { pot, teamPayouts } = calculatePayouts();
  const ownerSpend = getOwnerSpend();
  const ownerPayouts = players.map((player) => {
    const payout = teams.reduce((sum, team) => {
      return sum + (state.auction[team.id].owner === player ? teamPayouts[team.id] : 0);
    }, 0);
    return { player, spent: ownerSpend[player], payout, net: payout - ownerSpend[player] };
  });

  const soldTeams = teams.filter((team) => state.auction[team.id].owner && Number(state.auction[team.id].price) > 0);
  const topAuction = [...teams].sort((a, b) => Number(state.auction[b.id].price || 0) - Number(state.auction[a.id].price || 0))[0];
  const projectedLeader = [...ownerPayouts].sort((a, b) => b.net - a.net)[0];
  const playersEntered = ownerPayouts.filter((owner) => owner.spent > 0).length;

  document.getElementById("potTotal").textContent = currency(pot);
  document.getElementById("budgetStatus").textContent = `${playersEntered} of ${players.length} players entered`;
  document.getElementById("teamsSold").textContent = `${soldTeams.length} / ${teams.length}`;
  document.getElementById("averagePrice").textContent = currency(soldTeams.length ? pot / soldTeams.length : 0);
  document.getElementById("topTeam").textContent = Number(state.auction[topAuction.id].price || 0)
    ? `${teamLabel(topAuction)} (${currency(state.auction[topAuction.id].price)})`
    : "None yet";
  document.getElementById("projectedLeader").textContent = projectedLeader && projectedLeader.spent
    ? `${projectedLeader.player} (${currency(projectedLeader.net)})`
    : "None yet";

  document.getElementById("ownerLeaderboard").innerHTML = ownerPayouts
    .sort((a, b) => b.net - a.net)
    .map((owner) => `
      <tr>
        <td><strong>${owner.player}</strong></td>
        <td class="${owner.spent > BUDGET_CAP ? "budget-warn" : ""}">${currency(owner.spent)}</td>
        <td>${currency(owner.payout)}</td>
        <td class="${owner.net >= 0 ? "budget-ok" : "budget-warn"}">${currency(owner.net)}</td>
      </tr>
    `)
    .join("");

  const auctionRows = teams
    .map((team) => ({
      team,
      owner: state.auction[team.id].owner || "-",
      cost: Number(state.auction[team.id].price || 0),
      payout: teamPayouts[team.id],
    }))
    .sort((a, b) => b.cost - a.cost || b.payout - a.payout)
    .slice(0, 12)
    .map((row, index) => `
      <article class="mvp-team-card">
        <span class="mvp-rank">#${index + 1}</span>
        <div class="mvp-team-main">
          <span>${row.team.flag}</span>
          <div>
            <strong>${teamLabel(row.team)}</strong>
            <em>${row.owner}</em>
          </div>
        </div>
        <div class="mvp-price">${currency(row.cost)}</div>
      </article>
    `);

  document.getElementById("teamLeaderboard").innerHTML = auctionRows.join("");
}

function renderRules() {
  document.getElementById("payoutBreakdown").innerHTML = payoutRules
    .map((rule) => `
      <div class="payout-row">
        <strong>${rule.pct}%</strong>
        <div>
          <div>${rule.label}</div>
          <div class="bar" aria-hidden="true"><span style="width: ${rule.pct * 4}%"></span></div>
        </div>
      </div>
    `)
    .join("");

  const examplePot = players.length * 125;
  document.getElementById("examplePotTotal").textContent = currency(examplePot);
  document.getElementById("examplePayoutRows").innerHTML = payoutRules
    .map((rule) => {
      const rulePool = examplePot * (rule.pct / 100);
      return `
        <tr>
          <td>${rule.label}</td>
          <td>${rule.pct}%</td>
          <td><strong>${currency(rulePool)}</strong></td>
          <td>${exampleUnitPayout(rule, rulePool)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderScenarioCalculator() {
  const rows = document.getElementById("scenarioRows");
  if (!rows) return;

  rows.innerHTML = scenarioState.entries
    .map((entry, index) => {
      const team = teamById(entry.teamId) || teams[0];
      const auction = state.auction[team.id] || { owner: "Unassigned", price: 0 };
      const breakdown = scenarioPayoutBreakdown(entry);
      const netClass = breakdown.net >= 0 ? "net-positive" : "net-negative";
      const needsGroupFinish = stageRank(entry.stage) >= stageRank("r32") && !entry.groupFinish;
      const sidePotChecks = sidePotOptions
        .map((option) => `
          <label class="side-pot-check">
            <input
              type="checkbox"
              data-kind="scenario"
              data-index="${index}"
              data-field="sidePot"
              data-side-pot="${option.key}"
              ${entry.sidePots?.[option.key] ? "checked" : ""}
            />
            <span>${option.label}</span>
          </label>
        `)
        .join("");

      return `
        <article class="scenario-card">
          <div class="scenario-card-head">
            <div>
              <p class="panel-label">Entry ${index + 1}</p>
              <h4>${team.flag} ${teamLabel(team)}</h4>
              <span>${auction.owner || "Unassigned"} paid ${currency(auction.price)}</span>
            </div>
            <button class="ghost compact-button" type="button" data-scenario-remove="${index}" ${scenarioState.entries.length === 1 ? "disabled" : ""}>Remove</button>
          </div>

          <div class="scenario-grid">
            <label class="scenario-field scenario-field-wide">
              <span>Team</span>
              <select data-kind="scenario" data-index="${index}" data-field="teamId" aria-label="Scenario team">
                ${scenarioTeamOptions(entry.teamId)}
              </select>
            </label>

            ${entry.groupResults.map((result, matchIndex) => `
              <label class="scenario-field">
                <span>Group Match ${matchIndex + 1}</span>
                <select data-kind="scenario" data-index="${index}" data-field="groupResult" data-match-index="${matchIndex}" aria-label="${team.name} group match ${matchIndex + 1}">
                  ${groupResultSelectOptions(result)}
                </select>
              </label>
            `).join("")}

            <label class="scenario-field">
              <span>Group Finish</span>
              <select data-kind="scenario" data-index="${index}" data-field="groupFinish" aria-label="${team.name} group finish">
                ${groupFinishOptions(entry.groupFinish)}
              </select>
            </label>

            <label class="scenario-field">
              <span>Furthest Stage</span>
              <select data-kind="scenario" data-index="${index}" data-field="stage" aria-label="${team.name} furthest stage">
                ${stageOptions(entry.stage)}
              </select>
            </label>
          </div>

          <div class="side-pot-checks" aria-label="${team.name} side pots">
            ${sidePotChecks}
          </div>

          <div class="scenario-output">
            <div>
              <span>Projected Payout</span>
              <strong>${currency(breakdown.gross)} <em>(${currency(breakdown.cost)} paid)</em></strong>
            </div>
            <div>
              <span>Net</span>
              <strong class="${netClass}">${currency(breakdown.net)}</strong>
            </div>
            <div>
              <span>Included</span>
              <strong>${breakdown.winCount}W, ${breakdown.drawCount}D, ${currency(breakdown.advancement + breakdown.groupFinish)} advancement</strong>
            </div>
          </div>
          ${needsGroupFinish ? `<p class="scenario-warning">Pick a group finish to include the Round of 32 advancement tier.</p>` : ""}
        </article>
      `;
    })
    .join("");

  const totals = scenarioState.entries.reduce((sum, entry) => {
    const breakdown = scenarioPayoutBreakdown(entry);
    return {
      gross: sum.gross + breakdown.gross,
      cost: sum.cost + breakdown.cost,
      net: sum.net + breakdown.net,
    };
  }, { gross: 0, cost: 0, net: 0 });

  document.getElementById("scenarioGrossTotal").textContent = currency(totals.gross);
  document.getElementById("scenarioCostTotal").textContent = currency(totals.cost);
  const netTotal = document.getElementById("scenarioNetTotal");
  netTotal.textContent = currency(totals.net);
  netTotal.className = totals.net >= 0 ? "net-positive" : "net-negative";
}

function exampleUnitPayout(rule, rulePool) {
  const stageCounts = {
    r16: 16,
    qf: 8,
    sf: 4,
    final: 2,
    champion: 1,
  };

  if (rule.key === "wins") {
    return `${currency(rulePool / 72)} if all 72 group matches have winners`;
  }

  if (rule.key === "draws") {
    return "Variable: pool divided by total team draws";
  }

  if (rule.type === "groupFinish") {
    const finishCounts = {
      winner: 12,
      runnerUp: 12,
      third: 8,
    };
    return currency(rulePool / finishCounts[rule.finish]);
  }

  if (rule.type === "stage") {
    return currency(rulePool / stageCounts[rule.stage]);
  }

  return `${currency(rulePool)} if one winner; split if tied`;
}

function render() {
  renderMatchTicker();
  renderAuctionSummary();
  renderAuction();
  renderResults();
  renderGames();
  renderDashboard();
  renderRules();
  renderScenarioCalculator();
  renderResultsSyncStatus();
}

function renderResultsSyncStatus() {
  const status = document.getElementById("resultsSyncStatus");
  if (!status) return;
  status.textContent = `${completedMatchScores.length} finals loaded · Source: ${activeResultsSource}`;
}

function setCurrentTeam(teamId) {
  state.auctionRoom.currentTeamId = teamId;
  const auction = state.auction[teamId] || { owner: "", price: 0 };
  state.auctionRoom.currentBidder = auction.owner || state.auctionRoom.currentBidder || "";
  state.auctionRoom.currentBid = Number(auction.price || 1);
}

function moveCurrentTeam(direction) {
  const index = teams.findIndex((team) => team.id === currentTeam().id);
  const step = direction === "prev" ? -1 : 1;

  for (let offset = 1; offset <= teams.length; offset += 1) {
    const nextIndex = (index + (step * offset) + teams.length) % teams.length;
    const candidate = teams[nextIndex];
    if (!state.auction[candidate.id]?.owner) {
      setCurrentTeam(candidate.id);
      return;
    }
  }
}

function sellCurrentTeam() {
  const team = currentTeam();
  const owner = state.auctionRoom.currentBidder;
  const price = Number(state.auctionRoom.currentBid || 0);
  if (!owner || price <= 0) return;

  const previous = { ...state.auction[team.id] };
  state.auction[team.id] = { owner, price };
  state.auctionRoom.saleLog = [
    ...(state.auctionRoom.saleLog || []),
    { teamId: team.id, owner, price, previous, soldAt: new Date().toISOString() },
  ];
  state.auctionRoom.currentBidder = "";
  state.auctionRoom.currentBid = 1;
}

function undoLastSale() {
  const saleLog = state.auctionRoom.saleLog || [];
  const lastSale = saleLog.pop();
  if (!lastSale) return;

  state.auction[lastSale.teamId] = lastSale.previous || { owner: "", price: 0 };
  setCurrentTeam(lastSale.teamId);
  state.auctionRoom.currentBidder = lastSale.owner;
  state.auctionRoom.currentBid = lastSale.price;
}

function handleInput(event) {
  const target = event.target;
  if (!target.dataset.kind) return;

  const { kind, field, team } = target.dataset;
  const value = target.type === "number" ? Number(target.value || 0) : target.value;

  if (kind === "auction") {
    state.auction[team][field] = value;
    if (team === state.auctionRoom.currentTeamId) {
      state.auctionRoom.currentBidder = state.auction[team].owner || "";
      state.auctionRoom.currentBid = Number(state.auction[team].price || 1);
    }
  }

  if (kind === "result") {
    state.results[team][field] = value;
    state.resultsVersion = activeResultsVersion;
  }

  if (kind === "scenario") {
    const entry = scenarioState.entries[Number(target.dataset.index)];
    if (!entry) return;

    if (field === "groupResult") {
      entry.groupResults[Number(target.dataset.matchIndex)] = target.value;
    } else if (field === "sidePot") {
      entry.sidePots[target.dataset.sidePot] = target.checked;
    } else {
      entry[field] = target.value;
      if (field === "groupFinish" && target.value && stageRank(entry.stage) < stageRank("r32")) {
        entry.stage = "r32";
      }
      if (field === "stage" && stageRank(target.value) < stageRank("r32")) {
        entry.groupFinish = "";
      }
    }

    saveScenarioState();
    render();
    return;
  }

  saveState();
  render();
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  document.getElementById("viewTitle").textContent = document.querySelector(`[data-view="${viewId}"]`).textContent;
}

function seedDemo() {
  state = structuredClone(defaultState);
  saveState();
  render();
}

function setScenarioStatus(message) {
  const status = document.getElementById("scenarioSaveStatus");
  if (!status) return;
  status.textContent = message;
  window.clearTimeout(setScenarioStatus.timeoutId);
  setScenarioStatus.timeoutId = window.setTimeout(() => {
    status.textContent = "";
  }, 2600);
}

function downloadScenario() {
  const totals = scenarioState.entries.reduce((sum, entry) => {
    const breakdown = scenarioPayoutBreakdown(entry);
    return {
      gross: sum.gross + breakdown.gross,
      cost: sum.cost + breakdown.cost,
      net: sum.net + breakdown.net,
    };
  }, { gross: 0, cost: 0, net: 0 });

  const payload = {
    exportedAt: new Date().toISOString(),
    app: "World Cup Calcutta 2026",
    type: "payout-scenario",
    pot: Math.round(actualPot()),
    totals: {
      grossPayout: Math.round(totals.gross),
      originalCost: Math.round(totals.cost),
      net: Math.round(totals.net),
    },
    entries: scenarioState.entries.map(scenarioEntrySummary),
    notes: [
      "Draw payouts are estimated until the tournament's final team-draw count is known.",
      "Side pots assume a single winner; tied side pots split the pool.",
      "Advancement payouts stack after the group stage.",
    ],
  };

  downloadText(`calcutta-payout-scenario-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2));
}

function handleScenarioRemove(event) {
  const removeButton = event.target.closest("[data-scenario-remove]");
  if (!removeButton) return;

  const index = Number(removeButton.dataset.scenarioRemove);
  if (scenarioState.entries.length <= 1) return;
  scenarioState.entries.splice(index, 1);
  saveScenarioState();
  render();
}

document.addEventListener("input", handleInput);
document.addEventListener("change", handleInput);
document.addEventListener("click", handleScenarioRemove);

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

function bindIfPresent(id, event, handler) {
  const element = document.getElementById(id);
  if (element) element.addEventListener(event, handler);
}

bindIfPresent("seedDemoButton", "click", seedDemo);
bindIfPresent("exportButton", "click", exportState);
bindIfPresent("importButton", "click", () => document.getElementById("importFileInput").click());
bindIfPresent("importFileInput", "change", (event) => {
  importState(event.target.files[0]);
  event.target.value = "";
});
bindIfPresent("resetButton", "click", () => {
  state = structuredClone(defaultState);
  saveState();
  render();
});

bindIfPresent("addScenarioButton", "click", () => {
  scenarioState.entries.push(defaultScenarioEntry(firstUnusedScenarioTeam()));
  saveScenarioState();
  render();
});

bindIfPresent("saveScenarioButton", "click", () => {
  saveScenarioState();
  setScenarioStatus("Saved in this browser.");
});

bindIfPresent("downloadScenarioButton", "click", downloadScenario);

bindIfPresent("clearScenarioButton", "click", () => {
  scenarioState = { entries: [defaultScenarioEntry(firstUnusedScenarioTeam())] };
  saveScenarioState();
  render();
  setScenarioStatus("Scenario cleared.");
});

bindIfPresent("drawCardButton", "click", () => {
  drawCard();
  saveState();
  render();
});

bindIfPresent("shuffleDeckButton", "click", () => {
  shuffleDeck();
  saveState();
  render();
});

bindIfPresent("returnJokersButton", "click", () => {
  returnJokersToDeck();
  saveState();
  render();
});

bindIfPresent("liveBidderSelect", "change", (event) => {
  state.auctionRoom.currentBidder = event.target.value;
  saveState();
  render();
});

bindIfPresent("liveBidInput", "input", (event) => {
  state.auctionRoom.currentBid = Number(event.target.value || 0);
  saveState();
  render();
});

document.querySelectorAll(".bid-step").forEach((button) => {
  button.addEventListener("click", () => {
    state.auctionRoom.currentBid = Number(state.auctionRoom.currentBid || 0) + Number(button.dataset.step);
    saveState();
    render();
  });
});

bindIfPresent("prevTeamButton", "click", () => {
  moveCurrentTeam("prev");
  saveState();
  render();
});

bindIfPresent("nextTeamButton", "click", () => {
  moveCurrentTeam("next");
  saveState();
  render();
});

bindIfPresent("soldButton", "click", () => {
  sellCurrentTeam();
  saveState();
  render();
});

bindIfPresent("undoSaleButton", "click", () => {
  undoLastSale();
  saveState();
  render();
});

render();
refreshLiveResults();
window.setInterval(refreshLiveResults, RESULTS_REFRESH_MS);
