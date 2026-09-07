const PA_NOTICE_STORAGE_KEY = "calculoMetasPaNoticeDismissedV1";

function getPaNoticeDismissed() {
  try {
    return localStorage.getItem(PA_NOTICE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberPaNoticeDismissed() {
  try {
    localStorage.setItem(PA_NOTICE_STORAGE_KEY, "true");
  } catch {
    // O aviso ainda pode ser fechado mesmo se o armazenamento estiver indisponível.
  }
}

function dismissPaNotice() {
  const notice = document.querySelector("#paNotice");
  if (!notice) return;

  rememberPaNoticeDismissed();
  notice.hidden = true;
}

const paNotice = document.querySelector("#paNotice");
const paNoticeClose = document.querySelector("#paNoticeClose");
const paNoticeDismiss = document.querySelector("#paNoticeDismiss");
const paNoticeLink = document.querySelector("#paNoticeLink");

if (paNotice && !getPaNoticeDismissed()) {
  paNotice.hidden = false;
}

paNoticeClose?.addEventListener("click", dismissPaNotice);
paNoticeDismiss?.addEventListener("click", dismissPaNotice);
paNoticeLink?.addEventListener("click", rememberPaNoticeDismissed);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paNotice && !paNotice.hidden) {
    dismissPaNotice();
  }
});
