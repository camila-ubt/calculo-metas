(() => {
  const STORES = [
    { code: "cb", label: "Clube Bijoux (CB)" },
    { code: "aa", label: "Arte Acessórios (AA)" },
    { code: "ab", label: "Adoro Bijoux (AB)" },
  ];

  let sharedShifts = null;
  let shiftsLoadError = "";

  function minutesFromTime(value) {
    const normalized = String(value || "").slice(0, 5);
    if (!/^\d{2}:\d{2}$/.test(normalized)) return null;
    const [hours, minutes] = normalized.split(":").map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function overlapMinutes(start, end, rangeStart, rangeEnd) {
    return Math.max(0, Math.min(end, rangeEnd) - Math.max(start, rangeStart));
  }

  function formatTime(minutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    return `${hours}:${mins}`;
  }

  async function loadSharedShifts() {
    const config = window.APP_CONFIG || {};
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      shiftsLoadError = "Não foi possível acessar a configuração de horários do Líder Metas.";
      return;
    }

    try {
      const url = `${config.supabaseUrl}/rest/v1/configuracao_horarios_periodos?id=eq.1&select=manha_inicio,manha_fim,noite_inicio,noite_fim`;
      const response = await fetch(url, {
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
        },
      });

      if (!response.ok) throw new Error("Falha ao carregar horários");
      const rows = await response.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row) throw new Error("Configuração não encontrada");

      const morningStart = minutesFromTime(row.manha_inicio);
      const morningEnd = minutesFromTime(row.manha_fim);
      const nightStart = minutesFromTime(row.noite_inicio);
      const nightEnd = minutesFromTime(row.noite_fim);

      if (
        [morningStart, morningEnd, nightStart, nightEnd].some((value) => value === null) ||
        morningStart >= morningEnd ||
        nightStart >= nightEnd ||
        morningEnd > nightStart
      ) {
        throw new Error("Configuração inválida");
      }

      sharedShifts = { morningStart, morningEnd, nightStart, nightEnd };
      shiftsLoadError = "";
      updateSharedScheduleText();
    } catch {
      sharedShifts = null;
      shiftsLoadError =
        "Não foi possível carregar os horários atuais do Líder Metas. Tente novamente antes de calcular um caso especial.";
      updateSharedScheduleText();
    }
  }

  function updateSharedScheduleText() {
    const element = document.querySelector("#specialScheduleSource");
    if (!element) return;

    if (!sharedShifts) {
      element.textContent = shiftsLoadError || "Carregando horários do Líder Metas…";
      return;
    }

    element.textContent =
      `Horários atuais do Líder Metas: manhã ${formatTime(sharedShifts.morningStart)}–${formatTime(sharedShifts.morningEnd)} · ` +
      `noite ${formatTime(sharedShifts.nightStart)}–${formatTime(sharedShifts.nightEnd)}.`;
  }

  function createStyle() {
    const style = document.createElement("style");
    style.textContent = `
      .special-case-toggle {
        width: 100%; margin-top: 12px; padding: 11px 13px;
        border: 1px dashed rgba(123, 41, 72, .28); border-radius: 13px;
        color: var(--wine); background: #fff; cursor: pointer;
        font: inherit; font-weight: 700; text-align: left;
      }
      .special-case-panel {
        margin-top: 10px; padding: 13px; border: 1px solid var(--line);
        border-radius: 14px; background: #fffdfb;
      }
      .special-case-panel[hidden] { display: none; }
      .special-case-panel > p, .special-source {
        margin: 0 0 10px; color: var(--muted); font-size: .78rem; line-height: 1.45;
      }
      .special-source { color: var(--wine-dark); font-weight: 700; }
      .special-day {
        margin-top: 12px; padding: 12px; border: 1px solid var(--line);
        border-radius: 13px; background: white;
      }
      .special-day:first-child { margin-top: 0; }
      .special-day-head {
        display: flex; align-items: end; justify-content: space-between;
        gap: 10px; margin-bottom: 8px;
      }
      .special-day-title { font-weight: 800; color: var(--wine-dark); }
      .special-day-count { width: min(220px, 100%); }
      .special-case-row {
        display: grid;
        grid-template-columns: minmax(130px, 1.4fr) repeat(2, minmax(88px, .8fr)) minmax(95px, .9fr) auto;
        gap: 8px; align-items: end; margin-top: 8px;
      }
      .special-field { display: grid; gap: 5px; }
      .special-field span { color: var(--muted); font-size: .7rem; font-weight: 700; }
      .special-field select, .special-field input {
        width: 100%; min-height: 40px; padding: 8px; border: 1px solid #dacbd0;
        border-radius: 11px; color: var(--ink); background: #fff; font: inherit; font-weight: 600;
      }
      .special-remove {
        width: 40px; min-height: 40px; border: 0; border-radius: 11px;
        color: var(--wine); background: var(--rose-light); cursor: pointer;
        font-size: 1.15rem; font-weight: 800;
      }
      .special-day-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .special-add {
        padding: 8px 11px; border: 0; border-radius: 10px; color: var(--wine);
        background: var(--rose-light); cursor: pointer; font: inherit; font-size: .78rem; font-weight: 700;
      }
      .special-add-day { margin-top: 10px; }
      .special-summary { margin-top: 9px; color: var(--wine-dark); font-size: .75rem; font-weight: 700; }
      @media (max-width: 820px) {
        .special-case-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .special-remove { width: 100%; }
      }
      @media (max-width: 520px) {
        .special-day-head { align-items: stretch; flex-direction: column; }
        .special-day-count { width: 100%; }
        .special-case-row { grid-template-columns: 1fr; }
      }
    `;
    document.head.append(style);
  }

  function segmentMarkup() {
    const storeOptions = STORES.map(
      (store) => `<option value="${store.code}">${store.label}</option>`,
    ).join("");

    return `
      <div class="special-case-row" data-special-segment>
        <label class="special-field">
          <span>Loja</span>
          <select data-special-store>${storeOptions}</select>
        </label>
        <label class="special-field">
          <span>Entrada</span>
          <input data-special-start type="time" value="12:00" />
        </label>
        <label class="special-field">
          <span>Saída</span>
          <input data-special-end type="time" value="16:00" />
        </label>
        <label class="special-field">
          <span>Trabalhou</span>
          <select data-special-mode>
            <option value="solo">Sozinha</option>
            <option value="duo">Em dupla</option>
          </select>
        </label>
        <button type="button" class="special-remove" data-special-remove-segment aria-label="Remover trecho">×</button>
      </div>
    `;
  }

  function dayMarkup(index = 1) {
    return `
      <div class="special-day" data-special-day>
        <div class="special-day-head">
          <div class="special-day-title">Dia especial ${index}</div>
          <label class="special-field special-day-count">
            <span>Quantos dias tiveram esta mesma jornada?</span>
            <input data-special-days type="number" min="1" max="31" inputmode="numeric" value="1" />
          </label>
        </div>
        <div data-special-segments>${segmentMarkup()}</div>
        <div class="special-day-actions">
          <button type="button" class="special-add" data-special-add-segment>+ Adicionar outro trecho no mesmo dia</button>
          <button type="button" class="special-add" data-special-remove-day>Remover este dia</button>
        </div>
      </div>
    `;
  }

  function renumberDays() {
    document.querySelectorAll("[data-special-day]").forEach((day, index) => {
      const title = day.querySelector(".special-day-title");
      if (title) title.textContent = `Dia especial ${index + 1}`;
    });
  }

  function mount() {
    const scheduleCard = document.querySelector(".schedule-card");
    const totals = scheduleCard?.querySelector(".total-days");
    if (!scheduleCard || !totals || document.querySelector("#specialCaseToggle")) return;

    createStyle();

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "specialCaseToggle";
    toggle.className = "special-case-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Meu horário foi diferente do turno normal";

    const panel = document.createElement("div");
    panel.id = "specialCasePanel";
    panel.className = "special-case-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <p>
        Use somente nos dias com horário diferente. Se no mesmo dia você passou por mais de uma loja ou período,
        adicione os trechos dentro do mesmo “Dia especial”. Não repita esse dia nos campos de manhã/noite acima.
      </p>
      <div class="special-source" id="specialScheduleSource">Carregando horários do Líder Metas…</div>
      <div id="specialDays">${dayMarkup(1)}</div>
      <button type="button" class="special-add special-add-day" id="specialAddDay">+ Adicionar outro dia especial</button>
      <div class="special-summary" id="specialSummary">1 dia especial configurado.</div>
    `;

    totals.insertAdjacentElement("beforebegin", toggle);
    toggle.insertAdjacentElement("afterend", panel);

    toggle.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
      toggle.textContent = panel.hidden
        ? "Meu horário foi diferente do turno normal"
        : "Ocultar horário especial";
    });

    panel.querySelector("#specialAddDay").addEventListener("click", () => {
      const days = panel.querySelector("#specialDays");
      days.insertAdjacentHTML("beforeend", dayMarkup(days.children.length + 1));
      updateSummary();
    });

    panel.addEventListener("click", (event) => {
      const addSegment = event.target.closest("[data-special-add-segment]");
      if (addSegment) {
        addSegment.closest("[data-special-day]")
          .querySelector("[data-special-segments]")
          .insertAdjacentHTML("beforeend", segmentMarkup());
        updateSummary();
        return;
      }

      const removeSegment = event.target.closest("[data-special-remove-segment]");
      if (removeSegment) {
        const day = removeSegment.closest("[data-special-day]");
        const segments = day.querySelectorAll("[data-special-segment]");
        if (segments.length === 1) return;
        removeSegment.closest("[data-special-segment]").remove();
        updateSummary();
        return;
      }

      const removeDay = event.target.closest("[data-special-remove-day]");
      if (removeDay) {
        const days = panel.querySelectorAll("[data-special-day]");
        if (days.length === 1) return;
        removeDay.closest("[data-special-day]").remove();
        renumberDays();
        updateSummary();
      }
    });

    panel.addEventListener("input", updateSummary);
    panel.addEventListener("change", updateSummary);

    document.querySelector("#clearButton")?.addEventListener("click", clearSpecialCases);
    document.querySelector("#resultsClearButton")?.addEventListener("click", clearSpecialCases);
    document.querySelector("#calculateButton")?.addEventListener(
      "click",
      interceptSpecialCalculation,
      true,
    );

    loadSharedShifts();
  }

  function getSpecialDays() {
    return [...document.querySelectorAll("[data-special-day]")]
      .map((day) => ({
        days: wholeNumberFromInput(day.querySelector("[data-special-days]").value),
        segments: [...day.querySelectorAll("[data-special-segment]")].map((row) => ({
          store: row.querySelector("[data-special-store]").value,
          start: row.querySelector("[data-special-start]").value,
          end: row.querySelector("[data-special-end]").value,
          mode: row.querySelector("[data-special-mode]").value,
        })),
      }))
      .filter((day) => day.days > 0);
  }

  function updateSummary() {
    const summary = document.querySelector("#specialSummary");
    if (!summary) return;
    const groups = getSpecialDays();
    const days = groups.reduce((total, group) => total + group.days, 0);
    const segments = groups.reduce((total, group) => total + group.segments.length, 0);
    summary.textContent = `${days} dia${days === 1 ? "" : "s"} especial${days === 1 ? "" : "is"} · ${segments} trecho${segments === 1 ? "" : "s"}.`;
  }

  function clearSpecialCases() {
    const days = document.querySelector("#specialDays");
    if (!days) return;
    days.innerHTML = dayMarkup(1);
    updateSummary();
  }

  function validateSpecialDays(groups) {
    if (!sharedShifts) return shiftsLoadError || "Os horários do Líder Metas ainda não foram carregados.";

    const monthDays = daysInGoalMonth();
    const earliest = Math.min(sharedShifts.morningStart, sharedShifts.nightStart);
    const latest = Math.max(sharedShifts.morningEnd, sharedShifts.nightEnd);

    for (const group of groups) {
      if (group.days > monthDays) {
        return `Um caso especial não pode passar de ${monthDays} dias neste mês.`;
      }

      const intervals = [];
      for (const segment of group.segments) {
        const start = minutesFromTime(segment.start);
        const end = minutesFromTime(segment.end);

        if (start === null || end === null || start >= end) {
          return "Confira os horários do caso especial: a saída precisa ser posterior à entrada.";
        }
        if (start < earliest || end > latest) {
          return `Os horários especiais precisam ficar entre ${formatTime(earliest)} e ${formatTime(latest)}, conforme o Líder Metas.`;
        }

        const covered =
          overlapMinutes(start, end, sharedShifts.morningStart, sharedShifts.morningEnd) +
          overlapMinutes(start, end, sharedShifts.nightStart, sharedShifts.nightEnd);
        if (covered !== end - start) {
          return "Existe um trecho fora dos períodos configurados no Líder Metas.";
        }

        intervals.push({ start, end });
      }

      intervals.sort((a, b) => a.start - b.start);
      for (let i = 1; i < intervals.length; i += 1) {
        if (intervals[i].start < intervals[i - 1].end) {
          return "Há horários sobrepostos dentro do mesmo dia especial.";
        }
      }
    }

    return "";
  }

  function specialTarget(groups) {
    const monthDays = daysInGoalMonth();
    const morningDuration = sharedShifts.morningEnd - sharedShifts.morningStart;
    const nightDuration = sharedShifts.nightEnd - sharedShifts.nightStart;

    return groups.reduce((grandTotal, group) => {
      const groupTarget = group.segments.reduce((dayTotal, segment) => {
        const start = minutesFromTime(segment.start);
        const end = minutesFromTime(segment.end);
        const morningMinutes = overlapMinutes(
          start, end, sharedShifts.morningStart, sharedShifts.morningEnd,
        );
        const nightMinutes = overlapMinutes(
          start, end, sharedShifts.nightStart, sharedShifts.nightEnd,
        );
        const modeFactor = segment.mode === "duo" ? 0.5 : 1;
        const morningGoal = Number(currentGoals[`${segment.store}_manha`] || 0) / monthDays;
        const nightGoal = Number(currentGoals[`${segment.store}_noite`] || 0) / monthDays;

        return dayTotal + modeFactor * (
          morningGoal * (morningMinutes / morningDuration) +
          nightGoal * (nightMinutes / nightDuration)
        );
      }, 0);

      return grandTotal + group.days * groupTarget;
    }, 0);
  }

  function regularCalendarDays(days, duoDays) {
    return SHIFT_KEYS.reduce((total, key) => total + days[key] + duoDays[key], 0);
  }

  function interceptSpecialCalculation(event) {
    const panel = document.querySelector("#specialCasePanel");
    if (!panel || panel.hidden) return;

    const groups = getSpecialDays();
    if (!groups.length) return;

    event.stopImmediatePropagation();
    calculateWithSpecialCases(groups);
  }

  function calculateWithSpecialCases(groups) {
    const messageElement = document.querySelector("#formMessage");
    if (!currentGoals) {
      messageElement.textContent = "As metas ainda não foram carregadas do Líder Metas.";
      return;
    }

    const specialError = validateSpecialDays(groups);
    if (specialError) {
      messageElement.textContent = specialError;
      document.querySelector("#results").hidden = true;
      document.body.classList.remove("modal-open");
      return;
    }

    const days = getScheduledDays();
    const duoDays = getDuoDays();
    const regularDays = regularCalendarDays(days, duoDays);
    const specialDays = groups.reduce((total, group) => total + group.days, 0);
    const totalDays = regularDays + specialDays;
    const monthDays = daysInGoalMonth();
    const soldTotal = numberFromInput(document.querySelector("#soldTotal").value);
    const remainingDays = wholeNumberFromInput(document.querySelector("#remainingDays").value);

    if (totalDays <= 0) {
      messageElement.textContent = "Preencha pelo menos um dia da sua escala.";
      return;
    }
    if (totalDays > monthDays) {
      messageElement.textContent = `O total da escala, incluindo os casos especiais, não pode passar de ${monthDays} dias neste mês.`;
      return;
    }
    if (remainingDays > totalDays) {
      messageElement.textContent = "Os dias restantes não podem ser maiores que o total da escala.";
      return;
    }

    const base = calculateTargets(days, duoDays).goal;
    const goal = base + specialTarget(groups);
    const targets = {
      goal,
      super: goal * SUPER_MULTIPLIER,
      mega: goal * MEGA_MULTIPLIER,
    };

    messageElement.textContent = "";
    document.querySelector("#totalScheduledDays").textContent = totalDays;
    updateResultCard("goal", targets.goal, soldTotal, remainingDays);
    updateResultCard("super", targets.super, soldTotal, remainingDays);
    updateResultCard("mega", targets.mega, soldTotal, remainingDays);
    document.querySelector("#statusMessage").textContent = statusText(
      targets, soldTotal, remainingDays, totalDays,
    );

    const results = document.querySelector("#results");
    results.hidden = false;
    document.body.classList.add("modal-open");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
