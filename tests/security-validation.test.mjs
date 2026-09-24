import test from "node:test";
import assert from "node:assert/strict";

await import("../security-validation.js");

const { validarMetasPublicas, validarHorariosPublicos, validarConfiguracaoPublica } = globalThis.MetaSecurity;

test("aceita somente o formato público esperado das metas", () => {
  const dados = validarMetasPublicas([
    {
      mes: "2026-09-01",
      cb_manha: 100,
      cb_noite: "120",
      aa_manha: 90,
      aa_noite: 95,
      ab_manha: 80,
      ab_noite: 85,
    },
  ]);

  assert.equal(dados.length, 1);
  assert.equal(dados[0].cb_noite, 120);
});

test("rejeita campos extras e valores inválidos nas metas", () => {
  assert.throws(() => validarMetasPublicas([
    {
      mes: "2026-09-01",
      cb_manha: 100,
      cb_noite: 120,
      aa_manha: 90,
      aa_noite: 95,
      ab_manha: 80,
      ab_noite: 85,
      atualizado_por: "uuid-nao-deve-ser-exposto",
    },
  ]));

  assert.throws(() => validarMetasPublicas([
    {
      mes: "2026-09-01",
      cb_manha: -1,
      cb_noite: 120,
      aa_manha: 90,
      aa_noite: 95,
      ab_manha: 80,
      ab_noite: 85,
    },
  ]));
});

test("rejeita mês duplicado", () => {
  const registro = {
    mes: "2026-09-01",
    cb_manha: 100,
    cb_noite: 120,
    aa_manha: 90,
    aa_noite: 95,
    ab_manha: 80,
    ab_noite: 85,
  };

  assert.throws(() => validarMetasPublicas([registro, { ...registro }]));
});

test("valida a configuração pública do Supabase", () => {
  assert.equal(validarConfiguracaoPublica({
    supabaseUrl: "https://nnxzkokfbnshdidaioet.supabase.co",
    supabaseAnonKey: "sb_publishable_exemplo_seguro",
  }), true);

  assert.equal(validarConfiguracaoPublica({
    supabaseUrl: "http://nnxzkokfbnshdidaioet.supabase.co",
    supabaseAnonKey: "sb_publishable_exemplo_seguro",
  }), false);

  assert.equal(validarConfiguracaoPublica({
    supabaseUrl: "https://example.com",
    supabaseAnonKey: "sb_secret_nao_pode",
  }), false);
});

test("aceita somente os quatro horários públicos esperados", () => {
  const horario = validarHorariosPublicos([
    {
      manha_inicio: "09:00:00",
      manha_fim: "16:00:00",
      noite_inicio: "16:00:00",
      noite_fim: "22:00:00",
    },
  ]);

  assert.equal(horario.manha_inicio, "09:00");
  assert.equal(horario.noite_fim, "22:00");

  assert.throws(() => validarHorariosPublicos([
    {
      manha_inicio: "09:00:00",
      manha_fim: "16:00:00",
      noite_inicio: "16:00:00",
      noite_fim: "22:00:00",
      atualizado_por: "uuid",
    },
  ]));
});
