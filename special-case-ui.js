(() => {
  // Reaplicar a apresentação não deve gerar novas mutações no observador.
  function definirTexto(elemento, texto) {
    if (elemento && elemento.textContent !== texto) elemento.textContent = texto;
  }

  function painelEspecial() {
    return document.querySelector("#specialCasePanel");
  }

  function quantidadeDeDias() {
    return document.querySelectorAll("[data-special-day]").length;
  }

  function quantidadeDeHorarios() {
    return document.querySelectorAll("[data-special-segment]").length;
  }

  function casoEspecialAtivo() {
    const painel = painelEspecial();
    return Boolean(painel && !painel.hidden);
  }

  function numeroInteiro(valor) {
    const numero = Number(String(valor ?? "").replace(",", "."));
    return Number.isFinite(numero) ? Math.max(0, Math.floor(numero)) : 0;
  }

  function totalDiasRegulares() {
    return [...document.querySelectorAll("[data-shift], [data-duo]")]
      .reduce((total, input) => total + numeroInteiro(input.value), 0);
  }

  function atualizarTotalEscala() {
    const total = document.querySelector("#totalScheduledDays");
    if (!total) return;

    const diasEspeciais = casoEspecialAtivo() ? quantidadeDeDias() : 0;
    total.textContent = totalDiasRegulares() + diasEspeciais;
  }

  function atualizarResumo() {
    const resumo = document.querySelector("#specialSummary");
    if (!resumo) return;

    const dias = quantidadeDeDias();
    const horarios = quantidadeDeHorarios();
    const texto = `${dias} dia${dias === 1 ? "" : "s"} com horário diferente · ${horarios} horário${horarios === 1 ? "" : "s"} informado${horarios === 1 ? "" : "s"}.`;

    if (resumo.textContent !== texto) resumo.textContent = texto;
  }

  function atualizarBotoesDeRemocao() {
    document.querySelectorAll("[data-special-day]").forEach((dia) => {
      const horarios = dia.querySelectorAll("[data-special-segment]");
      horarios.forEach((horario) => {
        const remover = horario.querySelector("[data-special-remove-segment]");
        if (remover) remover.hidden = horarios.length <= 1;
      });
    });
  }

  function aplicarTextos() {
    const painel = painelEspecial();
    if (!painel) return;

    const explicacao = painel.querySelector(":scope > p");
    definirTexto(explicacao,
      "Use somente quando você trabalhou em um horário diferente do turno normal. Cada bloco abaixo representa 1 dia trabalhado. Se você mudou de loja ou de horário no mesmo dia, adicione outro horário dentro desse mesmo dia.");

    painel.querySelectorAll("[data-special-day]").forEach((dia, indice) => {
      const titulo = dia.querySelector(".special-day-title");
      definirTexto(titulo, `Dia com horário diferente ${indice + 1}`);

      const campoQuantidade = dia.querySelector(".special-day-count");
      if (campoQuantidade) {
        campoQuantidade.hidden = true;
        const input = campoQuantidade.querySelector("[data-special-days]");
        if (input && input.value !== "1") input.value = "1";
      }

      const adicionarHorario = dia.querySelector("[data-special-add-segment]");
      definirTexto(adicionarHorario, "+ Adicionar outro horário neste mesmo dia");

      const removerDia = dia.querySelector("[data-special-remove-day]");
      definirTexto(removerDia, "Remover este dia");
    });

    const adicionarDia = painel.querySelector("#specialAddDay");
    definirTexto(adicionarDia, "+ Adicionar outro dia com horário diferente");

    atualizarBotoesDeRemocao();
    atualizarResumo();
    atualizarTotalEscala();
  }

  function removerHorarioOuDia(evento) {
    const painel = painelEspecial();
    if (!painel) return;

    const removerHorario = evento.target.closest("[data-special-remove-segment]");
    if (removerHorario) {
      const dia = removerHorario.closest("[data-special-day]");
      const horarios = dia?.querySelectorAll("[data-special-segment]") || [];

      evento.preventDefault();
      evento.stopImmediatePropagation();

      if (horarios.length <= 1) return;

      removerHorario.closest("[data-special-segment]")?.remove();
      aplicarTextos();
      return;
    }

    const removerDia = evento.target.closest("[data-special-remove-day]");
    if (!removerDia) return;

    evento.preventDefault();
    evento.stopImmediatePropagation();

    removerDia.closest("[data-special-day]")?.remove();
    aplicarTextos();
  }

  function limparDiasEspeciais() {
    const painel = painelEspecial();
    const dias = document.querySelector("#specialDays");
    const toggle = document.querySelector("#specialCaseToggle");
    if (!painel || !dias || !toggle) return;

    dias.innerHTML = "";
    painel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    definirTexto(toggle, "Meu horário foi diferente do turno normal");
    aplicarTextos();
  }

  function iniciar() {
    const painel = painelEspecial();
    if (!painel) {
      requestAnimationFrame(iniciar);
      return;
    }

    aplicarTextos();

    const observador = new MutationObserver(() => aplicarTextos());
    observador.observe(painel, { childList: true, subtree: true, characterData: true });

    // Intercepta somente as remoções. Assim o último dia também pode ser excluído
    // e o X nunca deixa um dia sem horário.
    painel.addEventListener("click", removerHorarioOuDia, true);

    painel.addEventListener("input", () => queueMicrotask(aplicarTextos));
    painel.addEventListener("change", () => queueMicrotask(aplicarTextos));
    painel.addEventListener("click", () => queueMicrotask(aplicarTextos));

    document.querySelectorAll("[data-shift], [data-duo]").forEach((input) => {
      input.addEventListener("input", () => queueMicrotask(atualizarTotalEscala));
    });

    const toggle = document.querySelector("#specialCaseToggle");
    toggle?.addEventListener("click", () => {
      if (!painel.hidden && quantidadeDeDias() === 0) {
        painel.querySelector("#specialAddDay")?.click();
      }
      queueMicrotask(aplicarTextos);
    });

    document.querySelector("#clearButton")?.addEventListener("click", () => {
      queueMicrotask(limparDiasEspeciais);
    });
    document.querySelector("#resultsClearButton")?.addEventListener("click", () => {
      queueMicrotask(limparDiasEspeciais);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
