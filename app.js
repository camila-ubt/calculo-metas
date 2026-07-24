const DEFAULT_GOALS = {
  id: 1,
  mes: "2026-07-01",
  cb_manha: 12000,
  cb_noite: 18000,
  aa_manha: 18000,
  aa_noite: 27000,
  ab_manha: 16800,
  ab_noite: 25200,
};

const SHIFT_KEYS = [
  "cb_manha",
  "cb_noite",
  "aa_manha",
  "aa_noite",
  "ab_manha",
  "ab_noite",
];

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

let currentGoals = DEFAULT_GOALS;
let availableGoals = [DEFAULT_GOALS];

function isSupabaseConfigured() {
  const config = window.APP_CONFIG || {};
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

async function loadGoals() {
  if (!isSupabaseConfigured()) {
    renderMonthOptions(availableGoals, true);
    return;
  }

  const { supabaseUrl, supabaseAnonKey } = window.APP_CONFIG;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/metas_mensais?select=*&order=mes.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Não foi possível carregar as metas.");
    }

    const goals = await response.json();
    if (goals.length) {
      availableGoals = goals;
      currentGoals = chooseInitialGoals(goals);
    }
    renderMonthOptions(availableGoals, false);
  } catch (error) {
    renderMonthOptions(availableGoals, true);
  }
}

function formatMonth(dateString) {
  const date = new Date(`${dateString.slice(0, 7)}-01T12:00:00Z`);
  const label = monthFormatter.format(date);
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
}

function chooseInitialGoals(goals) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return goals.find((goalsRow) => goalsRow.mes.startsWith(currentMonth)) || goals[0];
}

function renderMonthOptions(goals, usingDefault) {
  const select = document.querySelector("#monthSelect");
  select.innerHTML = "";

  goals.forEach((goalsRow) => {
    const option = document.createElement("option");
    option.value = goalsRow.mes;
    option.textContent = `${formatMonth(goalsRow.mes)}${usingDefault ? " • demonstração" : ""}`;
    option.selected = goalsRow.mes === currentGoals.mes;
    select.append(option);
  });
}

function selectGoalsForMonth(month) {
  const selected = availableGoals.find((goals) => goals.mes === month);
  if (selected) currentGoals = selected;
  document.querySelector("#results").hidden = true;
}

function numberFromInput(value) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const result = Number(normalized);
  return Number.isFinite(result) ? result : 0;
}

function wholeNumberFromInput(value) {
  return Math.max(0, Math.floor(numberFromInput(value)));
}

function getScheduledDays() {
  return Object.fromEntries(
    SHIFT_KEYS.map((key) => [
      key,
      wholeNumberFromInput(document.querySelector(`[data-shift="${key}"]`).value),
    ]),
  );
}

function updateTotalDays() {
  const total = Object.values(getScheduledDays()).reduce(
    (sum, days) => sum + days,
    0,
  );
  document.querySelector("#totalScheduledDays").textContent = total;
  return total;
}

