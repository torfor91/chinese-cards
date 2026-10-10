const statusEl = document.getElementById('status');

document.getElementById('send').addEventListener('click', async () => {
  statusEl.textContent = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() ?? '',
    });
    if (!result || !result.trim()) {
      statusEl.textContent = 'Сначала выделите текст на странице.';
      return;
    }
    chrome.runtime.sendMessage({ type: 'send-selection', text: result });
    statusEl.textContent = `Отправлено: «${result.trim().slice(0, 30)}»`;
  } catch {
    statusEl.textContent = 'Не удалось получить выделение на этой странице (служебная страница браузера?).';
  }
});
