(() => {
  function quantidadeDeDias() {
    return document.querySelectorAll("[data-special-day]").length;
  }

  function quantidadeDeHorarios() {
    return document.querySelectorAll("[data-special-segment]").length;
  }

  function atualizarResumo() {
    const resumo = document.querySelector("#specialSummary");
    if (!resumo) return;

    const dias = quantidadeDeDias();
    const horarios = quantidadeDeHorarios();
    const texto = `${dias} dia${dias === 1 ? "" : "s"} com horário diferente · ${horarios} horário${horarios === 1 ? "" : "s"} informado${horarios === 1 ? "" : "s"}.`;

    if (resumo.textContent !== texto) resumo.textContent = texto;
  }

  function aplicarTextos() {
    const painel = document.querySelector("#specialCasePanel");
    if (!painel) return;

    const explicacao = painel.querySelector(":scope > p");
    if (explicacao) {
      explicacao.textContent =
        "Use somente quando você trabalhou em um horário diferente do turno normal. Cada bloco abaixo representa 1 dia trabalhado. Se você mudou de loja ou de horário no mesmo dia, adicione outro horário dentro desse mesmo dia.";
    }

    painel.querySelectorAll("[data-special-day]").forEach((dia, indice) => {
      const titulo = dia.querySelector(".special-day-title");
      if (titulo) titulo.textContent = `Dia com horário diferente ${indice + 1}`;

      const campoQuantidade = dia.querySelector(".special-day-count");
      if (campoQuantidade) {
        campoQuantidade.hidden = true;
        const input = campoQuantidade.querySelector("[data-special-days]");
        if (input) input.value = "1";
      }

      const adicionarHorario = dia.querySelector("[data-special-add-segment]");
      if (adicionarHorario) {
        adicionarHorario.textContent = "+ Adicionar outro horário neste mesmo dia";
      }

      const removerDia = dia.querySelector("[data-special-remove-day]");
      if (removerDia) removerDia.textContent = "Remover este dia";
    });

    const adicionarDia = painel.querySelector("#specialAddDay");
    if (adicionarDia) {
      adicionarDia.textContent = "+ Adicionar outro dia com horário diferente";
    }

    atualizarResumo();
  }

  function iniciar() {
    const painel = document.querySelector("#specialCasePanel");
    if (!painel) {
      requestAnimationFrame(iniciar);
      return;
    }

    aplicarTextos();

    const observador = new MutationObserver(() => aplicarTextos());
    observador.observe(painel, { childList: true, subtree: true, characterData: true });

    painel.addEventListener("input", () => queueMicrotask(aplicarTextos));
    painel.addEventListener("change", () => queueMicrotask(aplicarTextos));
    painel.addEventListener("click", () => queueMicrotask(aplicarTextos));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
