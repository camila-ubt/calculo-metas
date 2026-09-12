(() => {
  const DEFAULT_SHIFTS = Object.freeze({
    morningStart: 9 * 60,
    morningEnd: 16 * 60,
    nightStart: 16 * 60,
    nightEnd: 22 * 60,
  });

  const STORES = [
    { code: "cb", label: "Clube Bijoux (CB)" },
    { code: "aa", label: "Arte Acessórios (AA)" },
    { code: "ab", label: "Adoro Bijoux (AB)" },
  ];

  function minutesFromTime(value) {
    if (!/^\d{2}:\d{2}$/.test(String(value || ""))) return null;
    const [hours, minutes] = value.split(":").map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function overlapMinutes(start, end, rangeStart, rangeEnd) {
    return Math.max(0, Math.min(end, rangeEnd) - Math.max(start, rangeStart));
  }

  function createStyle() {
    const style = document.createElement("style");
    style.textContent = `
      .special-case-toggle {
        width: 100%;
        margin-top: 12px;
        padding: 11px 13px;
        border: 1px dashed rgba(123, 41, 72, .28);
        border-radius: 13px;
        color: var(--wine);
        background: #fff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        text-align: left;
      }

      .special-case-panel {
        margin-top: 10px;
        padding: 13px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #fffdfb;
      }

      .special-case-panel[hidden] { display: none; }

      .special-case-panel > p {
        margin: 0 0 10px;
        color: var(--muted);
        font-size: .78rem;
        line-height: 1.45;
      }

      .special-case-row {
        display: grid;
        grid-template-columns: minmax(130px, 1.4fr) repeat(3, minmax(88px, .8fr)) minmax(95px, .9fr) auto;
        gap: 8px;
        align-items: end;
        margin-top: 9px;
        padding-top: 9px;
        border-top: 1px solid var(--line);
      }

      .special-case-row:first-child {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }

      .special-field {
        display: grid;
        gap: 5px;
      }

      .special-field span {
        color: var(--muted);
        font-size: .7rem;
        font-weight: 700;
      }

      .special-field select,
      .special-field input {
        width: 100%;
        min-height: 40px;
        padding: 8px;
        border: 1px solid #dacbd0;
        border-radius: 11px;
        color: var(--ink);
        background: #fff;
        font: inherit;
        font-weight: 600;
      }

      .special-remove {
        width: 40px;
        min-height: 40px;
        border: 0;
        border-radius: 11px;
        color: var(--wine);
        background: var(--rose-light);
        cursor: pointer;
        font-size: 1.15rem;
        font-weight: 800;
      }

      .special-add {
        margin-top: 10px;
        padding: 8px 11px;
        border: 0;
        border-radius: 10px;
        color: var(--wine);
        background: var(--rose-light);
        cursor: pointer;
        font: inherit;
        font-size: .78rem;
        font-weight: 700;
      }

      .special-summary {
        margin-top: 9px;
        color: var(--wine-dark);
        font-size: .75rem;
        font-weight: 700;
      }

      @media (max-width: 820px) {
        .special-case-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .special-remove {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .special-case-row {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.append(style);
  }

  function rowMarkup() {
    const storeOptions = STORES.map(
      (store) => `<option value="${store.code}">${store.label}</option>`,
    ).join("");

    return `
      <div class="special-case-row" data-special-row>
        <label class="special-field">
          <span>Loja</span>
          <select data-special-store>${storeOptions}</select>
        </label>
        <label class="special-field">
          <span>Entrada</span>
          <input data-special-start type="time" value="13:00" />
        </label>
        <label class="special-field">
          <span>Saída</span>
          <input data-special-end type="time" value="20:00" />
        </label>
        <label class="special-field">
          <span>Dias</span>
          <input data-special-days type="number" min="1" max="31" inputmode="numeric" placeholder="0" />
        </label>
        <label class="special-field">
          <span>Trabalhou</span>
          <select data-special-mode>
            <option value="solo">Sozinha</option>
            <option value="duo">Em dupla</option>
          </select>
        </label>
        <button type="button" class="special-remove" data-special-remove aria-label="Remover caso especial">×</button>
      </div>
    `;
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
        Use somente para dias em que você entrou ou saiu em um horário diferente do turno normal.
        Não repita esses mesmos dias nos campos de manhã/noite acima. A calculadora divide o horário
        proporcionalmente entre manhã (09:00–16:00) e noite (16:00–22:00).
      </p>
      <div id="specialRows">${rowMarkup()}</div>
      <button type="button" class="special-add" id="specialAdd">+ Adicionar outro período especial</button>
      <div class="special-summary" id="specialSummary">Nenhum dia especial preenchido.</div>
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

    panel.querySelector("#specialAdd").addEventListener("click", () => {
      panel.querySelector("#specialRows").insertAdjacentHTML("beforeend", rowMarkup());
      updateSummary();
    });

    panel.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-special-remove]");
      if (!remove) return;
      const rows = panel.querySelectorAll("[data-special-row]");
      if (rows.length === 1) {
        rows[0].querySelector("[data-special-days]").value = "";
        return updateSummary();
      }
      remove.closest("[data-special-row]").remove();
      updateSummary();
    });

    panel.addEventListener("input", updateSummary);
    panel.addEventListener("change", updateSummary);

    document.querySelector("#clearButton")?.addEventListener("click", clearSpecialCases);
    document.querySelector("#resultsClearButton")?.addEventListener("click", clearSpecialCases);
    document.querySelector("#calculateButton")?.addEventListener("click", calculateWithSpecialCases);
  }

  function getSpecialCases() {
    return [...document.querySelectorAll("[data-special-row]")]
      .map((row) => ({
        store: row.querySelector("[data-special-store]").value,
        start: row.querySelector("[data-special-start]").value,
        end: row.querySelector("[data-special-end]").value,
        days: wholeNumberFromInput(row.querySelector("[data-special-days]").value),
        mode: row.querySelector("[data-special-mode]").value,
      }))
      .filter((item) => item.days > 0);
  }

  function updateSummary() {
    const summary = document.querySelector("#specialSummary");
    if (!summary) return;
    const cases = getSpecialCases();
    const days = cases.reduce((total, item) => total + item.days, 0);
    summary.textContent = days
      ? `${days} dia${days === 1 ? "" : "s"} com horário especial.`
      : "Nenhum dia especial preenchido.";
  }

  function clearSpecialCases() {
    const rows = document.querySelector("#specialRows");
    if (!rows) return;
    rows.innerHTML = rowMarkup();
    updateSummary();
  }

  function validateSpecialCases(cases) {
    const monthDays = daysInGoalMonth();

    for (const item of cases) {
      const start = minutesFromTime(item.start);
      const end = minutesFromTime(item.end);

      if (start === null || end === null || start >= end) {
        return "Confira os horários do caso especial: a saída precisa ser posterior à entrada.";
      }

      if (start < DEFAULT_SHIFTS.morningStart || end > DEFAULT_SHIFTS.nightEnd) {
        return "No caso especial, informe horários entre 09:00 e 22:00.";
      }

      if (item.days > monthDays) {
        return `Um período especial não pode passar de ${monthDays} dias neste mês.`;
      }
    }

    return "";
  }

  function specialTarget(cases) {
    const monthDays = daysInGoalMonth();

    return cases.reduce((total, item) => {
      const start = minutesFromTime(item.start);
      const end = minutesFromTime(item.end);
      const morningMinutes = overlapMinutes(
        start,
        end,
        DEFAULT_SHIFTS.morningStart,
        DEFAULT_SHIFTS.morningEnd,
      );
      const nightMinutes = overlapMinutes(
        start,
        end,
        DEFAULT_SHIFTS.nightStart,
        DEFAULT_SHIFTS.nightEnd,
      );
      const morningFraction = morningMinutes /
        (DEFAULT_SHIFTS.morningEnd - DEFAULT_SHIFTS.morningStart);
      const nightFraction = nightMinutes /
        (DEFAULT_SHIFTS.nightEnd - DEFAULT_SHIFTS.nightStart);
      const modeFactor = item.mode === "duo" ? 0.5 : 1;
      const morningGoal = Number(currentGoals[`${item.store}_manha`] || 0) / monthDays;
      const nightGoal = Number(currentGoals[`${item.store}_noite`] || 0) / monthDays;

      return total + item.days * modeFactor * (
        morningGoal * morningFraction + nightGoal * nightFraction
      );
    }, 0);
  }

  function regularCalendarDays(days, duoDays) {
    return SHIFT_KEYS.reduce((total, key) => total + days[key] + duoDays[key], 0);
  }

  function calculateWithSpecialCases() {
    const cases = getSpecialCases();
    if (!cases.length) return;

    const messageElement = document.querySelector("#formMessage");
    if (!currentGoals) {
      messageElement.textContent = "As metas ainda não foram carregadas do Líder Metas.";
      return;
    }

    const specialError = validateSpecialCases(cases);
    if (specialError) {
      messageElement.textContent = specialError;
      document.querySelector("#results").hidden = true;
      document.body.classList.remove("modal-open");
      return;
    }

    const days = getScheduledDays();
    const duoDays = getDuoDays();
    const regularDays = regularCalendarDays(days, duoDays);
    const specialDays = cases.reduce((total, item) => total + item.days, 0);
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
    const goal = base + specialTarget(cases);
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
      targets,
      soldTotal,
      remainingDays,
      totalDays,
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
