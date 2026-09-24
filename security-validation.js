(() => {
  const CAMPOS_METAS = [
    "mes",
    "cb_manha",
    "cb_noite",
    "aa_manha",
    "aa_noite",
    "ab_manha",
    "ab_noite",
  ];

  const CAMPOS_HORARIOS = [
    "manha_inicio",
    "manha_fim",
    "noite_inicio",
    "noite_fim",
  ];

  function objetoSimples(valor) {
    return Boolean(
      valor &&
      typeof valor === "object" &&
      !Array.isArray(valor) &&
      (Object.getPrototypeOf(valor) === Object.prototype || Object.getPrototypeOf(valor) === null)
    );
  }

  function possuiSomenteCampos(objeto, campos) {
    const recebidos = Object.keys(objeto).sort();
    const esperados = [...campos].sort();
    return recebidos.length === esperados.length &&
      recebidos.every((campo, indice) => campo === esperados[indice]);
  }

  function numeroSeguro(valor) {
    const numero = typeof valor === "number" ? valor : Number(valor);
    return Number.isFinite(numero) && numero >= 0 && numero <= 1_000_000_000
      ? numero
      : null;
  }

  function mesValido(valor) {
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-01$/.test(valor)) return false;
    const [ano, mes] = valor.split("-").map(Number);
    return ano >= 2000 && ano <= 2100 && mes >= 1 && mes <= 12;
  }

  function horarioValido(valor) {
    if (typeof valor !== "string") return false;
    const correspondencia = valor.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (!correspondencia) return false;
    const horas = Number(correspondencia[1]);
    const minutos = Number(correspondencia[2]);
    return horas >= 0 && horas <= 23 && minutos >= 0 && minutos <= 59;
  }

  function validarMetasPublicas(valor) {
    if (!Array.isArray(valor) || valor.length === 0 || valor.length > 120) {
      throw new Error("Resposta de metas inválida.");
    }

    const meses = new Set();

    return valor.map((registro) => {
      if (!objetoSimples(registro) || !possuiSomenteCampos(registro, CAMPOS_METAS)) {
        throw new Error("Formato de metas inesperado.");
      }

      if (!mesValido(registro.mes) || meses.has(registro.mes)) {
        throw new Error("Mês de metas inválido ou duplicado.");
      }
      meses.add(registro.mes);

      const normalizado = { mes: registro.mes };
      for (const campo of CAMPOS_METAS.slice(1)) {
        const numero = numeroSeguro(registro[campo]);
        if (numero === null) throw new Error("Valor de meta inválido.");
        normalizado[campo] = numero;
      }

      return Object.freeze(normalizado);
    });
  }

  function validarHorariosPublicos(valor) {
    if (!Array.isArray(valor) || valor.length !== 1) {
      throw new Error("Resposta de horários inválida.");
    }

    const registro = valor[0];
    if (!objetoSimples(registro) || !possuiSomenteCampos(registro, CAMPOS_HORARIOS)) {
      throw new Error("Formato de horários inesperado.");
    }

    const normalizado = {};
    for (const campo of CAMPOS_HORARIOS) {
      if (!horarioValido(registro[campo])) throw new Error("Horário inválido.");
      normalizado[campo] = String(registro[campo]).slice(0, 5);
    }

    return Object.freeze(normalizado);
  }

  function validarConfiguracaoPublica(config) {
    if (!objetoSimples(config)) return false;

    try {
      const url = new URL(config.supabaseUrl);
      return (
        url.protocol === "https:" &&
        url.hostname.endsWith(".supabase.co") &&
        typeof config.supabaseAnonKey === "string" &&
        config.supabaseAnonKey.startsWith("sb_publishable_") &&
        config.supabaseAnonKey.length >= 20
      );
    } catch {
      return false;
    }
  }

  globalThis.MetaSecurity = Object.freeze({
    validarMetasPublicas,
    validarHorariosPublicos,
    validarConfiguracaoPublica,
  });
})();
