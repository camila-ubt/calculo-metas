(() => {
  // Reaplicar a apresentação não deve gerar novas mutações no observador.
  function definirTexto(elemento, texto) {
    if (elemento && elemento.textContent !== texto) elemento.textContent = texto;
  }

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
    definirTexto(explicacao,
      "Use somente quando você trabalhou em um horário diferente do turno normal. Cada bloco abaixo representa 1 dia trabalhado. Se você mudou de loja ou de horário no mesmo dia, adicione outro horário dentro desse mesmo dia.");

    painel.querySelectorAll("[data-special-day]").forEach((dia, indice) => {
      const titulo = dia.querySelector(".special-day-title");
      definirTexto(titulo, `Dia com horário diferente ${indice + 1}`);

      const campoQuantidade = dia.querySelector(".special-day-count");
      if (campoQuantidade) {
        campoQuantidade.hidden = true;
        const input = campoQuantidade.querySelector("[data-special-days]");
        if (input) input.value = "1";
      }

      const adicionarHorario = dia.querySelector("[data-special-add-segment]");
      definirTexto(adicionarHorario, "+ Adicionar outro horário neste mesmo dia");

      const removerDia = dia.querySelector("[data-special-remove-day]");
      definirTexto(removerDia, "Remover este dia");
    });

    const adicionarDia = painel.querySelector("#specialAddDay");
    definirTexto(adicionarDia, "+ Adicionar outro dia com horário diferente");

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
