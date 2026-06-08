const BUDGET_CAP = 150;

const players = [
  "Meli",
  "Eva",
  "Sarah",
  "Greg",
  "Hillary",
  "Gabo",
  "Tommy",
  "Fabrice",
  "Zach",
  "Matt",
  "Sergio",
  "Ellie",
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

const payoutRules = [
  { key: "wins", label: "Group-stage wins", pct: 15, type: "unit", field: "wins" },
  { key: "draws", label: "Group-stage draws", pct: 5, type: "unit", field: "draws" },
  { key: "r32", label: "Reach Round of 32", pct: 8, type: "stage", stage: "r32" },
  { key: "r16", label: "Reach Round of 16", pct: 10, type: "stage", stage: "r16" },
  { key: "qf", label: "Reach Quarterfinals", pct: 12, type: "stage", stage: "qf" },
  { key: "sf", label: "Reach Semifinals", pct: 12, type: "stage", stage: "sf" },
  { key: "final", label: "Reach Final", pct: 8, type: "stage", stage: "final" },
  { key: "champion", label: "Champion", pct: 15, type: "stage", stage: "champion" },
  { key: "mostGoals", label: "Most goals scored", pct: 5, type: "max", field: "gf" },
  { key: "bestDiff", label: "Best goal differential", pct: 4, type: "max", field: "gd" },
  { key: "biggestWin", label: "Biggest single-match win", pct: 3, type: "max", field: "biggestWin" },
  { key: "worstDiff", label: "Worst goal differential", pct: 3, type: "min", field: "gd" },
];

const teams = [
  ["arg", "Argentina", "CONMEBOL", "🇦🇷"],
  ["aus", "Australia", "AFC", "🇦🇺"],
  ["aut", "Austria", "UEFA", "🇦🇹"],
  ["bel", "Belgium", "UEFA", "🇧🇪"],
  ["bih", "Bosnia and Herzegovina", "UEFA", "🇧🇦"],
  ["bra", "Brazil", "CONMEBOL", "🇧🇷"],
  ["can", "Canada", "CONCACAF", "🇨🇦"],
  ["cpv", "Cabo Verde", "CAF", "🇨🇻"],
  ["col", "Colombia", "CONMEBOL", "🇨🇴"],
  ["cod", "Congo DR", "CAF", "🇨🇩"],
  ["crc", "Curacao", "CONCACAF", "🇨🇼"],
  ["cro", "Croatia", "UEFA", "🇭🇷"],
  ["cze", "Czechia", "UEFA", "🇨🇿"],
  ["ecu", "Ecuador", "CONMEBOL", "🇪🇨"],
  ["egy", "Egypt", "CAF", "🇪🇬"],
  ["eng", "England", "UEFA", "🏴"],
  ["fra", "France", "UEFA", "🇫🇷"],
  ["ger", "Germany", "UEFA", "🇩🇪"],
  ["gha", "Ghana", "CAF", "🇬🇭"],
  ["hai", "Haiti", "CONCACAF", "🇭🇹"],
  ["irn", "IR Iran", "AFC", "🇮🇷"],
  ["irq", "Iraq", "AFC", "🇮🇶"],
  ["civ", "Cote d'Ivoire", "CAF", "🇨🇮"],
  ["jpn", "Japan", "AFC", "🇯🇵"],
  ["jor", "Jordan", "AFC", "🇯🇴"],
  ["kor", "Korea Republic", "AFC", "🇰🇷"],
  ["mex", "Mexico", "CONCACAF", "🇲🇽"],
  ["mar", "Morocco", "CAF", "🇲🇦"],
  ["ned", "Netherlands", "UEFA", "🇳🇱"],
  ["nzl", "New Zealand", "OFC", "🇳🇿"],
  ["nor", "Norway", "UEFA", "🇳🇴"],
  ["pan", "Panama", "CONCACAF", "🇵🇦"],
  ["par", "Paraguay", "CONMEBOL", "🇵🇾"],
  ["por", "Portugal", "UEFA", "🇵🇹"],
  ["qat", "Qatar", "AFC", "🇶🇦"],
  ["ksa", "Saudi Arabia", "AFC", "🇸🇦"],
  ["sco", "Scotland", "UEFA", "🏴"],
  ["sen", "Senegal", "CAF", "🇸🇳"],
  ["rsa", "South Africa", "CAF", "🇿🇦"],
  ["esp", "Spain", "UEFA", "🇪🇸"],
  ["swe", "Sweden", "UEFA", "🇸🇪"],
  ["sui", "Switzerland", "UEFA", "🇨🇭"],
  ["tun", "Tunisia", "CAF", "🇹🇳"],
  ["tur", "Turkiye", "UEFA", "🇹🇷"],
  ["uru", "Uruguay", "CONMEBOL", "🇺🇾"],
  ["usa", "United States", "CONCACAF", "🇺🇸"],
  ["uzb", "Uzbekistan", "AFC", "🇺🇿"],
  ["alg", "Algeria", "CAF", "🇩🇿"],
].map(([id, name, confederation, flag]) => ({ id, name, confederation, flag }));

const teamCardRanks = [
  "A", "A", "K", "K", "Q", "Q", "J", "J", "10", "10", "9", "9",
  "8", "8", "7", "7", "6", "6", "5", "5", "4", "4", "3", "3",
  "2", "2", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5",
  "4", "3", "2", "A", "K", "Q", "J", "10", "9", "8", "7", "6",
];

const teamPowerOrder = [
  "arg", "fra", "bra", "esp", "eng", "por", "ned", "ger", "bel", "cro", "uru", "col",
  "mar", "jpn", "usa", "mex", "sui", "sen", "ecu", "aut", "nor", "tur", "kor", "aus",
  "par", "rsa", "civ", "egy", "tun", "gha", "ksa", "qat", "irn", "uzb", "can", "pan",
  "nzl", "sco", "swe", "cze", "bih", "irq", "jor", "hai", "crc", "cpv", "cod", "alg",
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

const defaultState = {
  auction: Object.fromEntries(teams.map((team) => [team.id, { owner: "", price: 0 }])),
  results: Object.fromEntries(
    teams.map((team) => [
      team.id,
      { stage: "group", wins: 0, draws: 0, gf: 0, ga: 0, biggestWin: 0 },
    ]),
  ),
  auctionRoom: {
    currentTeamId: teams[0].id,
    currentBidder: "",
    currentBid: 1,
    saleLog: [],
    deckState: freshDeckState(),
  },
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem("calcuttaState");
  if (!saved) return structuredClone(defaultState);

  try {
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      auction: { ...structuredClone(defaultState).auction, ...(parsed.auction || {}) },
      results: { ...structuredClone(defaultState).results, ...(parsed.results || {}) },
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
  localStorage.setItem("calcuttaState", JSON.stringify(state));
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
  return `<span class="team-cell"><span class="flag">${team.flag}</span>${team.name}</span>`;
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
        <strong>${team.name}</strong>
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

function getTeamMetrics(team) {
  const result = state.results[team.id];
  return {
    ...result,
    gd: Number(result.gf) - Number(result.ga),
  };
}

function calculatePayouts() {
  const pot = teams.reduce((sum, team) => sum + Number(state.auction[team.id]?.price || 0), 0);
  const teamPayouts = Object.fromEntries(teams.map((team) => [team.id, 0]));

  for (const rule of payoutRules) {
    const rulePot = pot * (rule.pct / 100);
    if (!rulePot) continue;

    if (rule.type === "unit") {
      const totalUnits = teams.reduce((sum, team) => sum + Number(getTeamMetrics(team)[rule.field] || 0), 0);
      if (!totalUnits) continue;
      for (const team of teams) {
        teamPayouts[team.id] += rulePot * (Number(getTeamMetrics(team)[rule.field] || 0) / totalUnits);
      }
    }

    if (rule.type === "stage") {
      const qualifiers = teams.filter((team) => stageRank(state.results[team.id].stage) >= stageRank(rule.stage));
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
        <strong>${team.name}</strong>
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
            <span>${soldTeam?.flag || ""} ${soldTeam?.name || "Team"}</span>
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
          <td><input type="number" min="0" step="1" value="${result.wins}" data-kind="result" data-field="wins" data-team="${team.id}" aria-label="${team.name} wins" /></td>
          <td><input type="number" min="0" step="1" value="${result.draws}" data-kind="result" data-field="draws" data-team="${team.id}" aria-label="${team.name} draws" /></td>
          <td><input type="number" min="0" step="1" value="${result.gf}" data-kind="result" data-field="gf" data-team="${team.id}" aria-label="${team.name} goals for" /></td>
          <td><input type="number" min="0" step="1" value="${result.ga}" data-kind="result" data-field="ga" data-team="${team.id}" aria-label="${team.name} goals against" /></td>
          <td><input type="number" min="0" step="1" value="${result.biggestWin}" data-kind="result" data-field="biggestWin" data-team="${team.id}" aria-label="${team.name} biggest single-match win" /></td>
        </tr>
      `;
    })
    .join("");
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
    ? `${topAuction.name} (${currency(state.auction[topAuction.id].price)})`
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

  document.getElementById("teamLeaderboard").innerHTML = teams
    .map((team) => ({
      team,
      owner: state.auction[team.id].owner || "-",
      cost: Number(state.auction[team.id].price || 0),
      payout: teamPayouts[team.id],
    }))
    .sort((a, b) => b.payout - a.payout)
    .slice(0, 12)
    .map((row) => `
      <tr>
        <td>${teamCell(row.team)}</td>
        <td>${row.owner}</td>
        <td>${currency(row.cost)}</td>
        <td><strong>${currency(row.payout)}</strong></td>
      </tr>
    `)
    .join("");
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
    .map((rule) => `
      <tr>
        <td>${rule.label}</td>
        <td>${rule.pct}%</td>
        <td><strong>${currency(examplePot * (rule.pct / 100))}</strong></td>
      </tr>
    `)
    .join("");
}

function render() {
  renderAuctionRoom();
  renderAuction();
  renderResults();
  renderDashboard();
  renderRules();
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
  const assignments = [
    ["Argentina", "Meli", 88, "champion", 6, 1, 16, 5],
    ["France", "Eva", 82, "final", 5, 1, 14, 6],
    ["Brazil", "Sarah", 76, "sf", 4, 1, 12, 5],
    ["Spain", "Greg", 72, "sf", 4, 0, 11, 4],
    ["United States", "Hillary", 42, "r16", 2, 2, 8, 7],
    ["Mexico", "Gabo", 39, "r32", 1, 2, 5, 5],
    ["Japan", "Tommy", 35, "qf", 3, 1, 9, 6],
    ["Morocco", "Fabrice", 34, "qf", 3, 1, 8, 5],
    ["Canada", "Zach", 23, "group", 1, 1, 4, 6],
    ["Cabo Verde", "Matt", 7, "group", 0, 1, 2, 9],
    ["Curacao", "Sergio", 5, "group", 0, 0, 1, 10],
    ["Haiti", "Ellie", 5, "group", 0, 1, 2, 8],
  ];

  teams.forEach((team, index) => {
    const player = players[index % players.length];
    state.auction[team.id] = { owner: player, price: 2 + (index % 6) };
  });

  for (const [name, owner, price, stage, wins, draws, gf, ga] of assignments) {
    const team = teams.find((candidate) => candidate.name === name);
    state.auction[team.id] = { owner, price };
    state.results[team.id] = {
      stage,
      wins,
      draws,
      gf,
      ga,
      biggestWin: Math.max(1, Math.ceil((gf - ga) / 2)),
    };
  }

  state.auctionRoom.deckState = freshDeckState();
  saveState();
  render();
}

document.addEventListener("input", handleInput);
document.addEventListener("change", handleInput);

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.getElementById("seedDemoButton").addEventListener("click", seedDemo);
document.getElementById("exportButton").addEventListener("click", exportState);
document.getElementById("importButton").addEventListener("click", () => document.getElementById("importFileInput").click());
document.getElementById("importFileInput").addEventListener("change", (event) => {
  importState(event.target.files[0]);
  event.target.value = "";
});
document.getElementById("resetButton").addEventListener("click", () => {
  state = structuredClone(defaultState);
  saveState();
  render();
});

document.getElementById("drawCardButton").addEventListener("click", () => {
  drawCard();
  saveState();
  render();
});

document.getElementById("shuffleDeckButton").addEventListener("click", () => {
  shuffleDeck();
  saveState();
  render();
});

document.getElementById("returnJokersButton").addEventListener("click", () => {
  returnJokersToDeck();
  saveState();
  render();
});

document.getElementById("liveBidderSelect").addEventListener("change", (event) => {
  state.auctionRoom.currentBidder = event.target.value;
  saveState();
  render();
});

document.getElementById("liveBidInput").addEventListener("input", (event) => {
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

document.getElementById("prevTeamButton").addEventListener("click", () => {
  moveCurrentTeam("prev");
  saveState();
  render();
});

document.getElementById("nextTeamButton").addEventListener("click", () => {
  moveCurrentTeam("next");
  saveState();
  render();
});

document.getElementById("soldButton").addEventListener("click", () => {
  sellCurrentTeam();
  saveState();
  render();
});

document.getElementById("undoSaleButton").addEventListener("click", () => {
  undoLastSale();
  saveState();
  render();
});

render();
