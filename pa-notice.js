function dismissPaNotice() {
  const notice = document.querySelector("#paNotice");
  if (!notice) return;

  notice.hidden = true;
}

const paNotice = document.querySelector("#paNotice");
const paNoticeClose = document.querySelector("#paNoticeClose");
const paNoticeDismiss = document.querySelector("#paNoticeDismiss");

if (paNotice) {
  paNotice.hidden = false;
}

paNoticeClose?.addEventListener("click", dismissPaNotice);
paNoticeDismiss?.addEventListener("click", dismissPaNotice);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paNotice && !paNotice.hidden) {
    dismissPaNotice();
  }
});
