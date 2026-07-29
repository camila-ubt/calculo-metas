window.APP_CONFIG = {
  supabaseUrl: "https://nnxzkokfbnshdidaioet.supabase.co",
  supabaseAnonKey: "sb_publishable_T9uKhKxBEekm5SZqSl7nNA_qs7pXG3g",
};

const fetchOriginal = window.fetch.bind(window);

window.fetch = function fetchComMetasCompartilhadas(recurso, opcoes) {
  const url = typeof recurso === "string" ? recurso : recurso?.url || "";
  const consultaAntiga = "/rest/v1/metas_mensais?select=*&order=mes.desc";

  if (url.includes(consultaAntiga)) {
    const novaUrl = `${window.APP_CONFIG.supabaseUrl}/rest/v1/rpc/metas_publicas`;
    return fetchOriginal(novaUrl, opcoes);
  }

  return fetchOriginal(recurso, opcoes);
};

document.addEventListener("DOMContentLoaded", () => {
  const administrar = document.querySelector('a[href="admin.html"]');
  const separador = administrar?.nextElementSibling;
  administrar?.remove();
  if (separador?.textContent?.trim() === "•") separador.remove();
});
