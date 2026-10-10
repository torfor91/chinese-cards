// Контекстное меню: выделили текст на любой странице (новость, субтитры, статья) —
// кликнули «Добавить в Китайский тренажёр» — открылась вкладка с приложением,
// где текст уже подставлен в переводчик (см. #add=... в App.jsx основного приложения).

const MENU_ID = 'add-to-chinese-srs';
const DEFAULT_APP_URL = 'http://localhost:5173/';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Добавить «%s» в Китайский тренажёр',
    contexts: ['selection'],
  });
});

async function getAppUrl() {
  const { appUrl } = await chrome.storage.sync.get('appUrl');
  return (appUrl && appUrl.trim()) || DEFAULT_APP_URL;
}

async function sendToApp(text) {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return;
  const base = await getAppUrl();
  const sep = base.includes('#') ? '' : '#';
  const url = `${base}${sep}add=${encodeURIComponent(trimmed)}`;
  chrome.tabs.create({ url });
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_ID) sendToApp(info.selectionText);
});

// Чтобы всплывающее окно (popup.html) тоже могло отправить текущее выделение.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'send-selection') sendToApp(msg.text);
});
