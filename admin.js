const SHIFT_KEYS = [
  "cb_manha",
  "cb_noite",
  "aa_manha",
  "aa_noite",
  "ab_manha",
  "ab_noite",
];

const SESSION_KEY = "calculo_metas_admin_session";

function isConfigured() {
  const config = window.APP_CONFIG || {};
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function apiHeaders(accessToken) {
  const { supabaseAnonKey } = window.APP_CONFIG;
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken || supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
}

function showMessage(element, message, type = "") {
  element.textContent = message;
  element.className = `admin-message ${type}`.trim();
}

async function login(email, password) {
  const { supabaseUrl } = window.APP_CONFIG;
  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ email, password }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error("E-mail ou senha incorretos.");
  }

  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    email: data.user.email,
  };
}

async function loadGoals(accessToken, month) {
  const { supabaseUrl } = window.APP_CONFIG;
  const response = await fetch(
    `${supabaseUrl}/rest/v1/metas_mensais?mes=eq.${month}-01&select=*`,
    { headers: apiHeaders(accessToken) },
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar as metas.");
  }

  const [goals] = await response.json();
  return goals;
}

async function updateGoals(accessToken, goals) {
  const { supabaseUrl } = window.APP_CONFIG;
  const response = await fetch(
    `${supabaseUrl}/rest/v1/metas_mensais?on_conflict=mes`,
    {
      method: "POST",
      headers: {
        ...apiHeaders(accessToken),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(goals),
    },
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Sua sessão expirou. Entre novamente.");
    }
    throw new Error("Não foi possível salvar. Tente novamente.");
  }
}

function fillGoalsForm(goals) {
  document.querySelector("#mes").value = goals.mes.slice(0, 7);
  SHIFT_KEYS.forEach((key) => {
    document.querySelector(`[data-goal="${key}"]`).value = goals[key];
  });
}

function clearGoalValues() {
  SHIFT_KEYS.forEach((key) => {
    document.querySelector(`[data-goal="${key}"]`).value = "";
  });
}

async function loadSelectedMonth(session, month) {
  const goalsMessage = document.querySelector("#goalsMessage");
  const monthMessage = document.querySelector("#monthMessage");
  showMessage(goalsMessage, "");
  showMessage(monthMessage, "Carregando metas…");

  try {
    const goals = await loadGoals(session.accessToken, month);
    if (goals) {
      fillGoalsForm(goals);
      showMessage(monthMessage, "Metas já cadastradas para este mês.", "success");
    } else {
      clearGoalValues();
      showMessage(monthMessage, "Mês novo: preencha as seis metas mensais.");
    }
  } catch (error) {
    showMessage(monthMessage, error.message, "error");
  }
}

async function openGoalsArea(session) {
  const loginCard = document.querySelector("#loginCard");
  const goalsCard = document.querySelector("#goalsCard");
  const goalsMessage = document.querySelector("#goalsMessage");

  try {
    document.querySelector("#sessionEmail").textContent = session.email;
    loginCard.hidden = true;
    goalsCard.hidden = false;
    const now = new Date();
    const month =
      document.querySelector("#mes").value ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    document.querySelector("#mes").value = month;
    await loadSelectedMonth(session, month);
  } catch (error) {
    clearSession();
    loginCard.hidden = false;
    goalsCard.hidden = true;
    showMessage(document.querySelector("#loginMessage"), error.message, "error");
    showMessage(goalsMessage, "");
  }
}

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.querySelector("#loginMessage");
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  showMessage(message, "Entrando…");

  try {
    const session = await login(
      document.querySelector("#email").value.trim(),
      document.querySelector("#password").value,
    );
    saveSession(session);
    showMessage(message, "");
    await openGoalsArea(session);
  } catch (error) {
    showMessage(message, error.message, "error");
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#goalsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const session = getSession();
  const message = document.querySelector("#goalsMessage");
  const button = document.querySelector("#saveButton");

  if (!session) {
    showMessage(message, "Sua sessão expirou. Entre novamente.", "error");
    return;
  }

  const goals = {
    mes: `${document.querySelector("#mes").value}-01`,
    atualizado_em: new Date().toISOString(),
  };

  SHIFT_KEYS.forEach((key) => {
    goals[key] = Number(document.querySelector(`[data-goal="${key}"]`).value);
  });

  button.disabled = true;
  showMessage(message, "Salvando…");

  try {
    await updateGoals(session.accessToken, goals);
    showMessage(
      message,
      "Metas atualizadas! A calculadora já está usando os novos valores.",
      "success",
    );
  } catch (error) {
    showMessage(message, error.message, "error");
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#logoutButton").addEventListener("click", () => {
  clearSession();
  document.querySelector("#goalsCard").hidden = true;
  document.querySelector("#loginCard").hidden = false;
  document.querySelector("#loginForm").reset();
});

document.querySelector("#mes").addEventListener("change", async (event) => {
  const session = getSession();
  if (session) await loadSelectedMonth(session, event.target.value);
});

async function initialize() {
  if (!isConfigured()) {
    document.querySelector("#setupCard").hidden = false;
    document.querySelector("#loginCard").hidden = true;
    return;
  }

  const session = getSession();
  if (session?.accessToken && session.expiresAt > Date.now()) {
    await openGoalsArea(session);
  }
}

initialize();
