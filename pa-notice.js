function dismissPaNotice() {
  const notice = document.querySelector("#paNotice");
  if (!notice) return;

  notice.hidden = true;
}

const paNotice = document.querySelector("#paNotice");
const paNoticeClose = document.querySelector("#paNoticeClose");
const paNoticeDismiss = document.querySelector("#paNoticeDismiss");
const paNoticeBadge = document.querySelector(".pa-notice-badge");
const paNoticeTitle = document.querySelector("#paNoticeTitle");
const paNoticeDescription = document.querySelector("#paNoticeDescription");
const paNoticeLink = document.querySelector("#paNoticeLink");

if (paNotice) {
  if (paNoticeBadge) paNoticeBadge.textContent = "Importante • novidade";
  if (paNoticeTitle) paNoticeTitle.textContent = "Crie seu acesso ao Cálculo de PA";
  if (paNoticeDescription) {
    paNoticeDescription.innerHTML =
      "<strong>Crie seu login</strong> no Cálculo de PA para lançar suas vendas e peças e acompanhar seu PA durante o mês. Depois, você pode entrar sempre pelo atalho <strong>Calcular PA</strong> no cantinho superior direito desta página.";
  }
  if (paNoticeLink) paNoticeLink.textContent = "Criar login / acessar PA";

  paNotice.hidden = false;
}

paNoticeClose?.addEventListener("click", dismissPaNotice);
paNoticeDismiss?.addEventListener("click", dismissPaNotice);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paNotice && !paNotice.hidden) {
    dismissPaNotice();
  }
});