function daysInGoalMonth() {
  const [year, month] = currentGoals.mes.slice(0, 7).split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function calculateTargets(days) {
  const monthDays = daysInGoalMonth();
  const goal = SHIFT_KEYS.reduce(
    (total, key) => total + (Number(currentGoals[key]) / monthDays) * days[key],
    0,
  );

  return {
    goal,
    super: goal * 1.2,
    mega: goal * 1.3,
  };
}

function validateForm(totalDays, soldTotal, remainingDays) {
  if (totalDays <= 0) {
    return "Preencha pelo menos um dia da sua escala.";
  }

  if (totalDays > 31) {
    return "O total da escala não pode passar de 31 dias.";
  }

  if (soldTotal < 0 || remainingDays < 0 || remainingDays > 31) {
    return "Confira os valores preenchidos.";
  }

  if (remainingDays > totalDays) {
    return "Os dias restantes não podem ser maiores que o total da escala.";
  }

  return "";
}

function percentage(sold, target) {
  if (target <= 0) return 0;
  return Math.max(0, (sold / target) * 100);
}

function requiredPerDay(remaining, days) {
  if (remaining <= 0) return 0;
  if (days <= 0) return remaining;
  return remaining / days;
}

function updateResultCard(kind, target, sold, remainingDays) {
  const remaining = Math.max(0, target - sold);
  const percent = percentage(sold, target);
  const achieved = remaining === 0;

  document.querySelector(`#${kind}Target`).textContent =
    moneyFormatter.format(target);
  document.querySelector(`#${kind}Remaining`).textContent = achieved
    ? "Alcançada!"
    : moneyFormatter.format(remaining);
  document.querySelector(`#${kind}Percent`).textContent =
    `${Math.min(percent, 999).toFixed(0)}%`;
  document.querySelector(`#${kind}PerDay`).textContent = achieved
    ? "Objetivo alcançado"
    : remainingDays > 0
      ? `${moneyFormatter.format(requiredPerDay(remaining, remainingDays))} por dia restante`
      : `${moneyFormatter.format(remaining)} ainda pendente`;
  document.querySelector(`#${kind}Progress`).style.width =
    `${Math.min(100, percent)}%`;

  return remaining;
}

function statusText(targets, sold, remainingDays, totalDays) {
  if (sold >= targets.mega) {
    return "💎 Mega alcançada! Excelente resultado, agora é manter o foco até o fechamento.";
  }
  if (sold >= targets.super) {
    return "🔥 Super alcançada! Resultado muito bom, ainda dá para mirar na Mega.";
  }
  if (sold >= targets.goal) {
    return "✅ Meta alcançada! Bom desempenho, agora o foco é buscar a Super.";
  }

  const neededForGoal = requiredPerDay(targets.goal - sold, remainingDays);
  const averageGoalPerScheduledDay = targets.goal / totalDays;
  const averageSuperPerScheduledDay = targets.super / totalDays;
  const averageMegaPerScheduledDay = targets.mega / totalDays;

  if (neededForGoal <= averageGoalPerScheduledDay) {
    return "🌟 Está no ritmo da Meta. Mantendo esse desempenho, o resultado vem.";
  }
  if (neededForGoal <= averageSuperPerScheduledDay) {
    return "💪 A Meta está possível. Precisa melhorar o ritmo para chegar na Super.";
  }
  if (neededForGoal <= averageMegaPerScheduledDay) {
    return "⚡ Para buscar a Mega, vai precisar acelerar as vendas nos próximos dias.";
  }
  return "📌 O resultado está desafiador. Precisa de uma reação forte para virar o mês.";
}

function calculate() {
  const days = getScheduledDays();
  const totalDays = updateTotalDays();
  const soldTotal = numberFromInput(document.querySelector("#soldTotal").value);
  const remainingDays = wholeNumberFromInput(
    document.querySelector("#remainingDays").value,
  );
  const message = validateForm(totalDays, soldTotal, remainingDays);
  const messageElement = document.querySelector("#formMessage");

  messageElement.textContent = message;
  if (message) return;

  const targets = calculateTargets(days);
  updateResultCard("goal", targets.goal, soldTotal, remainingDays);
  updateResultCard("super", targets.super, soldTotal, remainingDays);
  updateResultCard("mega", targets.mega, soldTotal, remainingDays);

  document.querySelector("#statusMessage").textContent = statusText(
    targets,
    soldTotal,
    remainingDays,
    totalDays,
  );

  const results = document.querySelector("#results");
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearForm() {
  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  document.querySelector("#formMessage").textContent = "";
  document.querySelector("#results").hidden = true;
  updateTotalDays();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

SHIFT_KEYS.forEach((key) => {
  document
    .querySelector(`[data-shift="${key}"]`)
    .addEventListener("input", updateTotalDays);
});

document.querySelector("#calculateButton").addEventListener("click", calculate);
document.querySelector("#clearButton").addEventListener("click", clearForm);
document
  .querySelector("#resultsClearButton")
  .addEventListener("click", clearForm);
document
  .querySelector("#monthSelect")
  .addEventListener("change", (event) => selectGoalsForMonth(event.target.value));

loadGoals();
