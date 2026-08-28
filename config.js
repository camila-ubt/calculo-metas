window.APP_CONFIG = {
  supabaseUrl: "https://nnxzkokfbnshdidaioet.supabase.co",
  supabaseAnonKey: "sb_publishable_T9uKhKxBEekm5SZqSl7nNA_qs7pXG3g",
};

const NOMES_DOS_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function criarSeletoresSeparados() {
  const seletorOriginal = document.querySelector("#monthSelect");
  const rotuloOriginal = seletorOriginal?.closest(".month-selector");

  if (!seletorOriginal || !rotuloOriginal || rotuloOriginal.dataset.separado) {
    return;
  }

  rotuloOriginal.dataset.separado = "true";

  const grupo = document.createElement("div");
  grupo.className = "date-selectors";
  rotuloOriginal.parentNode.insertBefore(grupo, rotuloOriginal);
  grupo.append(rotuloOriginal);
  rotuloOriginal.hidden = true;
  rotuloOriginal.style.display = "none";

  const rotuloMes = document.createElement("label");
  rotuloMes.className = "month-selector";
  rotuloMes.innerHTML = `
    <span>Mês</span>
    <select id="seletorMes" aria-label="Selecionar mês das metas"></select>
  `;

  const rotuloAno = document.createElement("label");
  rotuloAno.className = "month-selector";
  rotuloAno.innerHTML = `
    <span>Ano</span>
    <select id="seletorAno" aria-label="Selecionar ano das metas"></select>
  `;

  grupo.append(rotuloMes, rotuloAno);

  const seletorMes = rotuloMes.querySelector("select");
  const seletorAno = rotuloAno.querySelector("select");

  const estilo = document.createElement("style");
  estilo.textContent = `
    .date-selectors {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }

    .date-selectors .month-selector select {
      min-width: 112px;
    }

    .date-selectors .month-selector:last-child select {
      min-width: 76px;
    }

    @media (max-width: 720px) {
      .date-selectors {
        justify-content: center;
        margin-top: 14px;
      }
    }

    @media (max-width: 430px) {
      .date-selectors .month-selector {
        flex: 1 1 145px;
        justify-content: space-between;
      }

      .date-selectors .month-selector select {
        min-width: 0;
      }
    }
  `;
  document.head.append(estilo);

  function lerOpcoesDisponiveis() {
    return [...seletorOriginal.options]
      .map((opcao) => {
        const correspondencia = opcao.value.match(/^(\d{4})-(\d{2})/);
        if (!correspondencia) return null;

        return {
          ano: correspondencia[1],
          mes: correspondencia[2],
          valor: opcao.value,
        };
      })
      .filter(Boolean);
  }

  function sincronizarSeletores() {
    const opcoes = lerOpcoesDisponiveis();
    if (!opcoes.length) return;

    const valorAtual = seletorOriginal.value;
    const atual = opcoes.find((opcao) => opcao.valor === valorAtual) || opcoes[0];
    const anos = [...new Set(opcoes.map((opcao) => opcao.ano))].sort(
      (a, b) => Number(b) - Number(a),
    );

    seletorAno.innerHTML = "";
    anos.forEach((ano) => {
      const opcao = document.createElement("option");
      opcao.value = ano;
      opcao.textContent = ano;
      seletorAno.append(opcao);
    });
    seletorAno.value = atual.ano;

    preencherMeses(atual.ano, atual.mes);
  }

  function preencherMeses(ano, mesPreferido) {
    const opcoes = lerOpcoesDisponiveis();
    const mesesDoAno = new Set(
      opcoes.filter((opcao) => opcao.ano === ano).map((opcao) => opcao.mes),
    );

    seletorMes.innerHTML = "";
    NOMES_DOS_MESES.forEach((nome, indice) => {
      const mes = String(indice + 1).padStart(2, "0");
      const opcao = document.createElement("option");
      opcao.value = mes;
      opcao.textContent = nome;
      opcao.disabled = !mesesDoAno.has(mes);
      seletorMes.append(opcao);
    });

    const primeiroMesDisponivel = [...mesesDoAno].sort()[0];
    seletorMes.value = mesesDoAno.has(mesPreferido)
      ? mesPreferido
      : primeiroMesDisponivel;
  }

  function aplicarSelecao() {
    const opcoes = lerOpcoesDisponiveis();
    const selecionada = opcoes.find(
      (opcao) => opcao.ano === seletorAno.value && opcao.mes === seletorMes.value,
    );

    if (!selecionada) return;
    seletorOriginal.value = selecionada.valor;
    seletorOriginal.dispatchEvent(new Event("change", { bubbles: true }));
  }

  seletorAno.addEventListener("change", () => {
    preencherMeses(seletorAno.value, seletorMes.value);
    aplicarSelecao();
  });

  seletorMes.addEventListener("change", aplicarSelecao);
  seletorOriginal.addEventListener("change", sincronizarSeletores);

  const observador = new MutationObserver(sincronizarSeletores);
  observador.observe(seletorOriginal, { childList: true });
  sincronizarSeletores();
}

document.addEventListener("DOMContentLoaded", () => {
  const administrar = document.querySelector('a[href="admin.html"]');
  const separador = administrar?.nextElementSibling;
  administrar?.remove();
  if (separador?.textContent?.trim() === "•") separador.remove();

  criarSeletoresSeparados();
});
