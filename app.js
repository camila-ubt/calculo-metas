const SHIFT_KEYS = [
  "cb_manha",
  "cb_noite",
  "aa_manha",
  "aa_noite",
  "ab_manha",
  "ab_noite",
];

const SUPER_MULTIPLIER = 1.1;
const MEGA_MULTIPLIER = 1.2;

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

let currentGoals = null;
let availableGoals = [];

function isSupabaseConfigured() {
  const config = window.APP_CONFIG || {};
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

async function loadGoals() {
  const select = document.querySelector("#monthSelect");

  if (!isSupabaseConfigured()) {
    select.innerHTML = '<option value="">Metas indisponíveis</option>';
    document.querySelector("#formMessage").textContent =
      "Não foi possível acessar as metas do Líder Metas.";
    return;
  }

  const { supabaseUrl, supabaseAnonKey } = window.APP_CONFIG;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/metas_publicas`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Não foi possível carregar as metas.");
    }

    const goals = await response.json();
    if (!Array.isArray(goals) || !goals.length) {
      throw new Error("Nenhuma meta disponível.");
    }

    availableGoals = goals;
    currentGoals = chooseInitialGoals(goals);
    renderMonthOptions(availableGoals);
  } catch (error) {
    availableGoals = [];
    currentGoals = null;
    select.innerHTML = '<option value="">Metas indisponíveis</option>';
    document.querySelector("#formMessage").textContent =
      "Não foi possível carregar as metas do Líder Metas agora.";
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

function renderMonthOptions(goals) {
  const select = document.querySelector("#monthSelect");
  select.innerHTML = "";

  goals.forEach((goalsRow) => {
    const option = document.createElement("option");
    option.value = goalsRow.mes;
    option.textContent = formatMonth(goalsRow.mes);
    option.selected = goalsRow.mes === currentGoals.mes;
    select.append(option);
  });
  syncDayInputLimits();
}

function selectGoalsForMonth(month) {
  const selected = availableGoals.find((goals) => goals.mes === month);
  if (selected) currentGoals = selected;
  syncDayInputLimits();
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

function formatMoneyInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";

  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getScheduledDays() {
  return Object.fromEntries(
    SHIFT_KEYS.map((key) => [
      key,
      wholeNumberFromInput(document.querySelector(`[data-shift="${key}"]`).value),
    ]),
  );
}

function getDuoDays() {
  return Object.fromEntries(
    SHIFT_KEYS.map((key) => [
      key,
      wholeNumberFromInput(document.querySelector(`[data-duo="${key}"]`).value),
    ]),
  );
}

function updateTotalDays() {
  const scheduledDays = getScheduledDays();
  const duoDays = getDuoDays();
  const totalSolo = Object.values(scheduledDays).reduce((sum, days) => sum + days, 0);
  const totalDuo = Object.values(duoDays).reduce((sum, days) => sum + days, 0);
  const total = totalSolo + totalDuo;
  document.querySelector("#totalScheduledDays").textContent = total;
  document.querySelector("#totalDuoDays").textContent = totalDuo;
  return total;
}

function daysInGoalMonth() {
  if (!currentGoals?.mes) return 31;
  const [year, month] = currentGoals.mes.slice(0, 7).split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function syncDayInputLimits() {
  const monthDays = daysInGoalMonth();
  document
    .querySelectorAll("[data-shift], [data-duo], #remainingDays")
    .forEach((input) => {
      input.max = monthDays;
    });
}

function calculateTargets(days, duoDays) {
  const monthDays = daysInGoalMonth();
  const goal = SHIFT_KEYS.reduce((total, key) => {
    const equivalentFullDays = days[key] + duoDays[key] / 2;
    return total + (Number(currentGoals[key]) / monthDays) * equivalentFullDays;
  }, 0);

  return {
    goal,
    super: goal * SUPER_MULTIPLIER,
    mega: goal * MEGA_MULTIPLIER,
  };
}

function validateForm(days, duoDays, totalDays, soldTotal, remainingDays) {
  if (!currentGoals) {
    return "As metas ainda não foram carregadas do Líder Metas.";
  }

  const monthDays = daysInGoalMonth();

  if (totalDays <= 0) {
    return "Preencha pelo menos um dia da sua escala.";
  }

  if (totalDays > monthDays) {
    return `O total da escala não pode passar de ${monthDays} dias neste mês.`;
  }

  if (soldTotal < 0 || remainingDays < 0 || remainingDays > monthDays) {
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

  document.querySelector(`#${kind}Target`).textContent = moneyFormatter.format(target);
  document.querySelector(`#${kind}Remaining`).textContent = achieved
    ? "Alcançada!"
    : moneyFormatter.format(remaining);
  document.querySelector(`#${kind}Percent`).textContent = `${Math.min(percent, 999).toFixed(0)}%`;
  document.querySelector(`#${kind}PerDay`).textContent = achieved
    ? "Objetivo alcançado"
    : remainingDays > 0
      ? `${moneyFormatter.format(requiredPerDay(remaining, remainingDays))} por dia restante`
      : `${moneyFormatter.format(remaining)} ainda pendente`;
  document.querySelector(`#${kind}Progress`).style.width = `${Math.min(100, percent)}%`;

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
  const duoDays = getDuoDays();
  const totalDays = updateTotalDays();
  const soldTotal = numberFromInput(document.querySelector("#soldTotal").value);
  const remainingDays = wholeNumberFromInput(document.querySelector("#remainingDays").value);
  const message = validateForm(days, duoDays, totalDays, soldTotal, remainingDays);
  const messageElement = document.querySelector("#formMessage");

  messageElement.textContent = message;
  if (message) return;

  const targets = calculateTargets(days, duoDays);
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
  document.body.classList.add("modal-open");
}

function clearForm() {
  document.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  document.querySelector("#formMessage").textContent = "";
  document.querySelector("#results").hidden = true;
  document.body.classList.remove("modal-open");
  updateTotalDays();
}

function closeResults() {
  document.querySelector("#results").hidden = true;
  document.body.classList.remove("modal-open");
}

SHIFT_KEYS.forEach((key) => {
  document.querySelector(`[data-shift="${key}"]`).addEventListener("input", updateTotalDays);
  document.querySelector(`[data-duo="${key}"]`).addEventListener("input", updateTotalDays);
});

document.querySelector("#soldTotal").addEventListener("input", (event) => {
  event.target.value = formatMoneyInput(event.target.value);
});

document.querySelector("#calculateButton").addEventListener("click", calculate);
document.querySelector("#clearButton").addEventListener("click", clearForm);
document.querySelector("#resultsClearButton").addEventListener("click", clearForm);
document.querySelector("#resultsCloseButton").addEventListener("click", closeResults);
document
  .querySelector("#monthSelect")
  .addEventListener("change", (event) => selectGoalsForMonth(event.target.value));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#results").hidden) {
    closeResults();
  }
});

loadGoals();
