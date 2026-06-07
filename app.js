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

const defaultState = {
  auction: Object.fromEntries(teams.map((team) => [team.id, { owner: "", price: 0 }])),
  results: Object.fromEntries(
    teams.map((team) => [
      team.id,
      { stage: "group", wins: 0, draws: 0, gf: 0, ga: 0, biggestWin: 0 },
    ]),
  ),
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem("calcuttaState");
  if (!saved) return structuredClone(defaultState);

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("calcuttaState", JSON.stringify(state));
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
}

function render() {
  renderAuction();
  renderResults();
  renderDashboard();
  renderRules();
}

function handleInput(event) {
  const target = event.target;
  if (!target.dataset.kind) return;

  const { kind, field, team } = target.dataset;
  const value = target.type === "number" ? Number(target.value || 0) : target.value;

  if (kind === "auction") {
    state.auction[team][field] = value;
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

  saveState();
  render();
}

document.addEventListener("input", handleInput);
document.addEventListener("change", handleInput);

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.getElementById("seedDemoButton").addEventListener("click", seedDemo);
document.getElementById("resetButton").addEventListener("click", () => {
  state = structuredClone(defaultState);
  saveState();
  render();
});

render();
